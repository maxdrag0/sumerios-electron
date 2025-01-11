<template>
  <div class="container-view">
    <div class="selector-consorcio">
      <BotonConsorcio />
      <BotonTipoEgreso />
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
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="egreso in egresosFiltrados"
              :key="egreso.id"
              @click="seleccionarEgreso(egreso)"
            >
              <td>{{ egreso.fecha }}</td>
              <td>{{ obtenerNombreProveedor(egreso.idProveedor) }}</td>
              <td>{{ egreso.totalFinal }}</td>
              <td>{{ egreso.descripcion }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="formulario-egreso">
        <form @submit.prevent="crearOEditarEgreso">
          <div>
            <input type="date" v-model="egreso.fecha" required />
          </div>
          <div class="form-group">
            <label for="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              v-model="egreso.titulo"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="proveedor">Proveedor</label>
            <select id="proveedor" v-model="egreso.idProveedor" class="form-control" required>
              <option v-for="proveedor in proveedores" :key="proveedor.idProveedor" :value="proveedor.idProveedor">
                {{ proveedor.nombre }}
              </option>
            </select>
            <button type="button" class="btn btn-primary btn-sm">
              + Nuevo
            </button>
          </div>
          <div class="form-group">
            <label for="tipoEgreso">Tipo de Egreso</label>
            <select
              id="tipoEgreso"
              v-model="egreso.tipoEgreso"
              class="form-control"
              required
              @change="handleSelectChange"
            >
              <option value="-" >Seleccionar...</option>
              <option
                v-if="!selectedTipoEgreso"
                v-for="tipo in tiposEgreso"
                :key="tipo.name"
                :value="tipo.name"
              >
                {{ tipo.descripcion }}
              </option>
              <option
                v-else-if="egreso.idEgreso === null"
                :value="selectedTipoEgreso.name"
              >
                {{ selectedTipoEgreso.descripcion }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="formaPago">Forma de Pago</label>
            <select id="formaPago" v-model="egreso.formaPago" class="form-control" required>
              <option value="EFECTIVO">Efectivo</option>
              <option value="BANCO">Transferencia</option>
              <option value="BANCO">Deposito</option>
            </select>
          </div>
          <div class="form-group">
            <label for="comprobante">Comprobante</label>
            <input id="comprobante" type="text" v-model="egreso.comprobante" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="egreso.descripcion" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label for="categoriaEgreso">Categoría de Egreso</label>
            <select id="categoriaEgreso" v-model="egreso.categoriaEgreso" class="form-control" required>
              <option v-for="categoria in categoriasEgreso" :key="categoria" :value="categoria">
                {{ categoria }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="totalFinal">Total</label>
            <input
              id="totalFinal"
              type="number"
              v-model="egreso.totalFinal"
              class="form-control"
              required
              min="0"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            {{ egreso.idEgreso ? 'Actualizar' : 'Crear' }}
          </button>
          <button v-if="egreso.idEgreso !== null" @click="eliminarEgreso(egreso.idEgreso)" class="btn btn-primary">
            Eliminar
          </button>
          <button v-if="egreso.idEgreso !== null" @click="cancelarEdicion()" class="btn btn-primary">
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
import BotonTipoEgreso from "@renderer/components/BotonTipoEgreso.vue";
import { computed, ref, watch, onUnmounted, onMounted} from "vue";
import axios from "axios";
import { useAdminStore } from "@renderer/stores/adminStore";
import { useConsorcioStore } from "@renderer/stores/consorcioStore";
import { useTipoEgresoStore } from "@renderer/stores/tipoEgresoStore";
import { useIntermediaStore } from "@renderer/stores/intermediaStore";

const tiposEgreso = ref([
  { name: 'ABONOS_SERVICIOS', descripcion: 'Abonos de servicios' },
  { name: 'CARGAS_SOCIALES', descripcion: 'Cargas sociales' },
  { name: 'FONDO_ADM', descripcion: 'Fondo de administración' },
  { name: 'GASTOS_ADM', descripcion: 'Gastos de administración' },
  { name: 'GASTOS_BANCARIOS', descripcion: 'Gastos bancarios' },
  { name: 'GASTOS_PARTICULARES', descripcion: 'Gastos particulares' },
  { name: 'MANTENIMIENTO', descripcion: 'Mantenimiento de partes comunes' },
  { name: 'SEGURO', descripcion: 'Pago de seguro' },
  { name: 'SERVICIOS_PUBLICOS', descripcion: 'Servicios públicos' },
  { name: 'OTROS', descripcion: 'Otros' },
]);

const adminStore = useAdminStore();
const consorcioStore = useConsorcioStore();
const tipoEgresoStore = useTipoEgresoStore();
const intermediaStore = useIntermediaStore();

const selectedConsorcio = computed(() => consorcioStore.selectedConsorcio);
const selectedTipoEgreso = computed(() => tipoEgresoStore.selectedTipoEgreso);

const egreso = ref({
  idConsorcio: null,
  idProveedor: null,
  fecha: "",
  titulo: "",
  tipoEgreso: "",
  formaPago: "",
  comprobante: "",
  descripcion: "",
  categoriaEgreso: "",
  totalFinal: 0,
  idExpensa: null,
  periodo: ""
});

const egresos = ref([]);
const proveedores = ref([]);
const categoriasEgreso = ["A", "B", "C", "D", "E"];
const estadoCuentaConsorcio = ref(null);

const egresosFiltrados = computed(() => {
  if (selectedTipoEgreso.value && Array.isArray(egresos.value)) {
    return egresos.value.filter((egreso) => {
      return egreso.tipoEgreso === selectedTipoEgreso.value.name;
    });
  }

  if (selectedConsorcio.value) {
    egreso.value = {
      idEgreso: null,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      idProveedor: null,
      fecha: "",
      titulo: "",
      tipoEgreso: "",
      formaPago: "",
      comprobante: "",
      descripcion: "",
      categoriaEgreso: "",
      totalFinal: 0,
      idExpensa: intermediaStore.selectedIntermedia?.idExpensa || null,
      periodo: intermediaStore.selectedIntermedia.periodo
    };
  } else {
    egreso.value = {
      idEgreso: null,
      idConsorcio: null,
      idProveedor: null,
      fecha: "",
      titulo: "",
      tipoEgreso: "",
      formaPago: "",
      comprobante: "",
      descripcion: "",
      categoriaEgreso: "",
      totalFinal: 0,
      idExpensa: null,
      periodo: ""
    };
  }

  return egresos.value;
});

const cargarEgresos = async () => {
  try {
    if (selectedConsorcio.value) {
      const response = await axios.get(
        `http://localhost:8080/api/egresos/consorcio/${selectedConsorcio.value.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`
      );
      egresos.value = response.data;

    }
  } catch (error) {
    console.error("Error al cargar egresos:", error);
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

const obtenerNombreProveedor = (idProveedor) => {
  const proveedor = proveedores.value.find(prov => prov.idProveedor === idProveedor);
  return proveedor ? proveedor.nombre : "Proveedor no encontrado";
};

const seleccionarEgreso = (egresoSeleccionado) => {
  egreso.value = {
    idEgreso: egresoSeleccionado.idEgreso,
    idConsorcio: egresoSeleccionado.idConsorcio,
    idProveedor: egresoSeleccionado.idProveedor,
    fecha: egresoSeleccionado.fecha,
    titulo: egresoSeleccionado.titulo,
    tipoEgreso: egresoSeleccionado.tipoEgreso,
    formaPago: egresoSeleccionado.formaPago,
    comprobante: egresoSeleccionado.comprobante,
    descripcion: egresoSeleccionado.descripcion,
    categoriaEgreso: egresoSeleccionado.categoriaEgreso,
    totalFinal: egresoSeleccionado.totalFinal,
    idExpensa: egresoSeleccionado.idExpensa,
    periodo: egresoSeleccionado.periodo
  };

};

const cancelarEdicion = () => {
  egreso.value = {
    idEgreso: null,
    idConsorcio: null,
    idProveedor: null,
    fecha: "",
    titulo: "",
    tipoEgreso: "",
    formaPago: "",
    comprobante: "",
    descripcion: "",
    categoriaEgreso: "",
    totalFinal: 0,
    idExpensa: null,
    periodo: ""
  }
};

const crearOEditarEgreso = async () => {
  try {
    if (egreso.value.idEgreso !== null) {
      // Si idEgreso no es null, actualiza el egreso
      await axios.put(`http://localhost:8080/api/egresos/${egreso.value.idEgreso}`, egreso.value);
      alert("Egreso actualizado con éxito");
    } else {
      // Si idEgreso es null, crea un nuevo egreso
      await axios.post("http://localhost:8080/api/egresos", egreso.value);
      alert("Egreso creado con éxito");
    }
    await cargarEgresos();
    await cargarEstadoCuenta();

    egreso.value = {
      idEgreso: null,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      idProveedor: null,
      fecha: "",
      titulo: "",
      tipoEgreso: "",
      formaPago: "",
      comprobante: "",
      descripcion: "",
      categoriaEgreso: "",
      totalFinal: 0,
      idExpensa: null,
      periodo: ""
    };
  } catch (error) {
    console.error("Error al crear o editar egreso:", error);
  }
};

const eliminarEgreso = async (idEgreso) => {
  const confirmar = confirm('¿Estás seguro de que quieres eliminar el egreso?');

  if(confirmar){
    try{
      await axios.delete(`http://localhost:8080/api/egresos/${egreso.value.idEgreso}`);
      alert('Egreso eliminado con éxito.');
      await cargarEgresos();
      await cargarEstadoCuenta();

    } catch (error) {
      console.error("Error al eliminar  el egreso:", error);
    }
  } else{
    alert("Eliminacion cancelada")
  }
}
const handleSelectChange = ()=>{
  if (egreso.value.tipoEgreso === "-") {
    deselectTipoEgreso();
  }
}
const deselectTipoEgreso = ()=>{
  tipoEgresoStore.setTipoEgreso(null);
}

// Cargar datos automáticamente cuando cambie el consorcio
watch(selectedConsorcio, () => {
  if (selectedConsorcio.value) {
    cargarEgresos();
    cargarEstadoCuenta();
    cargarProveedoresAdm();
  }

  tipoEgresoStore.setTipoEgreso(null)

  if(selectedConsorcio.value){
    egreso.value = {
      idEgreso:null,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      idProveedor: null,
      fecha: "",
      titulo: "",
      tipoEgreso: "",
      formaPago: "",
      comprobante: "",
      descripcion: "",
      categoriaEgreso: "",
      totalFinal: 0,
      idExpensa: intermediaStore.selectedIntermedia?.idExpensa || null,
      periodo: intermediaStore.selectedIntermedia.periodo
    };
  } else {
    egreso.value = {
      idEgreso:null,
      idConsorcio: null,
      idProveedor: null,
      fecha: "",
      titulo: "",
      tipoEgreso: "",
      formaPago: "",
      comprobante: "",
      descripcion: "",
      categoriaEgreso: "",
      totalFinal: 0,
      idExpensa: null,
      periodo: ""
    };
  }

});


onUnmounted(() => {
  consorcioStore.setConsorcio(null);
  tipoEgresoStore.setTipoEgreso(null)
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


