<template>
  <div class="container-view">
    <div class="selector-consorcio">
      <BotonConsorcio />
    </div>
    <div v-if="consorcioStore.selectedConsorcio">
      <h1>Liquidando período -> {{ intermediaStore.selectedIntermedia?.periodo }}</h1>
    </div>
    <div class="tablas-container">
        <!-- Tabla de Egresos -->
        <div class="tabla">
          <h2>Egresos</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Titulo</th>
                <th>Proveedor</th>
                <th>Total Final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="egreso in egresos" :key="egreso.idEgreso">
                <td>{{ egreso.fecha }}</td>
                <td>{{ egreso.titulo }}</td>
                <td>{{ obtenerNombreProveedor(egreso.idProveedor) }}</td>
                <td>{{ egreso.totalFinal }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Gastos Particulares -->
        <div class="tabla">
          <h2>Gastos Particulares</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Titulo</th>
                <th>Proveedor</th>
                <th>Unidad Funcional</th>
                <th>Total Final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gasto in gastosParticulares" :key="gasto.idGastoParticular">
                <td>{{ gasto.fecha }}</td>
                <td>{{ gasto.titulo }}</td>
                <td>{{ obtenerNombreProveedor(gasto.idProveedor) }}</td>
                <td>{{ obtenerUnidadFuncional(gasto.idUf) }} - {{ obtenerApellidoPropietario(gasto.idUf) }}</td>
                <td>{{ gasto.totalFinal }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Pagos UF -->
        <div class="tabla">
          <h2>Pagos UF</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Unidad Funcional</th>
                <th>Forma de pago</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagosUf" :key="pago.idPagoUf">
                <td>{{ pago.fecha }}</td>
                <td>{{ obtenerUnidadFuncional(pago.idUf) }} - {{ obtenerApellidoPropietario(pago.idUf) }}</td>
                <td>{{ pago.formaPago }}</td>
                <td>{{ pago.valor }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Ingresos -->
        <div class="tabla">
          <h2>Ingresos</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Título</th>
                <th>Proveedor</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ingreso in ingresos" :key="ingreso.idIngreso">
                <td>{{ ingreso.fecha }}</td>
                <td>{{ ingreso.titulo }}</td>
                <td>{{ obtenerNombreProveedor(ingreso.idProveedor) }}</td>
                <td>{{ ingreso.valor }}</td>
              </tr>
            </tbody>
          </table>
        </div>


    </div>
    <div v-if="selectedConsorcio">
      <h3>Intereses por mora:</h3>
      <input
        type="number"
        v-model="porcentajeIntereses"
        placeholder="Porcentaje de intereses"
        min="0"
        step="0.01"
      />
      <button @click="liquidarExpensa">LIQUIDAR EXPENSA</button>
      <button @click="restablecerPeriodo">RESTABLECER PERÍODO PREVIO</button>
    </div>

  </div>
</template>

<script setup>
  import axios from 'axios';
  import BotonConsorcio from "@renderer/components/BotonConsorcio.vue";
  import { API_UF } from '@renderer/config/config';
  import { ref, watch, onMounted, onUnmounted, computed } from "vue";
  import { useAdminStore } from "@renderer/stores/adminStore";
  import { useConsorcioStore } from "@renderer/stores/consorcioStore";
  import { useIntermediaStore } from "@renderer/stores/intermediaStore";
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { useRouter, useRoute } from 'vue-router';

  // Obtener stores
  const adminStore = useAdminStore();
  const consorcioStore = useConsorcioStore();
  const intermediaStore = useIntermediaStore();

  // Referencias reactivas
  const selectedConsorcio = computed(() => consorcioStore.selectedConsorcio);

  // Instancias del router y la ruta actual
  const router = useRouter();
  const route = useRoute();

  // MOVIMIENTOS
  const egresos = ref([]);
  const gastosParticulares = ref([]);
  const pagosUf = ref([]);
  const ingresos = ref([]);

  const expensa = ref({
    idExpensa: null,
    expensaCreateDTO:{
      idConsorcio: null,
      periodo: null,
      porcentajeIntereses: 0,
      porcentajeSegundoVencimiento: 0
    }
  });
  const porcentajeIntereses = ref(0);

  // Watch para actualizar idConsorcio al cambiar el selectedConsorcio en el store
  watch(() => consorcioStore.selectedConsorcio, (newConsorcio) => {
    if (newConsorcio) {
      cargarDatos();
      cargarProveedoresAdm();
      cargarUf();
      mostrarDatosExpensa();
    }
  });

  const mostrarDatosExpensa = ()=> console.log(JSON.stringify(expensa.value));

  const cargarDatos = async () => {
    if (!intermediaStore.selectedIntermedia || !intermediaStore.selectedIntermedia.periodo) {
      console.warn('El periodo no está definido.');
      return;
    }

    try {
      const [
        egresosResponse,
        gastosParticularesResponse,
        ingresosResponse,
        pagosUfResponse
      ] = await Promise.all([
        axios.get(`http://localhost:8080/api/egresos/consorcio/${consorcioStore.selectedConsorcio?.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`),
        axios.get(`http://localhost:8080/api/gastos_particulares/consorcio/${consorcioStore.selectedConsorcio?.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`),
        axios.get(`http://localhost:8080/api/ingresos/consorcio/${consorcioStore.selectedConsorcio?.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`),
        axios.get(`http://localhost:8080/api/pagoUF/consorcio/${consorcioStore.selectedConsorcio?.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`)
      ]);

      egresos.value = egresosResponse.data || [];
      gastosParticulares.value = gastosParticularesResponse.data || [];
      ingresos.value = ingresosResponse.data || [];
      pagosUf.value = pagosUfResponse.data || [];

      expensa.value.idExpensa =intermediaStore.selectedIntermedia.idExpensa;
      expensa.value.expensaCreateDTO.idConsorcio = intermediaStore.selectedIntermedia.idConsorcio;
      expensa.value.expensaCreateDTO.periodo =intermediaStore.selectedIntermedia.periodo;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      alert('Hubo un problema al cargar los datos. Inténtalo nuevamente más tarde.');
    }
  };

  // PROVEEDORES
  const proveedores = ref([]);

  const cargarProveedoresAdm = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/administraciones/${adminStore.administracionData.idAdm}/proveedores`
      );
      proveedores.value = response.data;
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };
  const obtenerNombreProveedor = (idProveedor) => {
    const proveedor = proveedores.value.find(prov => prov.idProveedor === idProveedor);
    return proveedor ? proveedor.nombre : "Proveedor no encontrado";
  }

  // UFs
  const unidades = ref([]);

  const cargarUf = async () => {
    try {
        const response = await axios.get(`${API_UF(adminStore.administracionData.idAdm, selectedConsorcio.value.idConsorcio)}`);
        unidades.value = response.data;
    } catch (error) {
        console.error('Error las unidades funcionales:', error);
    }
  }

  const obtenerApellidoPropietario = (idUf) => {
    const uf = unidades.value.find(uf => uf.idUf === idUf);
    return uf ? uf.apellidoPropietario : "Propietario no encontrado";
  };

  const obtenerUnidadFuncional = (idUf) => {
    const uf = unidades.value.find(uf => uf.idUf === idUf);
    return uf ? uf.unidadFuncional : "Propietario no encontrado";
  };

  const liquidarExpensa = async ()=>{
    try{
      expensa.value.expensaCreateDTO.porcentajeIntereses = porcentajeIntereses.value;
      console.log(JSON.stringify(expensa.value))

      const response = await axios.post(`http://localhost:8080/api/expensas/consorcio/${consorcioStore.selectedConsorcio?.idConsorcio}`, expensa.value)
      toast.success('Expensa liquidada con éxito!',{
          "theme": "colored",
          "type": "success",
          "position": "top-center",
          "transition": "flip",
          "dangerouslyHTMLString": true
      });
      intermediaStore.loadIntermedias();
      consorcioStore.setConsorcio(null);

      egresos.value = [];
      gastosParticulares.value = [];
      ingresos.value = [];
      pagosUf.value = [];
      expensa.value = {
        idExpensa: null,
        expensaCreateDTO:{
          idConsorcio: null,
          periodo: null,
          porcentajeIntereses: 0,
          porcentajeSegundoVencimiento: 0
        }
      };
    porcentajeIntereses.value = 0;
    consorcioStore.setConsorcio(null);

    } catch (error) {
        console.error('Error al liquidar la expensa:', error);
    }
  }

  const restablecerPeriodo = async ()=>{
    console.log(JSON.stringify(expensa.value));

    const confirmar = confirm('Está seguro que quiere restablecer el período previo? Se perderá todos los cambios hechos en el período actual.');
    if(confirmar){
      try{
        const response = axios.delete(`http://localhost:8080/api/expensas/${expensa.value.idExpensa}`);
        toast.success('Periodo restablecido con éxito!',{
          "theme": "colored",
          "type": "success",
          "position": "top-center",
          "transition": "flip",
          "dangerouslyHTMLString": true
        });

        intermediaStore.loadIntermedias();
        consorcioStore.setConsorcio(null);

        egresos.value = [];
        gastosParticulares.value = [];
        ingresos.value = [];
        pagosUf.value = [];
        expensa.value = {
          idExpensa: null,
          expensaCreateDTO:{
            idConsorcio: null,
            periodo: null,
            porcentajeIntereses: 0,
            porcentajeSegundoVencimiento: 0
          }
        };
        porcentajeIntereses.value = 0;
        consorcioStore.setConsorcio(null);

        recargarVista()
      } catch (error) {
        console.error('Error al liquidar la expensa:', error);
      }
    } else{
      alert('Accion cancelada.')
    }

  }

  function recargarVista() {
    router.push({ name: 'home' });

  }

  onMounted(() => {
    intermediaStore.loadIntermedias();
  });

  onUnmounted(() => {
    consorcioStore.setConsorcio(null);
  });
</script>

<style scoped>
  .container-view {
  padding: 20px;
}

.selector-consorcio {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tablas-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin-top: 20px;
}

.tabla {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
}

.tabla h2 {
  text-align: center;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #007bff;
  color: white;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
