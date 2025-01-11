<template>
  <div class="container-view">
    <div class="selector-consorcio">
      <BotonConsorcio />
    </div>

    <div class="contenido">
      <div class="tabla-ingresos">
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
              v-for="ingreso in ingresos"
              :key="ingreso.idIngreso"
              @click="seleccionaringreso(ingreso)"
            >
              <td>{{ ingreso.fecha }}</td>
              <td>{{ obtenerNombreProveedor(ingreso.idProveedor) }}</td>
              <td>{{ ingreso.valor }}</td>
              <td>{{ ingreso.descripcion }}</td>
            </tr>
          </tbody>
        </table>
    </div>

      <div class="formulario-ingreso">
        <form @submit.prevent="crearOEditaringreso">
          <div>
            <input type="date" v-model="ingreso.fecha" required />
          </div>
          <div class="form-group">
            <label for="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              v-model="ingreso.titulo"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="proveedor">Proveedor</label>
            <select id="proveedor" v-model="ingreso.idProveedor" class="form-control" required>
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
            <select id="formaPago" v-model="ingreso.formaPago" class="form-control" required>
              <option value="EFECTIVO">Efectivo</option>
              <option value="BANCO">Transferencia</option>
              <option value="BANCO">Deposito</option>
            </select>
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="ingreso.descripcion" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label for="valor">Total</label>
            <input
              id="valor"
              type="number"
              v-model="ingreso.valor"
              class="form-control"
              required
              min="0"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            {{ ingreso.idIngreso ? 'Actualizar' : 'Crear' }}
          </button>
          <button v-if="ingreso.idIngreso !== null" @click="eliminaringreso(ingreso.idIngreso)" class="btn btn-primary">
            Eliminar
          </button>
          <button v-if="ingreso.idIngreso !== null" @click="cancelarEdicion()" class="btn btn-primary">
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
import { computed, ref, watch, onUnmounted, onMounted} from "vue";
import axios from "axios";
import { useAdminStore } from "@renderer/stores/adminStore";
import { useConsorcioStore } from "@renderer/stores/consorcioStore";
import { useIntermediaStore } from '@renderer/stores/intermediaStore';

const adminStore = useAdminStore();
const consorcioStore = useConsorcioStore();
const intermediaStore = useIntermediaStore();

const selectedConsorcio = computed(() => consorcioStore.selectedConsorcio);

const ingreso = ref({
  idConsorcio: null,
  idProveedor: null,
  fecha: "",
  titulo: "",
  formaPago: "",
  descripcion: "",
  valor: 0,
  idExpensa: null,
  periodo: ""
});

const ingresos = ref([]);
const proveedores = ref([]);
const estadoCuentaConsorcio = ref(null);

const cargaringresos = async () => {
  try {
    if (selectedConsorcio.value) {
      const response = await axios.get(
        `http://localhost:8080/api/ingresos/consorcios/${selectedConsorcio.value.idConsorcio}/periodo/${intermediaStore.selectedIntermedia.periodo}`
      );
      ingresos.value = response.data;
      console.log(JSON.stringify(ingresos.value))

    }
  } catch (error) {
    console.error("Error al cargar ingresos:", error);
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
  console.log(JSON.stringify(proveedor))
  return proveedor ? proveedor.nombre : "Proveedor no encontrado";
};

const seleccionaringreso = (ingresoSeleccionado) => {
  ingreso.value = {
    idIngreso: ingresoSeleccionado.idIngreso,
    idConsorcio: ingresoSeleccionado.idConsorcio,
    idProveedor: ingresoSeleccionado.idProveedor,
    fecha: ingresoSeleccionado.fecha,
    titulo: ingresoSeleccionado.titulo,
    formaPago: ingresoSeleccionado.formaPago,
    descripcion: ingresoSeleccionado.descripcion,
    valor: ingresoSeleccionado.valor,
    idExpensa: ingresoSeleccionado.idExpensa,
    periodo: ingresoSeleccionado.periodo
  };
};

const cancelarEdicion = () => {
  ingreso.value = {
    idIngreso: null,
    idConsorcio: null,
    idProveedor: null,
    fecha: "",
    titulo: "",
    formaPago: "",
    descripcion: "",
    valor: 0,
    idExpensa: null,
    periodo: ""
  };
};

const crearOEditaringreso = async () => {
  console.log(JSON.stringify(ingreso.value));
  try {
    if (ingreso.value.idIngreso !== null) {
      // Si idIngreso no es null, actualiza el ingreso
      await axios.put(`http://localhost:8080/api/ingresos/${ingreso.value.idIngreso}`, ingreso.value);
      alert("ingreso actualizado con éxito");
    } else {
      // Si idIngreso es null, crea un nuevo ingreso
      await axios.post("http://localhost:8080/api/ingresos", ingreso.value);
      alert("ingreso creado con éxito");
    }
    await cargaringresos();
    await cargarEstadoCuenta();

    ingreso.value = {
      idIngreso: null,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      idProveedor: null,
      fecha: "",
      titulo: "",
      formaPago: "",
      descripcion: "",
      valor: 0,
      idExpensa: null,
      periodo: ""
    };
  } catch (error) {
    console.error("Error al crear o editar ingreso:", error);
  }
};

const eliminaringreso = async (idIngreso) => {
  const confirmar = confirm('¿Estás seguro de que quieres eliminar el ingreso?');

  if(confirmar){
    try{
      await axios.delete(`http://localhost:8080/api/ingresos/${ingreso.value.idIngreso}`);
      alert('ingreso eliminado con éxito.');
      await cargaringresos();
      await cargarEstadoCuenta();

    } catch (error) {
      console.error("Error al eliminar  el ingreso:", error);
    }
  } else{
    alert("Eliminacion cancelada")
  }
}

// Cargar datos automáticamente cuando cambie el consorcio
watch(selectedConsorcio, () => {
  if (selectedConsorcio.value) {
    cargaringresos();
    cargarEstadoCuenta();
    cargarProveedoresAdm();
  }

  if(selectedConsorcio.value){
    ingreso.value = {
      idIngreso:null,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      idProveedor: null,
      fecha: "",
      titulo: "",
      formaPago: "",
      descripcion: "",
      valor: 0,
      idExpensa: intermediaStore.selectedIntermedia?.idExpensa,
      periodo: intermediaStore.selectedIntermedia?.periodo
    };
  } else {
    ingreso.value = {
      idIngreso:null,
      idConsorcio: null,
      idProveedor: null,
      fecha: "",
      titulo: "",
      formaPago: "",
      descripcion: "",
      valor: 0,
      idExpensa: null,
      periodo: ""
    };
  }

  console.log(JSON.stringify(ingreso.value))
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

.tabla-ingresos {
  flex: 2;
  min-width: 300px;
  background: #f3d08e;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  overflow: auto;
  max-height: 400px; /* Permite scroll si el contenido excede esta altura */
}

.formulario-ingreso {
  flex: 1;
  min-width: 300px;
  background: #f3d08e;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.estado-cuenta {
  margin-top: 20px;
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

.formulario-ingreso label {
  font-weight: bold;
}

.formulario-ingreso input {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 1px;
  width: 50%;
  box-sizing: border-box;
}

.formulario-ingreso .btn {
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

.formulario-ingreso .btn:hover {
  background-color: #0056b3;
}

.formulario-ingreso .btn:nth-child(2) {
  background-color: #6c757d;
}

.formulario-ingreso .btn:nth-child(2):hover {
  background-color: #5a6268;
}
</style>
