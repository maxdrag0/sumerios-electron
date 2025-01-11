<template>
  <div class="container-view">
    <div class="pagos-container">
      <!-- Componente del botón para seleccionar consorcio, centrado arriba -->
      <div class="selector-consorcio">
        <BotonConsorcio />
      </div>

      <div class="contenido-pagos">
        <div class="unidades-funcionales">
          <div class="tabla-scroll">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>N° UF</th>
                  <th>Propietario</th>
                  <th>Título</th>
                  <th>Total a pagar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="uf in unidadesFuncionales"
                  :key="uf.idUf"
                  @click="selectUnidadFuncional(uf)"
                  :class="{ selected: selectedUnidadFuncional?.idUf === uf.idUf }"
                >
                  <td>{{ uf.unidadFuncional }}</td>
                  <td>{{ uf.apellidoPropietario }}</td>
                  <td>{{ uf.titulo }}</td>
                  <td>{{ uf.estadoCuentaUfDTO.totalFinal | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Formulario de pago, centrado -->

        <div class="formulario-pagos">
          <h4 v-if="selectedUnidadFuncional">Unidad seleccionada: UF</h4>
          <h5 v-if="selectedUnidadFuncional"> {{ selectedUnidadFuncional?.idUf }} - {{ selectedUnidadFuncional?.titulo}}</h5>
          <h4 v-if="selectedUnidadFuncional">Propietario:</h4>
          <h5 v-if="selectedUnidadFuncional"> {{ selectedUnidadFuncional?.apellidoPropietario }} , {{ selectedUnidadFuncional?.nombrePropietario}}</h5>

          <form @submit.prevent="crearPago">
            <div>
              <input type="date" v-model="pago.fecha" required />
            </div>
            <div>
              <label>Valor:</label>
              <input type="number" v-model="pago.valor" required min="0" step="0.01" />
            </div>
            <div>
              <label>Forma de Pago:</label>
              <select v-model="pago.formaPago" required>
                <option value="EFECTIVO">Efectivo</option>
                <option value="BANCO">Banco</option>
              </select>
            </div>
            <div>
              <label>Descripción:</label>
              <textarea v-model="pago.descripcion"></textarea>
            </div>
            <button type="submit" class="btn btn-success">Registrar</button>
          </form>
        </div>

        <!-- Tabla de pagos de la unidad funcional, con scroll si es necesario -->

        <div class="tabla-pagos">
          <div class="tabla-scroll">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Descripción</th>
                  <th>Forma de Pago</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pago in pagosUf" :key="pago.id">
                  <td>{{ pago.fecha }}</td>
                  <td>{{ pago.valor }}</td>
                  <td>{{ pago.descripcion }}</td>
                  <td>{{ pago.formaPago }}</td>
                </tr>
              </tbody>
            </table>
            <button @click="limpiarPagos()">Limpiar pagos</button>

          </div>
        </div>
      </div>

        <!-- Estado cuenta consorcio -->
    <!-- 
          <div v-if="estadoCuentaConsorcio" class="estado-cuenta">
            <h3>Estado de Cuenta del Consorcio</h3>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>TOTAL</th>
                  <th>EFECTIVO</th>
                  <th>BANCO</th>
                  <th>FONDO ADM</th>
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
          </div> -->

      <!-- Estado cuenta unidad funcional -->

      <div v-if="selectedUnidadFuncional?.estadoCuentaUfDTO" class="estado-cuenta">
        <h3>Estado de Cuenta de la Unidad Funcional</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>DEUDA</th>
              <th>INTERES</th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
              <th>D</th>
              <th>E</th>
              <th>Gasto Particular</th>
              <th>Total a pagar</th>
              <th>Saldo Expensa</th>
              <th>Saldo intereses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.deuda }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.intereses }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalA }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalB }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalC }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalD }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalE }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.gastoParticular }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.totalFinal }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.saldoExpensa }}</td>
              <td>{{ selectedUnidadFuncional.estadoCuentaUfDTO.saldoIntereses }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import BotonConsorcio from '@renderer/components/BotonConsorcio.vue';
import { useConsorcioStore } from '@renderer/stores/consorcioStore.js';
import axios from 'axios';
import { API_UF } from '@renderer/config/config';
import { useAdminStore } from '@renderer/stores/adminStore';
import { useIntermediaStore } from '@renderer/stores/intermediaStore';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const adminStore = useAdminStore();
const consorcioStore = useConsorcioStore();
const intermediaStore = useIntermediaStore();

const selectedConsorcio = computed(() => consorcioStore.selectedConsorcio);
const unidadesFuncionales = ref([]);
const selectedUnidadFuncional = ref(null);
const estadoCuentaConsorcio = ref(null);
const pagosUf = ref([]);

const pago = ref({
  idUf: null,
  idConsorcio: null,
  fecha: '',
  valor: 0,
  formaPago: '',
  descripcion: '',
  idExpensa: intermediaStore.selectedIntermedia?.idExpensa,
  periodo: intermediaStore.selectedIntermedia?.periodo
});

// Observar cambios en el consorcio seleccionado
watch(selectedConsorcio, async (newConsorcio) => {
  if (newConsorcio) {
    try {
      await Promise.all([cargarUnidadesFuncionales(), cargarEstadoCuentaConsorcio()]);
      selectedUnidadFuncional.value = null;
      pagosUf.value = null;
    } catch (error) {
      console.error('Error al cargar las unidades funcionales:', error);
    }
  }
});

const cargarEstadoCuentaConsorcio = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/estado_cuenta_consorcio/consorcio/${consorcioStore.selectedConsorcio.idConsorcio}`
    );
    estadoCuentaConsorcio.value = response.data;
  } catch (error) {
    console.error('Error al cargar estado de cuenta del consorcio:', error);
  }
};

// Desmontar la vista y reiniciar el consorcio seleccionado
onUnmounted(() => {
  consorcioStore.setConsorcio(null);
});

const selectUnidadFuncional = (unidadFuncional) => {
  selectedUnidadFuncional.value = unidadFuncional;
  pago.value.idUf = unidadFuncional.idUf;
  pago.value.idConsorcio = selectedConsorcio.value.idConsorcio;
  pago.value.idExpensa= intermediaStore.selectedIntermedia?.idExpensa,
  pago.value.periodo = intermediaStore.selectedIntermedia?.periodo
  cargarPagosUf(selectedUnidadFuncional.value.idUf);
};

const cargarPagosUf = async (idUf) => {
  if (!idUf) {
    console.warn('ID de Unidad Funcional no válido.');
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:8080/api/pagoUF/unidadFuncional/${idUf}/periodo/${intermediaStore.selectedIntermedia.periodo}`
    );

    if (response.data && Array.isArray(response.data)) {
      pagosUf.value = response.data;
    } else {
      console.warn('No se encontraron pagos para la Unidad Funcional especificada.');
      pagosUf.value = []; // Vaciar la lista en caso de que no haya resultados.
    }
  } catch (error) {
    console.error('Error al cargar los pagos de la unidad funcional:', error);
    alert('Hubo un problema al cargar los pagos. Inténtalo nuevamente más tarde.');
  }
};

// Función para registrar el pago
const crearPago = async () => {
  console.log(JSON.stringify(pago.value))
  try {
    await axios.post('http://localhost:8080/api/pagoUF', pago.value);
    toast.success('Pago realizado con éxito!',{
      "theme": "colored",
      "type": "success",
      "position": "top-center",
      "transition": "flip",
      "dangerouslyHTMLString": true
    });

    await Promise.all([
      actualizarUnidadFuncional(selectedUnidadFuncional.value.idUf),
      cargarUnidadesFuncionales(),
      cargarEstadoCuentaConsorcio(),
      cargarPagosUf(selectedUnidadFuncional.value.idUf)
    ]);

    pago.value = {
      idUf: selectedUnidadFuncional.value.idUf,
      idConsorcio: selectedConsorcio.value.idConsorcio,
      fecha: '',
      valor: 0,
      formaPago: '',
      descripcion: '',
      idExpensa: intermediaStore.selectedIntermedia?.idExpensa,
      periodo: intermediaStore.selectedIntermedia?.periodo
    };
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    toast.error('Error al registrar el pago.',{
      "theme": "colored",
      "type": "error",
      "position": "top-center",
      "transition": "flip",
      "dangerouslyHTMLString": true
    });
  }
};

const limpiarPagos = async () =>{
  try {
    const confirmLeave = window.confirm('¿Estás seguro que quieres eliminar los pagos? Se eliminaran todos los pagos de la unidad este período.');
    if (confirmLeave) {
      for (const pago of pagosUf.value){
        try{
          await axios.delete(`http://localhost:8080/api/pagoUF/${pago.idPagoUF}`);
        } catch (error) {
            console.error(`Error al eliminar el pago ${pago.idPagoUF}:`, error);
        }
      }
      await Promise.all([
        actualizarUnidadFuncional(selectedUnidadFuncional.value.idUf),
        cargarUnidadesFuncionales(),
        cargarEstadoCuentaConsorcio(),
        cargarPagosUf(selectedUnidadFuncional.value.idUf)
      ]);
    }
  } catch (error) {
    console.error('Error al eliminar pagos:', error);
    alert('Error al eliminar pagos.');
  }
}

// Actualizar la unidad funcional con los nuevos datos
const cargarUnidadesFuncionales = async () => {
  try {
    const response = await axios.get(
      `${API_UF(adminStore.administracionData.idAdm, consorcioStore.selectedConsorcio.idConsorcio)}`
    );

    if (Array.isArray(response.data)) {
      unidadesFuncionales.value = response.data.sort((a, b) =>
        a.unidadFuncional - b.unidadFuncional
      );
    } else {
      console.error('No hay unidades cargadas:', response.data);
      unidadesFuncionales.value = [];
    }
  } catch (error) {
    console.error('Error al cargar las unidades funcionales:', error);
    unidadesFuncionales.value = [];
  }
};

const actualizarUnidadFuncional = async (idUf) => {
  try {
    const response = await axios.get(`${API_UF(adminStore.administracionData.idAdm, consorcioStore.selectedConsorcio.idConsorcio)}`);
    const unidadFuncionalActualizada = response.data.find((uf) => uf.idUf === idUf);
    selectedUnidadFuncional.value = unidadFuncionalActualizada;
  } catch (error) {
    console.error('Error al actualizar la unidad funcional:', error);
  }
};


// Filtro para formatear como moneda
const currency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

onUnmounted(() => {
  consorcioStore.setConsorcio(null);
});
</script>

<style scoped>
.pagos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.selector-consorcio {
  margin-bottom: 20px;
  text-align: center;
}

.contenido-pagos {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: space-between;
}

.unidades-funcionales {
  width: 30%;
  padding: 10px;
  border-right: 1px solid #ddd;
}

.formulario-pagos {
  width: 30%;
  padding: 10px;
  margin: 0 auto; /* Centrar horizontalmente */
  display: flex;
  flex-direction: column; /* Organizar elementos en columna */
  align-items: center; /* Centrar los elementos horizontalmente dentro del contenedor */
  justify-content: center; /* Centrar los elementos verticalmente dentro del contenedor */
}

.formulario-pagos label, h4, button{
  font-weight: bold;
}

.tabla-pagos {
  width: 30%;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.estado-cuenta {
  width: 45%;
  padding: 1px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th{
  font-weight: bold;
  background-color: var(--sumerio-marron);
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table tr:hover {
  background-color: #f1f1f1;
}

.table tr.selected {
  background-color: #e0f7fa;
  border-color: #00796b;
}

.btn {
  margin-top: 20px;
}

.tabla-scroll {
  overflow-y: auto;
  max-height: 300px;
}

.estado-cuenta {
  display: inline-block;
  width: 45%;
}

@media screen and (max-width: 768px) {
  .contenido-pagos {
    flex-direction: column;
  }

  .unidades-funcionales, .formulario-pagos, .tabla-pagos, .estado-cuenta {
    width: 100%;
  }
}
</style>
