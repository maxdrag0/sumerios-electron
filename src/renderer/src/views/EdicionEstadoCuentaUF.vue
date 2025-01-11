<template>
    <div class="container-view">
      <div class="period-selector">
        <label for="periodo">Seleccionar Período:</label>
        <input id="periodo" type="month" v-model="periodoSeleccionado" required/>
      </div>

      <div class="main-content">
        <div class="uf-list">
          <table>
            <thead>
              <tr>
                <th>N° UF</th>
                <th>Titulo</th>
                <th>%</th>
                <th>Propietario</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(unidad, index) in unidadesOrdenadas"
                :key="index"
                class="clickable-row"
                @click="seleccionarUnidad(unidad, unidad.estadoCuentaUfDTO)"
              >
                <td>{{ unidad.unidadFuncional }}</td>
                <td>{{ unidad.titulo }}</td>
                <td>{{ unidad.porcentajeUnidad }}</td>
                <td>{{ unidad.apellidoPropietario }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="edit-section">
          <h3>Editar Estado de Cuenta de UF {{ unidadSeleccionada.unidadFuncional }} - {{ unidadSeleccionada.apellidoPropietario }}. PERIODO {{ estadoCuentaUf.periodo }}</h3>
          <form @submit.prevent="guardarCambios">
            <div>
              <label for="deuda">Deuda:</label>
              <input id="deuda" type="number" v-model="estadoCuentaUf.deuda" />
            </div>
            <div>
              <label for="intereses">Intereses:</label>
              <input id="intereses" type="number" v-model="estadoCuentaUf.intereses" />
            </div>
            <div>
              <label for="totalA">Total A:</label>
              <input id="totalA" type="number" v-model="estadoCuentaUf.totalA" />
            </div>
            <div>
              <label for="totalB">Total B:</label>
              <input id="totalB" type="number" v-model="estadoCuentaUf.totalB" />
            </div>
            <div>
              <label for="totalC">Total C:</label>
              <input id="totalC" type="number" v-model="estadoCuentaUf.totalC" />
            </div>
            <div>
              <label for="totalD">Total D:</label>
              <input id="totalD" type="number" v-model="estadoCuentaUf.totalD" />
            </div>
            <div>
              <label for="totalE">Total E:</label>
              <input id="totalE" type="number" v-model="estadoCuentaUf.totalE" />
            </div>
            <div>
              <label for="gastoParticular">Gasto Particular:</label>
              <input id="gastoParticular" type="number" v-model="estadoCuentaUf.gastoParticular" />
            </div>
            <div>
              <label for="totalFinal">Total Final:</label>
              <input id="totalFinal" type="number" v-model="estadoCuentaUf.totalFinal" />
            </div>
            <button type="submit">Guardar Cambios</button>
            <button type="button" @click="cancelarEdicion">Cancelar</button>
          </form>
        </div>

        <div v-if="mostrarAdvertencia" class="mensaje-error">
            Por favor, seleccione un período antes de elegir una unidad funcional.
        </div>
      </div>
    </div>
</template>

<script setup>
  // IMPORTS
  import { API_UF } from '@renderer/config/config';
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { useAdminStore } from '@renderer/stores/adminStore';
  import { useIntermediaStore } from '@renderer/stores/intermediaStore';

  // ROUTER
  const route = useRoute();
  const adminStore = useAdminStore();
  const intermediaStore = useIntermediaStore();
  const idAdm = adminStore.administracionData.idAdm;
  const idConsorcio = route.params.idConsorcio;

  // API
  const apiUF = `${API_UF(idAdm, idConsorcio)}`;
  const periodoSeleccionado = ref('');

  const unidades = ref([]);
  const unidadesOrdenadas = computed(() => unidades.value.slice().sort((a, b) => a.unidadFuncional - b.unidadFuncional));

  const unidadSeleccionada = ref({})
  const estadoCuentaUf = ref({
    idEstadoCuentaUf: null,
    idUf: null,
    periodo: '',
    deuda: 0,
    intereses: 0,
    totalA: 0,
    totalB: 0,
    totalC: 0,
    totalD: 0,
    totalE: 0,
    gastoParticular: 0,
    totalFinal: 0,
    saldoExpensa: 0,
    saldoIntereses: 0,
  });
  const mostrarAdvertencia = ref(false);

  const expensa = ref({
    idConsorcio,
    periodo: periodoSeleccionado.value || '',
    intereses: 0,
    segundoVencimiento: 0,
  });

  const seleccionarUnidad = (unidad, selectEstadoCuentaUf) => {
    if (!periodoSeleccionado.value) {
        mostrarAdvertencia.value = true;
        setTimeout(() => (mostrarAdvertencia.value = false), 2000);
        return;
    }
    unidadSeleccionada.value = unidad;
    estadoCuentaUf.value = {
        ...selectEstadoCuentaUf,
        periodo: periodoSeleccionado.value,
    };

  };

  watch(periodoSeleccionado, (nuevoPeriodo) => {
    if (unidadSeleccionada.value.unidadFuncional) {
        estadoCuentaUf.value.periodo = nuevoPeriodo;
        expensa.value.periodo = nuevoPeriodo;
    }
    });

    const cargarUnidadesFuncionales = async () => {
    try {
      const response = await axios.get(apiUF);
      unidades.value = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error al obtener las unidades funcionales:', error);
    }
  };

  const guardarCambios = async () => {
    console.log(JSON.stringify(estadoCuentaUf.value))
    try {
      await axios.put(`http://localhost:8080/api/estado_cuenta_uf/${estadoCuentaUf.value.idEstadoCuentaUf}`, estadoCuentaUf.value);
      cargarUnidadesFuncionales();
      cancelarEdicion();
      estadoCuentaUf.value = {
            idEstadoCuentaUf: null,
            idUf: null,
            periodo: '',
            deuda: 0,
            intereses: 0,
            totalA: 0,
            totalB: 0,
            totalC: 0,
            totalD: 0,
            totalE: 0,
            gastoParticular: 0,
            totalFinal: 0,
            saldoExpensa: 0,
            saldoIntereses: 0,
        };
        unidadSeleccionada.value = {}
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const cancelarEdicion = () => {
    estadoCuentaUf.value = {
      idEstadoCuentaUf: null,
      idUf: null,
      periodo: '',
      deuda: 0,
      intereses: 0,
      totalA: 0,
      totalB: 0,
      totalC: 0,
      totalD: 0,
      totalE: 0,
      gastoParticular: 0,
      totalFinal: 0,
      saldoExpensa: 0,
      saldoIntereses: 0,
    };
  };

  onMounted(() => cargarUnidadesFuncionales());
  onUnmounted(() => {
    intermediaStore.loadIntermedias();
    consorcioStore.setConsorcio(null);
  });
</script>

<style scoped>
  .container-view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .period-selector {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .period-selector label {
    margin-right: 10px;
  }

  .period-selector button {
    margin-left: 10px;
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin-top: 20px;
  }

  .uf-list {
    width: 45%;
  }

  .uf-list table {
    width: 100%;
    border-collapse: collapse;
  }

  .uf-list th,
  .uf-list td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }

  .uf-list th {
    background-color: #f5f5f5;
  }

  .clickable-row:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  .edit-section {
    width: 45%;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .edit-section form div {
    margin-bottom: 10px;
  }

  button {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }

  .mensaje-error {
    position: fixed; /* Lo fija en la pantalla */
    top: 50%; /* Centrado vertical */
    left: 50%; /* Centrado horizontal */
    transform: translate(-50%, -50%); /* Para que quede perfectamente centrado */
    background-color: rgba(255, 0, 0, 0.8); /* Fondo semitransparente */
    color: white; /* Texto blanco */
    padding: 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 1000; /* Asegura que quede por encima de otros elementos */
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    min-width: 200px;
    text-align: center;
    }
</style>

