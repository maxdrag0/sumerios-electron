<template>
    <div class="container-view">
          <h1>Unidades Funcionales</h1>

      <div class="container">

        <div class="container_listado_uf">
          <h3>Seleccione un consorcio:</h3>
          <BotonConsorcio />

          <p v-if="consorcioSeleccionado && unidades.length === 0">No hay unidades funcionales para este consorcio.</p>
          <table v-else>
            <thead>
              <tr>
                <th>N° UF</th>
                <th>Propietario</th>
                <th>TÍtulo</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(unidad, index) in unidadesOrdenadas"
              :key="index"
              @click="selectUF(unidad)"
              class="clickable-row">
                <td>{{ unidad.unidadFuncional }}</td>
                <td>{{ unidad.apellidoPropietario }}</td>
                <td>{{ unidad.titulo }}</td>
                <td>{{ unidad.porcentajeUnidad }}</td>
              </tr>
            </tbody>
          </table>

          <button v-if="mostrarBoton()" type="submit" class="btn btn-alert" @click="agregarUF()">
            +
          </button>
          <h3 v-if="consorcioSeleccionado && unidades.length !== 0">Porcentaje total = {{ porcentajeTotalUF }}</h3>

        </div>

        <div class="container_edicion">
          <div v-if="!banderaSeleccion"class="center-content">
            <img
              src="@renderer/assets/sumerios-min.png"
              alt="logo-sumerios"
              class="logo"
            />
          </div>

          <div v-else>
            <div v-if="banderaSeleccion && !agregarUf">
              <h1>Edite las unidades funcionales de {{ consorcioSeleccionado.nombre }}</h1>
              <form @submit.prevent="updateUF">
              <div>
                <label for="unidadFuncional">UF</label>
                <input
                v-model="unidadSeleccionada.unidadFuncional"
                @input="onInputChange"
                :placeholder="`${unidadSeleccionada.unidadFuncional}`"
                id="unidadFuncional"
                class="form-control"
                required
                />
              </div>

              <div>
                        <label for="titulo">Titulo</label>
                        <input
                          v-model="unidadSeleccionada.titulo"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.titulo}`"
                          id="titulo"
                          class="form-control"
                          required
                        />

                        <label for="porcentajeUnidad">Porcentaje</label>
                        <input
                          v-model="unidadSeleccionada.porcentajeUnidad"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.porcentajeUnidad}`"
                          id="porcentajeUnidad"
                          class="form-control"
                          required
                        />
              </div>

              <div>
                        <label for="nombrePropietario">Nombre del Propietario</label>
                        <input
                          v-model="unidadSeleccionada.nombrePropietario"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.nombrePropietario}`"
                          id="nombrePropietario"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="apellidoPropietario">Apellido del Propietario</label>
                        <input
                          v-model="unidadSeleccionada.apellidoPropietario"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.apellidoPropietario}`"
                          id="apellidoPropietario"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="mailPropietario">Mail del Propietario</label>
                        <input
                          v-model="unidadSeleccionada.mailPropietario"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.mailPropietario}`"
                          id="mailPropietario"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="telefonoPropietario">Telefono del Propietario</label>
                        <input
                          v-model="unidadSeleccionada.telefonoPropietario"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.telefonoPropietario}`"
                          id="telefonoPropietario"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="apellidoInquilino">Apellido del Inquilino</label>
                        <input
                          v-model="unidadSeleccionada.apellidoInquilino"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.apellidoInquilino}`"
                          id="apellidoInquilino"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="nombreInquilino">Nombre del Inquilino</label>
                        <input
                          v-model="unidadSeleccionada.nombreInquilino"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.nombreInquilino}`"
                          id="nombreInquilino"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="mailInquilino">Mail del Inquilino</label>
                        <input
                          v-model="unidadSeleccionada.mailInquilino"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.mailInquilino}`"
                          id="mailInquilino"
                          class="form-control"
                        />
              </div>

              <div>
                        <label for="telefonoInquilino">Telefono del Inquilino</label>
                        <input
                          v-model="unidadSeleccionada.telefonoInquilino"
                          @input="onInputChange"
                          :placeholder="`${unidadSeleccionada.telefonoInquilino}`"
                          id="telefonoInquilino"
                          class="form-control"
                        />
              </div>

              <button type="submit" class="btn btn-success">Guardar Cambios</button>
              <button type="submit" class="btn btn-alert" @click="cancelarEdicion()">
              Cancelar Edicion
              </button>
              <button v-if="unidadSeleccionada.idUf !== null" type="submit" class="btn btn-alert" @click="deleteUF(unidadSeleccionada.idUf)">
                Eliminar Unidad
              </button>
            </form>
            </div>
            <div v-else-if="banderaSeleccion && agregarUF">
              <h1>Cree una unidad funcional en: {{ consorcioSeleccionado.nombre }}</h1>
              <form @submit.prevent="crearUf()">
                <div>
                  <label for="unidadFuncional">UF</label>
                  <input
                  v-model="unidadSeleccionada.unidadFuncional"
                  @input="onInputChange"
                  :placeholder="`${unidadSeleccionada.unidadFuncional}`"
                  id="unidadFuncional"
                  class="form-control"
                  required
                  />
                </div>

                <div>
                          <label for="titulo">Titulo</label>
                          <input
                            v-model="unidadSeleccionada.titulo"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.titulo}`"
                            id="titulo"
                            class="form-control"
                            required
                          />

                          <label for="porcentajeUnidad">Porcentaje</label>
                          <input
                            v-model="unidadSeleccionada.porcentajeUnidad"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.porcentajeUnidad}`"
                            id="porcentajeUnidad"
                            class="form-control"
                            required
                          />
                </div>

                <div>
                          <label for="nombrePropietario">Nombre del Propietario</label>
                          <input
                            v-model="unidadSeleccionada.nombrePropietario"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.nombrePropietario}`"
                            id="nombrePropietario"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="apellidoPropietario">Apellido del Propietario</label>
                          <input
                            v-model="unidadSeleccionada.apellidoPropietario"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.apellidoPropietario}`"
                            id="apellidoPropietario"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="mailPropietario">Mail del Propietario</label>
                          <input
                            v-model="unidadSeleccionada.mailPropietario"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.mailPropietario}`"
                            id="mailPropietario"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="telefonoPropietario">Telefono del Propietario</label>
                          <input
                            v-model="unidadSeleccionada.telefonoPropietario"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.telefonoPropietario}`"
                            id="telefonoPropietario"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="apellidoInquilino">Apellido del Inquilino</label>
                          <input
                            v-model="unidadSeleccionada.apellidoInquilino"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.apellidoInquilino}`"
                            id="apellidoInquilino"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="nombreInquilino">Nombre del Inquilino</label>
                          <input
                            v-model="unidadSeleccionada.nombreInquilino"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.nombreInquilino}`"
                            id="nombreInquilino"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="mailInquilino">Mail del Inquilino</label>
                          <input
                            v-model="unidadSeleccionada.mailInquilino"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.mailInquilino}`"
                            id="mailInquilino"
                            class="form-control"
                          />
                </div>

                <div>
                          <label for="telefonoInquilino">Telefono del Inquilino</label>
                          <input
                            v-model="unidadSeleccionada.telefonoInquilino"
                            @input="onInputChange"
                            :placeholder="`${unidadSeleccionada.telefonoInquilino}`"
                            id="telefonoInquilino"
                            class="form-control"
                          />
                </div>

                <button type="submit" class="btn btn-success">Crear Unidad Funcional</button>
                <button type="submit" class="btn btn-alert" @click="cancelarCreacion()">
                  Cancelar Creacion
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script setup>
//IMPORTS
import { API_CONSORCIOS, API_UF } from '@renderer/config/config';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAdminStore } from '@renderer/stores/adminStore';
import { useConsorcioStore } from "@renderer/stores/consorcioStore";

import BotonConsorcio from "@renderer/components/BotonConsorcio.vue";

//VARIABLES Y CONSTANTES
// CONSTANTES DE NAVEGACION Y API
const adminStore = useAdminStore();
const apiConsorcios = API_CONSORCIOS(adminStore.administracionData.idAdm); // STORE DE ADM PARA OBTENER EL ID
const router = useRouter();

// CONSTANTES DE CONSORCIOS Y CONSORCIO SELECCIONADO
const consorcioStore = useConsorcioStore();
const consorcios = ref([]);
const consorcioSeleccionado = computed(() => consorcioStore.selectedConsorcio);

// CONSTANTES DE CARGA DE UNIDADES FUNCIONALES
const unidades = ref([]);
const unidadesOrdenadas = computed(() => {
  return unidades.value.slice().sort((a, b) => a.unidadFuncional - b.unidadFuncional);
});

// CONSTANTES PARA MODIFICACION DE UNIDAD FUNCIONAL
const banderaSeleccion = ref(false);
const unsavedChanges = ref(false);
const unidadSeleccionada = ref({
  idConsorcio: unidades.value?.idConsorcio || 0,
})
const agregarUf = ref(false)

// Constantes por porcentaje
const porcentajeTotalUF = ref(0)

//FUNCIONES
// Método para obtener todos los consorcios
async function obtenerConsorcios() {
  try {
    const response = await axios.get(apiConsorcios);
    consorcios.value = response.data;
  } catch (error) {
    console.error('Error al obtener consorcios:', error);
  }
}

// Método para obtener todas las UF de X consorcio
const obtenerUFConsorcios = async (idAdm, idConsorcio) => {
  try {
    const response = await axios.get(`${API_UF(idAdm, idConsorcio)}`);
    unidades.value = response.data;
    porcentajeTotalUF.value = calcularSumaUF();
  } catch (error) {
    console.error('Error las unidades funcionales:', error);
  }
}

// Usar la función cuando el consorcio es seleccionado
watch(consorcioSeleccionado, (nuevoConsorcio) => {
  if (nuevoConsorcio && nuevoConsorcio.idConsorcio) {
    obtenerUFConsorcios(adminStore.administracionData.idAdm, nuevoConsorcio.idConsorcio);
    banderaSeleccion.value = false;
  }
});

// Seleccionar UF
const selectUF = (unidadFuncional) =>{
  agregarUf.value = false;
  unidadSeleccionada.value = {
    idUf: unidadFuncional.idUf || null,
    idConsorcio: unidadFuncional.consorcio?.idConsorcio || 0,
    unidadFuncional: unidadFuncional.unidadFuncional || 0,
    titulo: unidadFuncional.titulo || '',
    porcentajeUnidad: unidadFuncional.porcentajeUnidad || 0,

    // Datos del propietario
    apellidoPropietario: unidadFuncional.apellidoPropietario || '',
    nombrePropietario: unidadFuncional.nombrePropietario || '',
    mailPropietario: unidadFuncional.mailPropietario || '',
    telefonoPropietario: unidadFuncional.telefonoPropietario || '',

    // Datos del inquilino (si aplica)
    apellidoInquilino: unidadFuncional.apellidoInquilino || '',
    nombreInquilino: unidadFuncional.nombreInquilino || '',
    mailInquilino: unidadFuncional.mailInquilino || '',
    telefonoInquilino: unidadFuncional.telefonoInquilino || '',
  };

  banderaSeleccion.value = true;
}

const cancelarEdicion = () => {
  unidadSeleccionada.value = {
    idConsorcio: unidades.value?.idConsorcio || 0,
  }
  banderaSeleccion.value = false;
};


// Marcar cambios no guardados
const onInputChange = () => {
  unsavedChanges.value = true;
};


// CALCULA EL TOTAL DEL PORCENTAJE
const calcularSumaUF = () => {
  try{
    if(unidades.value.length === 0){
      return 0;
    } else{
      let suma = 0

      unidades.value.forEach(uf => {
        suma += uf.porcentajeUnidad
      })

      return suma;
    }
  } catch (error) {
    console.error('Error al sumar el porcentaje:', error);
  }
}

// Función para redirigir a la vista de agregar más UF
const agregarUF = () => {
  agregarUf.value = true;
  banderaSeleccion.value = true;
  unidadSeleccionada.value = {
    idUf: null,
    idConsorcio: consorcioSeleccionado.value.idConsorcio,
    unidadFuncional: '',
    titulo: '',
    porcentajeUnidad: '',

    // Datos del propietario
    apellidoPropietario: '',
    nombrePropietario: '',
    mailPropietario: '',
    telefonoPropietario: '',

    // Datos del inquilino (si aplica)
    apellidoInquilino: '',
    nombreInquilino: '',
    mailInquilino: '',
    telefonoInquilino: '',
  }
}

const mostrarBoton = () => {
  return consorcioSeleccionado.value !== null;
};
// Actualizar UF
const updateUF = async () =>{
  try {
    const response = await axios.put(
      `${API_UF(adminStore.administracionData.idAdm,consorcioSeleccionado.value.idConsorcio)}/${unidadSeleccionada.value.idUf}`,
      unidadSeleccionada.value
    );
    console.log('Unidad Funcional actualizada actualizado:', response.data);
    alert('Unidad Funcional '+
          unidadSeleccionada.value.unidadFuncional+
          '-'+
          unidadSeleccionada.value.titulo+
          '-'+
          unidadSeleccionada.value.apellidoPropietario+
          ' actualizado con éxito.');
    banderaSeleccion.value = false;
    unsavedChanges.value = false;
    obtenerUFConsorcios(adminStore.administracionData.idAdm, consorcioSeleccionado.value.idConsorcio)
  } catch (error) {
    console.error('Error actualizando la UF:', error);
    alert('Error actualizando la UF.');
  }
}

// Eliminar Unidad Funcional
const deleteUF = async (idUF) =>{
  const confirmar = confirm(`¿Estás seguro de que quieres eliminar la UF ${unidadSeleccionada.value.titulo}?`);

  if(confirmar){
    try{
      console.log("Ingreso a delete")
      const response = await axios.delete(`${API_UF(adminStore.administracionData.idAdm,consorcioSeleccionado.value.idConsorcio)}/${idUF}`)
      alert('UF '+unidadSeleccionada.value.unidadFuncional+' - '+unidadSeleccionada.value.titulo+
      ' del consorcio '+consorcioSeleccionado.value.nombre+
      ' eliminada con éxito.');
      banderaSeleccion.value = false;
      unsavedChanges.value = false;
      obtenerUFConsorcios(consorcioSeleccionado.value.idConsorcio)
    } catch (error) {
      console.error('Error eliminando el Consorcio:', error);
      alert('Hubo un error al eliminar el Consorcio.');
    }
  } else{
    alert("Eliminacion cancelada")
  }
}

const crearUf = async () => {
  try{
    const response = await axios.post(`${API_UF(adminStore.administracionData.idAdm,consorcioSeleccionado.value.idConsorcio)}`, unidadSeleccionada.value);
    console.log('Unidad Funcional creada:', response.data);
    unidadSeleccionada.value = {
      idConsorcio: unidades.value?.idConsorcio || 0,
    }
    obtenerUFConsorcios(adminStore.administracionData.idAdm, consorcioSeleccionado.value.idConsorcio)
    banderaSeleccion.value = false;
    unsavedChanges.value = false;
    agregarUF.value = false;
  }catch (error) {
    console.error('Error al crear la unidad funcional:', error);
    alert(error)
  }

};

// CANCELAR CREACION UF
const cancelarCreacion = () => {
  banderaSeleccion.value = false;
  unsavedChanges.value = false;
  obtenerUFConsorcios(adminStore.administracionData.idAdm, consorcioSeleccionado.value.idConsorcio)
  unidadSeleccionada.value = {
    idConsorcio: unidades.value?.idConsorcio || 0,
  }
}

//CICLO DE VIDA
onMounted(() => {
  obtenerConsorcios();
});

onUnmounted(() => {
  consorcioStore.setConsorcio(null);
});

onBeforeRouteLeave((to, from, next) => {
  const porcentaje = calcularSumaUF();

  if (consorcioSeleccionado.value === null) {
    return next();
  }


  if (porcentaje !== 100) {
    if(agregarUf.value){
      return next()
    } else{
      alert(`El porcentaje total del consorcio ${consorcioSeleccionado.value.nombre} debe ser 100%, actualmente es ${porcentaje}`);
    return next(false); // Cancelar la navegación
    }
  }


  if (unsavedChanges.value) {
    const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Estás seguro que quieres salir?');
    return next(confirmLeave); // Permitir o cancelar la navegación según la respuesta del usuario
  }

  // Permitir la navegación sin restricciones
  next();
});

</script>

<style scoped>

.container {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espacio entre las columnas */
}
.container_listado_uf{
  margin-left: 10px;
}

.container_listado_uf,
.container_edicion {
  flex-basis: 50%;
  overflow-y: auto;
  box-sizing: border-box;
  max-height: 80vh;
}

table {
  
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  font-weight: bold;
  background-color: var(--sumerio-marron);
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #e0e0e0;
}


.container-datos-consorcios {
  position: relative;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.logo {
  max-width: 100%;
  max-height: 100%;
}


</style>