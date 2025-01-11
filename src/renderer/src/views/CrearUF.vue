<template>
  <div class="container-view">
    <h1>Crear Unidades Funcionales</h1>

    <!-- Contenedor para el listado y el formulario -->
    <div class="container">

      <!-- Listado de Unidades Funcionales -->
      <div class="listado-unidades">
        <h2>Unidades Funcionales de {{ consorcio.nombre }}</h2>
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
            <tr v-for="(unidad, index) in unidadesOrdenadas"
                :key="index"
                class="clickable-row"
                @click="seleccionarUnidad(unidad)">
              <td>{{ unidad.unidadFuncional }}</td>
              <td>{{ unidad.titulo }}</td>
              <td>{{ unidad.porcentajeUnidad }}</td>
              <td>{{ unidad.apellidoPropietario }}</td>
            </tr>
          </tbody>
        </table>
        <h3>Porcentaje total = {{ porcentajeTotalUF }}</h3>
      </div>

      <!-- Formulario para crear Unidades Funcionales -->
      <div class="formulario-crear">

        <div v-if="!banderaSeleccion">
          <h2>Agregar Unidad Funcional</h2>
          <form @submit.prevent="agregarUnidadFuncional">
            <!-- Campos del formulario para unidad funcional -->
            <div>
              <label for="numero">N° UF:</label>
              <input type="text" v-model="unidad.unidadFuncional" required />
            </div>
            <div>
              <label for="numero">Titulo:</label>
              <input type="text" v-model="unidad.titulo" required />
            </div>
            <div>
              <label for="porcentajeUnidad">Porcentaje:</label>
              <input type="number" v-model="unidad.porcentajeUnidad" required />
            </div>
            <div>
            <!-- Propietario -->
              <label for="apellidoPropietario">Apellido del Propietario:</label>
              <input type="text" v-model="unidad.apellidoPropietario" required />
            </div>
            <div>
              <label for="nombrePropietario">Nombre del Propietario:</label>
              <input type="text" v-model="unidad.nombrePropietario" required />
            </div>
            <div>
              <label for="telefonoPropietario">Telefono del Propietario:</label>
              <input type="text" v-model="unidad.telefonoPropietario" />
            </div>
            <div>
              <label for="mailPropietario">Mail del Propietario:</label>
              <input type="email" v-model="unidad.mailPropietario" />
            </div>
            <!-- Inquilino -->
            <div>
              <label for="apellidoInquilino">Apellido del Inquilino:</label>
              <input type="text" v-model="unidad.apellidoInquilino" />
            </div>
            <div>
              <label for="nombreInquilino">Nombre del Inquilino:</label>
              <input type="text" v-model="unidad.nombreInquilino" />
            </div>
            <div>
              <label for="telefonoInquilino">Telefono del Inquilino:</label>
              <input type="text" v-model="unidad.telefonoInquilino" />
            </div>
            <div>
              <label for="mailInquilino">Mail del Inquilino:</label>
              <input type="email" v-model="unidad.mailInquilino" />
            </div>

            <button type="submit">Agregar Unidad</button>
          </form>
          <button @click="abrirOpcionesTerminar">Terminar Creación</button>

          <!-- Modal para las opciones -->
          <div v-if="mostrarOpcionesTerminar" class="modal-overlay">
            <div class="modal-content">
              <h2>¿Qué deseas hacer?</h2>
              <button @click="editarEstadosCuenta">Editar Manualmente los Estados de Cuenta</button>
              <button @click="cargarGastos">Cargar Gastos Manualmente</button>
              <button @click="cerrarOpcionesTerminar">Cancelar</button>
            </div>
          </div>

          <div v-if="seleccionarPeriodo" class="modal-overlay">
            <div class="modal-content">
              <label for="periodo">Seleccionar Período a cargar:</label>
              <input id="periodo" type="month" v-model="periodoSeleccionado" required/>
              <h3>{{ expensa.idConsorcio }}</h3>
              <h3>{{ expensa.periodo }}</h3>
              <h3>{{ expensa.porcentajeIntereses }}</h3>
              <h3>{{ expensa.segundoVencimiento }}</h3>
              <button @click="crearPeriodo">Enviar Período</button>
            </div>
          </div>
        </div>

        <div v-else>
          <h2>Edicion UF {{ unidadSeleccionada.unidadFuncional }} - {{ unidadSeleccionada.titulo }} - {{ unidadSeleccionada.apellidoPropietario }}</h2>
          <form @submit.prevent="updateUnidad">
            <div>
              <label for="numero">N° UF:</label>
              <input type="text"
                     v-model="unidadSeleccionada.unidadFuncional"
                     @input="onInputChange"
                     required />
            </div>
            <div>
              <label for="numero">Titulo:</label>
              <input type="text"
                     v-model="unidadSeleccionada.titulo"
                     @input="onInputChange"
                     required />
            </div>
            <div>
              <label for="porcentajeUnidad">Porcentaje:</label>
              <input type="number"
                     v-model="unidadSeleccionada.porcentajeUnidad"
                     @input="onInputChange"
                     required />
            </div>
            <div>
            <!-- Propietario -->
              <label for="apellidoPropietario">Apellido del Propietario:</label>
              <input type="text"
                     v-model="unidadSeleccionada.apellidoPropietario"
                     @input="onInputChange"
                     required />
            </div>
            <div>
              <label for="nombrePropietario">Nombre del Propietario:</label>
              <input type="text"
                     v-model="unidadSeleccionada.nombrePropietario"
                     @input="onInputChange"
                     required />
            </div>
            <div>
              <label for="telefonoPropietario">Telefono del Propietario:</label>
              <input type="text"
                     v-model="unidadSeleccionada.telefonoPropietario"
                     @input="onInputChange"/>
            </div>
            <div>
              <label for="mailPropietario">Mail del Propietario:</label>
              <input type="email"
                     v-model="unidadSeleccionada.mailPropietario"
                     @input="onInputChange"/>
            </div>
            <!-- Inquilino -->
            <div>
              <label for="apellidoInquilino">Apellido del Inquilino:</label>
              <input type="text"
                     v-model="unidadSeleccionada.apellidoInquilino"
                     @input="onInputChange"/>
            </div>
            <div>
              <label for="nombreInquilino">Nombre del Inquilino:</label>
              <input type="text"
                     v-model="unidadSeleccionada.nombreInquilino"
                     @input="onInputChange"/>
            </div>
            <div>
              <label for="telefonoInquilino">Telefono del Inquilino:</label>
              <input type="text"
                     v-model="unidadSeleccionada.telefonoInquilino"
                     @input="onInputChange"/>
            </div>
            <div>
              <label for="mailInquilino">Mail del Inquilino:</label>
              <input type="email"
                     v-model="unidadSeleccionada.mailInquilino"
                     @input="onInputChange"/>
            </div>

            <button type="submit">Guardar cambios</button>
          </form>
          <button type="submit" @click="cancelarEdicion()">Cancelar edicion</button>
          <button type="submit" @click="eliminarUnidad(unidadSeleccionada.idUf)">Eliminar Unidad Funcional</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
//IMPORTS
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import { API_UF, API_CONSORCIOS } from '@renderer/config/config';
import { useAdminStore } from "@renderer/stores/adminStore";
import { useIntermediaStore } from '@renderer/stores/intermediaStore';

// ROUTER
const route = useRoute();
const router = useRouter();

// PARAMETROS RECIBIDOS
const adminStore = useAdminStore();
const idAdm = adminStore.administracionData.idAdm;
const idConsorcio = route.params.idConsorcioCreado;
const consorciosUrl = API_CONSORCIOS(idAdm);
const intermediaStore = useIntermediaStore();

const consorcio = ref({

})
// DIRECCIONES DE API
const apiUF = `${API_UF(idAdm, idConsorcio)}`;

// UNIDAD EN CREACION
const unidad = ref({
  idUf: '',
  idConsorcio,
  unidadFuncional: '',
  titulo: '',
  porcentajeUnidad: 0,
  apellidoPropietario: '',
  nombrePropietario: '',
  mailPropietario: '',
  telefonoPropietario: '',
  apellidoInquilino: '',
  nombreInquilino: '',
  mailInquilino: '',
  telefonoInquilino: '',
});

// LISTA DE UF
const unidades = ref([]);
const unidadesOrdenadas = computed(() => {
  return unidades.value.slice().sort((a, b) => a.unidadFuncional - b.unidadFuncional);
});
const porcentajeTotalUF = ref(0)

// MODIFICACION DE UF
const unidadSeleccionada = ref({
  idUf:'',
  idConsorcio,
  unidadFuncional: '',
  titulo: '',
  porcentajeUnidad: 0,
  apellidoPropietario: '',
  nombrePropietario: '',
  mailPropietario: '',
  telefonoPropietario: '',
  apellidoInquilino: '',
  nombreInquilino: '',
  mailInquilino: '',
  telefonoInquilino: '',
});


const banderaSeleccion = ref(false);
const unsavedChanges = ref(false);

// FUNCION PARA OBTENER LAS UNIDADES FUNCIONALES DEL CONSORCIO ENVIADO
const obtenerUnidadesFuncionales = async () => {
  try {
    const response = await axios.get(apiUF);
    unidades.value = Array.isArray(response.data) ? response.data : [];
    calcularSumaUF()
    const responseConsorcio = await axios.get(`${consorciosUrl}/${idConsorcio}`);
    consorcio.value = responseConsorcio.data;
  } catch (error) {
    console.error('Error al obtener las unidades funcionales:', error);
    unidades.value = []; // Reinicializa en caso de error
  }
};

// CALCULA EL TOTAL DEL PORCENTAJE
const calcularSumaUF = () => {
  let suma = 0

  unidades.value.forEach(uf => {
    suma += uf.porcentajeUnidad
  })

  porcentajeTotalUF.value = suma
}

// SELECCION DE UF
const seleccionarUnidad = (unidadFuncional) => {
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
  console.log(JSON.stringify(unidadSeleccionada.value));
}

// MARCAR CAMBIOS REALIZADOS
const onInputChange = () => {
  unsavedChanges.value = true;
};

// GUARDAR EDICION
const updateUnidad = async () =>{
  try{
    const response = await axios.put(`${apiUF}/${unidadSeleccionada.value.idUf}`, unidadSeleccionada.value);
    console.log('UF actualizado:', response.data);
    alert('UF '+unidadSeleccionada.value.unidadFuncional+' - '+unidadSeleccionada.value.titulo+' editada con exito')
    banderaSeleccion.value = false;
    unsavedChanges.value = false;
    obtenerUnidadesFuncionales();
  }catch(error){
    console.error('Error actualizando la UF:', error);
    alert('Hubo un error al actualizar la UF.');
  }
}

// CANCELAR EDICION
const cancelarEdicion = ()=>{
  banderaSeleccion.value = false;
  unsavedChanges.value = false;
}

// ELIMINAR UF SELECCIONADA
const eliminarUnidad = async (idUf) =>{
  const confirmar = confirm(`¿Estás seguro de que quieres eliminar la UF ${unidadSeleccionada.value.unidadFuncional} - ${unidadSeleccionada.value.titulo}?`);

  if(confirmar){
    try{
      const response = await axios.delete(`${apiUF}/${idUf}`);
      alert('UF '+unidadSeleccionada.value.unidadFuncional+' - '+unidadSeleccionada.value.titulo+' eliminada con exito')
      banderaSeleccion.value = false;
      unsavedChanges.value = false;
      obtenerUnidadesFuncionales()
    } catch(error){
      console.error('Error eliminando la UF:', error);
      alert('Hubo un error al eliminar la UF.');
    }
  } else{
    alert("Eliminacion cancelada")
  }
}

// FUNCION BOTON AGREGAR UNIDAD
const agregarUnidadFuncional = async () => {
  try{
    console.log(('Datos a enviar:', JSON.stringify(unidad.value)))
    const response = await axios.post(apiUF, unidad.value);
    unidades.value.push({ ...unidad.value });
    console.log('Unidad Funcional creada:', response.data);
    // Limpiar UF
    unidad.value = {
      idUf: '',
      idConsorcio,
      unidadFuncional: '',
      titulo:'',
      porcentajeUnidad: 0,
      apellidoPropietario: '',
      nombrePropietario: '',
      mailPropietario: '',
      telefonoPropietario: '',
      apellidoInquilino: '',
      nombreInquilino: '',
      mailInquilino: '',
      telefonoInquilino: '',
      deuda: 0
    };
  obtenerUnidadesFuncionales();
  }catch (error) {
    console.error('Error al crear la unidad funcional:', error);
    alert(error)
  }

};


// Estado para mostrar/ocultar el modal
const mostrarOpcionesTerminar = ref(false);
const seleccionarPeriodo = ref(false);
const periodoSeleccionado = ref('');
const expensa = ref({
    idConsorcio,
    periodo: '',
    porcentajeIntereses: 0,
    segundoVencimiento: 0
});

watch(periodoSeleccionado, (nuevoPeriodo) => {
    if (seleccionarPeriodo.value) {
        expensa.value.periodo = nuevoPeriodo;
    }
});


// Abrir el modal
const abrirOpcionesTerminar = () => {
  const sumaPorcentajes = unidades.value.reduce((acc, curr) => acc + curr.porcentajeUnidad, 0);

  if (sumaPorcentajes !== 100) {
    alert('La suma de los porcentajes debe ser 100');
    return;
  }

  mostrarOpcionesTerminar.value = true;

};

// Cerrar el modal
const cerrarOpcionesTerminar = () => {
  mostrarOpcionesTerminar.value = false;
};

// Opciones al terminar
const editarEstadosCuenta = () => {
  cerrarOpcionesTerminar();
  alert("Redirigiendo a la edición manual de los estados de cuenta...");
  router.push({ name: 'edicionEstadoCuentaUf', params: { idConsorcio: idConsorcio } });

};

const cargarGastos = () => {
  cerrarOpcionesTerminar();
  seleccionarPeriodo.value = true;
};

const crearPeriodo = async () =>{
  console.log(JSON.stringify(expensa.value))
  try{
    const response = await axios.post("http://localhost:8080/api/expensas", expensa.value);
    seleccionarPeriodo.value = false;
    alert("Redirigiendo para cargar gastos...");
    intermediaStore.loadIntermedias();
    router.push({ name: 'egreso' });
  } catch (error) {
    console.error('Error al crear la expensa:', error);
    alert(error)
  }
}

// CICLO DE VIDA
onMounted(() => {
  obtenerUnidadesFuncionales();
});


onBeforeRouteLeave((to, from, next) => {
  if(porcentajeTotalUF.value === 100){
    if (unsavedChanges.value) {
      const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Estás seguro que quieres salir?');
      if (confirmLeave) {
        next(); // Permitir la navegación
      } else {
        next(false); // Cancelar la navegación
      }
    } else {
      next(); // Permitir la navegación sin restricciones
    }
  } else {
    alert(`El porcentaje total del consorcio debe ser 100%, actualmente es ${porcentajeTotalUF.value}`);
    next(false); // Permitir la navegación sin restricciones
  }
});

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espacio entre las columnas */
}

.listado-unidades {
  flex: 1;
  /* Opcional: puedes agregar un máximo de altura si lo necesitas */
  overflow-y: auto;
}

.formulario-crear {
  flex: 1;
}

form div {
  margin-bottom: 1px;
}

button {
  margin-top: 10px;
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
  background-color: #f2f2f2;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}

button {
  margin: 10px;
}
</style>


