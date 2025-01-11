<template>
  <div class="container-view">


      <div class="container">

        <div class="container-consorcios">

          <div v-if="loading">
          </div>

          <div v-else>
            <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Direccion</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(consorcio, index) in consorcios"
                  :key="index"
                  @click="selectConsorcio(consorcio)"
                  class="clickable-row">
                    <td>{{ consorcio.nombre }}</td>
                    <td>{{ consorcio.direccion }}</td>

                  </tr>
                </tbody>
              </table>

              <router-link to="/crear-consorcio">
                <button class="btn btn-primary">+</button>
              </router-link>
          </div>
        </div>

        <div class="container-datos-consorcios">
          <div v-if="!banderaSeleccion" class="center-content">
            <img
              src="@renderer/assets/sumerios-min.png"
              alt="logo-sumerios"
              class="logo"
            />
          </div>

          <div v-else>
            <h2>Edición del consorcio {{ consorcioSeleccionado.nombre }}</h2>
            <form @submit.prevent="updateConsorcio">
              <div>
                <label for="nombre">Nombre</label>
                <input
                v-model="consorcioSeleccionado.nombre"
                @input="onInputChange"
                :placeholder="`${consorcioSeleccionado.nombre}`"
                id="nombre"
                class="form-control"
                required
                />
              </div>
              <div>
                        <label for="direccion">Direccion</label>
                        <input
                          v-model="consorcioSeleccionado.direccion"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.direccion}`"
                          id="direccion"
                          class="form-control"
                          required
                        />

                        <label for="ciudad">Ciudad</label>
                        <input
                          v-model="consorcioSeleccionado.ciudad"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.ciudad}`"
                          id="ciudad"
                          class="form-control"
                          required
                        />
              </div>
              <div>
                <label for="cuit">Cuit</label>
                        <input
                          v-model="consorcioSeleccionado.cuit"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.cuit}`"
                          id="cuit"
                          class="form-control"
                        />
                        <label for="titulo">Titulo de Cuenta</label>
                        <input
                          v-model="consorcioSeleccionado.titulo"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.titulo}`"
                          id="titulo"
                          class="form-control"
                        />

                        <label for="banco">Banco</label>
                        <input
                          v-model="consorcioSeleccionado.banco"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.banco}`"
                          id="banco"
                          class="form-control"
                        />
                        <label for="numCuenta">N° de Cuenta</label>
                        <input
                          v-model="consorcioSeleccionado.numCuenta"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.numCuenta}`"
                          id="numCuenta"
                          class="form-control"
                        />

                        <label for="cbu">CBU</label>
                        <input
                          v-model="consorcioSeleccionado.cbu"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.cbu}`"
                          id="cbu"
                          class="form-control"
                        />
                        <label for="alias">Alias</label>
                        <input
                          v-model="consorcioSeleccionado.alias"
                          @input="onInputChange"
                          :placeholder="`${consorcioSeleccionado.alias}`"
                          id="alias"
                          class="form-control"
                        />

              </div>

              <button type="submit" class="btn btn-success">Guardar Cambios</button>
              <button type="submit" class="btn btn-alert" @click="deleteConsorcio(consorcioSeleccionado.idConsorcio)">
                Eliminar consorcio
              </button>
              <button type="submit" class="btn btn-cancel" @click="cancelarEdicion()">Cancelar cambios</button>
            </form>
          </div>
        </div>

      </div>
  </div>
</template>

<script setup>
//IMPORTS
import { API_CONSORCIOS } from '@renderer/config/config';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { onBeforeRouteLeave } from 'vue-router';
import { useAdminStore } from '@renderer/stores/adminStore';

//VARIABLES Y CONSTANTES
const adminStore = useAdminStore();
const idAdm = adminStore.administracionData.idAdm;
const consorciosUrl = API_CONSORCIOS(idAdm);

const loading = ref(true);
const consorcios = ref([]);

const banderaSeleccion = ref(false);
const unsavedChanges = ref(false);
const consorcioSeleccionado = ref({
});

//FUNCIONES

// Método para obtener todos los consorcios
const obtenerConsorcios = async () => {
  try {
    const response = await axios.get(consorciosUrl);
    consorcios.value = response.data;
  } catch (error) {
    console.error('Error al obtener consorcios:', error);
  } finally {
    loading.value = false;
  }
}

// Función para seleccionar un consorcio y redirigir a la vista de edición
const selectConsorcio = (consorcio) => {
  console.log(JSON.stringify(consorcio))
  consorcioSeleccionado.value = {
    idAdm,
    idConsorcio: consorcio.idConsorcio || 0,

    nombre: consorcio.nombre || '',
    direccion: consorcio.direccion || '',
    ciudad: consorcio.ciudad || '',

    cuit: consorcio.cuit || '',
    titulo: consorcio.titulo || '',
    cbu: consorcio.cbu || '',
    banco: consorcio.banco || '',
    numCuenta: consorcio.numCuenta || '',
    alias: consorcio.alias || '',
  },
  banderaSeleccion.value = true;
};

const cancelarEdicion = ()=>{
  banderaSeleccion.value = false;
}
// Método para actualizar un consorcio (por implementar)
const updateConsorcio = async () => {
  try {

    const response = await axios.put(`${consorciosUrl}/${consorcioSeleccionado.value.idConsorcio}`, consorcioSeleccionado.value);
;
    console.log('Consorcio actualizado:', response.data);
    alert('Consorcio '+consorcioSeleccionado.value.nombre+' actualizado con éxito.');
    banderaSeleccion.value = false;
    unsavedChanges.value = false;
    obtenerConsorcios();
  } catch (error) {
    console.error('Error actualizando el Consorcio:', error);
    alert('Hubo un error al actualizar el Consorcio.');
  }
};

// Marcar cambios no guardados
const onInputChange = () => {
  unsavedChanges.value = true;
};

// Método para eliminar un consorcio (por implementar)
const deleteConsorcio = async (idConsorcio) =>{
  const confirmar = confirm(`¿Estás seguro de que quieres eliminar el consorcio ${consorcioSeleccionado.value.nombre}?`);

  if(confirmar){
    try{
      const response = await axios.delete(`${consorciosUrl}/${idConsorcio}`)
      alert('Consorcio '+consorcioSeleccionado.value.nombre+' eliminado con éxito.');
      banderaSeleccion.value = false;
      unsavedChanges.value = false;
      obtenerConsorcios();
    } catch (error) {
      console.error('Error eliminando el Consorcio:', error);
      alert('Hubo un error al eliminar el Consorcio.');
    }
  } else{
    alert("Eliminacion cancelada")
  }
}

onMounted(() => {
  obtenerConsorcios();
});

onBeforeRouteLeave((to, from, next) => {
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
});
</script>

<style scoped>

.container {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espacio entre las columnas */
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.container-consorcios,
.container-datos-consorcios {
  flex-basis: 50%; /* Ocupa el 50% del contenedor principal */
  overflow-y: auto; /* Desplazamiento vertical si hay contenido extenso */
  box-sizing: border-box; /* Asegura que el padding y el borde se incluyan en el ancho total */
  max-height: 80vh; /* Ajusta según el espacio que desees ocupar verticalmente */
}

/* Estilos para la tabla */
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

.container-consorcios,
.container-datos-consorcios {
  flex-basis: 50%; /* Ocupa el 50% del contenedor principal */
  overflow-y: auto; /* Desplazamiento vertical si hay contenido extenso */
  box-sizing: border-box; /* Asegura que el padding y el borde se incluyan en el ancho total */
  max-height: 80vh; /* Ajusta según el espacio que desees ocupar verticalmente */
  padding: 10px; /* Espacio interno */
  background-color: #f3d08e; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para profundidad */
}

.container-datos-consorcios h2 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333; /* Color de texto principal */
  text-align: center;
}

.container-datos-consorcios form {
  display: flex;
  flex-direction: column; /* Apila los elementos verticalmente */
  gap: 2px; /* Espaciado entre elementos */
}

.container-datos-consorcios form div {
  display: flex;
  flex-direction: column;
}

.container-datos-consorcios label {
  font-weight: bold;
  color: #555; /* Color del texto de las etiquetas */
}

.container-datos-consorcios .form-control {
  padding: 1px;
  font-size: 1rem;
  border: 1px solid #ddd; /* Borde suave */
  border-radius: 4px;
  transition: border-color 0.2s ease-in-out;
}

.container-datos-consorcios .form-control:focus {
  border-color: #007bff; /* Azul al enfocar */
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.container-datos-consorcios .btn {
  padding: 2px 1px;
  font-size: 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.2s;
}

.container-datos-consorcios .btn-success {
  background-color: #28a745; /* Verde */
  font-weight: bold;
  color: white;
}

.container-datos-consorcios .btn-success:hover {
  background-color: #218838;
}

.container-datos-consorcios .btn-alert {
  background-color: #dc3545; /* Rojo */
  font-weight: bold;
  color: white;
}

.container-datos-consorcios .btn-alert:hover {
  background-color: #c82333;
}

.container-datos-consorcios .btn-cancel {
  background-color: #d8d6d6;
  font-weight: bold;
  color: black;
}

.container-datos-consorcios .btn-cancel:hover {
  background-color: #8d8b8b;
}

/* Solo afecta al div cuando banderaSeleccion es falso */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Asegura que el contenedor ocupe toda la altura disponible */
}

.logo {
  max-width: 100%;
  max-height: 100%;
}

</style>



