<template>
    <div class="container-view">
      <div class="selector-consorcio">
        <BotonConsorcio />
      </div>

      <div class="contenido">
        <div class="tabla-egresos">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Total</th>
                <th>Descripción</th>
                <th>Unidad Funcional</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="gastoParticular in gastosParticulares"
                :key="gastoParticular.idGastoParticular"
                @click="seleccionarGastoParticular(gastoParticular)"
              >
                <td>{{ gastoParticular.fecha }}</td>
                <td>{{ obtenerNombreProveedor(gastoParticular.idProveedor) }}</td>
                <td>{{ gastoParticular.totalFinal }}</td>
                <td>{{ gastoParticular.descripcion }}</td>
                <td>{{ obtenerUnidadFuncional(gastoParticular.idUf) }} - {{ obtenerApellidoPropietario(gastoParticular.idUf) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="formulario-egreso">
          <form @submit.prevent="crearOEditarGastoParticular">
            <div>
              <input type="date" v-model="gastoParticular.fecha" required />
            </div>
            <div class="form-group">
              <label for="titulo">Título</label>
              <input
                id="titulo"
                type="text"
                v-model="gastoParticular.titulo"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="idUf">Unidad Funcional</label>
              <select id="idUf" v-model="gastoParticular.idUf" class="form-control" required>
                <option v-for="unidad in unidadesOrdenadas" :key="unidad.idUf" :value="unidad.idUf">
                  {{ unidad.unidadFuncional }} - {{ unidad.apellidoPropietario }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="proveedor">Proveedor</label>
              <select id="proveedor" v-model="gastoParticular.idProveedor" class="form-control" required>
                <option v-for="proveedor in proveedores" :key="proveedor.idProveedor" :value="proveedor.idProveedor">
                  {{ proveedor.nombre }}
                </option>
              </select>
              <button type="button" class="btn btn-primary btn-sm">
                + Nuevo
              </button>
            </div>
            <div class="form-group">
              <label for="formaPago">Forma de Pago</label>
              <select id="formaPago" v-model="gastoParticular.formaPago" class="form-control" required>
                <option value="EFECTIVO">Efectivo</option>
                <option value="BANCO">Transferencia</option>
                <option value="BANCO">Deposito</option>
              </select>
            </div>
            <div class="form-group">
              <label for="comprobante">Comprobante</label>
              <input id="comprobante" type="text" v-model="gastoParticular.comprobante" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción</label>
              <textarea id="descripcion" v-model="gastoParticular.descripcion" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="totalFinal">Total</label>
              <input
                id="totalFinal"
                type="number"
                v-model="gastoParticular.totalFinal"
                class="form-control"
                required
                min="0"
              />
            </div>
            <div class="form-group">
                <label for="pagoConsorcio">¿Pago efectuado por el consorcio?</label>
                <input
                    id="pagoConsorcio"
                    type="checkbox"
                    v-model="gastoParticular.pagoConsorcio"
                    class="form-check-input"
                />
            </div>
            <button type="submit" class="btn btn-primary">
              {{ gastoParticular.idGastoParticular ? 'Actualizar' : 'Crear' }}
            </button>
            <button v-if="gastoParticular.idGastoParticular !== null" @click="eliminarGastoParticular(gastoParticular.idGastoParticular)" class="btn btn-primary">
              Eliminar
            </button>
            <button v-if="gastoParticular.idGastoParticular !== null" @click="cancelarEdicion()" class="btn btn-primary">
              Cancelar edicion
            </button>
          </form>
        </div>
      </div>

      <div v-if="estadoCuentaConsorcio" class="estado-cuenta">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Total</th>
              <th>Efectivo</th>
              <th>Banco</th>
              <th>Fondo Adm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ estadoCuentaConsorcio.total }}</td>
              <td>{{ estadoCuentaConsorcio.efectivo }}</td>
              <td>{{ estadoCuentaConsorcio.banco }}</td>
              <td>{{ estadoCuentaConsorcio.fondoAdm }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
</template>

<script setup>
  import BotonConsorcio from "@renderer/components/BotonConsorcio.vue";
  import { API_UF } from '@renderer/config/config';
  import { computed, ref, watch, onUnmounted, onMounted} from "vue";
  import axios from "axios";
  import { useAdminStore } from "@renderer/stores/adminStore";
  import { useConsorcioStore } from "@renderer/stores/consorcioStore";
  import { useIntermediaStore } from "@renderer/stores/intermediaStore";

  const adminStore = useAdminStore();
  const consorcioStore = useConsorcioStore();
  const intermediaStore = useIntermediaStore();

  const selectedConsorcio = computed(() => consorcioStore.selectedConsorcio);
  const unidades = ref([]);
  const unidadesOrdenadas = computed(() => {
    return unidades.value.slice().sort((a, b) => a.unidadFuncional - b.unidadFuncional);
  });
  const gastoParticular = ref({
    idGastoParticular: null,
    idConsorcio: null,
    idProveedor: null,
    idUf:null,
    fecha: "",
    titulo: "",
    formaPago: "",
    comprobante: "",
    descripcion: "",
    totalFinal: 0,
    idExpensa: null,
    periodo: "",
    pagoConsorcio: false,
  });

  const gastosParticulares = ref([]);
  const proveedores = ref([]);
  const estadoCuentaConsorcio = ref(null);

  const cargarGastosParticulares = async () => {
    try {
      if (selectedConsorcio.value) {
        const response = await axios.get(
          `http://localhost:8080/api/gastos_particulares/consorcios/${selectedConsorcio.value.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`
        );
        gastosParticulares.value = response.data;

      }
    } catch (error) {
      console.error("Error al cargar los gastos particulares:", error);
    }
  };

  const cargarEstadoCuenta = async () => {
    try {
      if (selectedConsorcio.value) {
        const response = await axios.get(
          `http://localhost:8080/api/estado_cuenta_consorcio/consorcio/${selectedConsorcio.value.idConsorcio}`
        );
        estadoCuentaConsorcio.value = response.data;
      }
    } catch (error) {
      console.error("Error al cargar el estado de cuenta:", error);
    }
  };

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

  const cargarUf = async () => {
    try {
        const response = await axios.get(`${API_UF(adminStore.administracionData.idAdm, selectedConsorcio.value.idConsorcio)}`);
        unidades.value = response.data;
    } catch (error) {
        console.error('Error las unidades funcionales:', error);
    }
  }

  const obtenerNombreProveedor = (idProveedor) => {
    const proveedor = proveedores.value.find(prov => prov.idProveedor === idProveedor);
    console.log(JSON.stringify(proveedor))
    return proveedor ? proveedor.nombre : "Proveedor no encontrado";
  };

  const obtenerApellidoPropietario = (idUf) => {
    const uf = unidades.value.find(uf => uf.idUf === idUf);
    console.log(JSON.stringify(uf))
    return uf ? uf.apellidoPropietario : "Propietario no encontrado";
  };

  const obtenerUnidadFuncional = (idUf) => {
    const uf = unidades.value.find(uf => uf.idUf === idUf);
    console.log(JSON.stringify(uf))
    return uf ? uf.unidadFuncional : "Propietario no encontrado";
  };

  const seleccionarGastoParticular = (gastoParticularSeleccionado) => {
    gastoParticular.value = {
      idGastoParticular: gastoParticularSeleccionado.idGastoParticular,
      idConsorcio: gastoParticularSeleccionado.idConsorcio,
      idProveedor: gastoParticularSeleccionado.idProveedor,
      fecha: gastoParticularSeleccionado.fecha,
      titulo: gastoParticularSeleccionado.titulo,
      idUf: gastoParticularSeleccionado.idUf,
      formaPago: gastoParticularSeleccionado.formaPago,
      comprobante: gastoParticularSeleccionado.comprobante,
      descripcion: gastoParticularSeleccionado.descripcion,
      totalFinal: gastoParticularSeleccionado.totalFinal,
      idExpensa: gastoParticularSeleccionado.idExpensa,
      periodo: gastoParticularSeleccionado.periodo,
      pagoConsorcio: gastoParticularSeleccionado.pagoConsorcio,

    };
    console.log(JSON.stringify(gastoParticular.value))

  };

  const cancelarEdicion = () => {
    gastoParticular.value = {
        idGastoParticular:null,
        idConsorcio: null,
        idProveedor: null,
        idUf:null,
        fecha: "",
        titulo: "",
        formaPago: "",
        comprobante: "",
        descripcion: "",
        totalFinal: 0,
        idExpensa: null,
        periodo: "",
        pagoConsorcio: false,
    }
  };

  const crearOEditarGastoParticular = async () => {
    console.log(JSON.stringify(gastoParticular.value));
    console.log(JSON.stringify(intermediaStore.expensa));
    try {
      if (gastoParticular.value.idGastoParticular !== null) {
        await axios.put(`http://localhost:8080/api/gastos_particulares/${gastoParticular.value.idGastoParticular}`, gastoParticular.value);
        alert("Gasto Particular actualizado con éxito");
      } else {
        await axios.post("http://localhost:8080/api/gastos_particulares", gastoParticular.value);
        alert("Gasto Particular creado con éxito");
      }
      await cargarGastosParticulares();
      await cargarEstadoCuenta();

     gastoParticular.value = {
        idGastoParticular: null,
        idConsorcio: selectedConsorcio.value.idConsorcio,
        idProveedor: null,
        idUf:null,
        fecha: "",
        titulo: "",
        formaPago: "",
        comprobante: "",
        descripcion: "",
        totalFinal: 0,
        idExpensa: null,
        periodo: "",
        pagoConsorcio: false,
    }
    } catch (error) {
      console.error("Error al crear o editar gastos particulares:", error);
    }
  };

  const eliminarGastoParticular = async () => {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar el gasto particular?');
    if(confirmar){
      try{
        await axios.delete(`http://localhost:8080/api/gastos_particulares/${gastoParticular.value.idGastoParticular}`);
        alert('Gasto Particular eliminado con éxito.');
        await cargarGastosParticulares();
        await cargarEstadoCuenta();

      } catch (error) {
        console.error("Error al eliminar  el gasto particular:", error);
      }
    } else{
      alert("Eliminacion cancelada")
    }
  }



  // Cargar datos automáticamente cuando cambie el consorcio
  watch(selectedConsorcio, () => {
    if (selectedConsorcio.value) {
      cargarGastosParticulares();
      cargarEstadoCuenta();
      cargarProveedoresAdm();
      cargarUf();
    }

    if(selectedConsorcio.value){
        gastoParticular.value = {
            idGastoParticular: null,
            idConsorcio: selectedConsorcio.value.idConsorcio,
            idProveedor: null,
            idUf:null,
            fecha: "",
            titulo: "",
            formaPago: "",
            comprobante: "",
            descripcion: "",
            totalFinal: 0,
            idExpensa: intermediaStore.selectedIntermedia?.idExpensa || null,
            periodo: intermediaStore.selectedIntermedia.periodo,
            pagoConsorcio: false,
      };
    } else {
        gastoParticular.value = {
        idGastoParticular: null,
        idConsorcio: null,
        idProveedor: null,
        idUf:null,
        fecha: "",
        titulo: "",
        formaPago: "",
        comprobante: "",
        descripcion: "",
        totalFinal: 0,
        idExpensa: null,
        periodo: "",
        pagoConsorcio: false,
      };
    }

  });

  onMounted(() => {
    console.log("INGRESADO GASTO PARTICULAR")
  });

  onUnmounted(() => {
    consorcioStore.setConsorcio(null);
  });

</script>

<style scoped>
  .selector-consorcio {
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .contenido {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    padding: 10px;
    height: 60%;
    margin-bottom: 90px;
  }
  
  .tabla-egresos {
    flex: 2;
    min-width: 300px;
    background: #f3d08e;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    overflow: auto;
    max-height: 400px; /* Permite scroll si el contenido excede esta altura */
  }
  
  .formulario-egreso {
    flex: 1;
    min-width: 300px;
    background: #f3d08e;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  
  .estado-cuenta {
    margin-top: 5px;
  }
  
  .table {
    margin: 0;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }
  
  .table th {
    background-color: var(--sumerio-marron);
    color: black;
    font-weight: bold;
  }
  
  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    vertical-align: middle;
  }
  
  .table tr:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
  
  .table tr.selected {
    background-color: #e0f7fa;
    border-color: #00796b;
  }
  
  h3 {
    text-align: center;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
  }
  
  .formulario-egreso label {
    font-weight: bold;
  }
  
  .formulario-egreso input {
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 1px;
    width: 50%;
    box-sizing: border-box;
  }
  
  .formulario-egreso .btn {
    font-weight: bold;
    background-color: var(--sumerio-marron);
    display: block;
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border: none;
    color: black;
    font-size: 12px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .formulario-egreso .btn:hover {
    background-color: #0056b3;
  }
  
  .formulario-egreso .btn:nth-child(2) {
    background-color: #6c757d;
  }
  
  .formulario-egreso .btn:nth-child(2):hover {
    background-color: #5a6268;
  }
</style>