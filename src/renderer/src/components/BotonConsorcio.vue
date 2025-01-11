<template>
  <div>
    <button @click="toggleDropdown" class="btn btn-primary">
      {{ consorcioStore.selectedConsorcio?.nombre || 'Consorcios' }}
    </button>
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <ul>
        <li v-for="consorcio in consorcios" :key="consorcio.idConsorcio">
          <button @click="selectConsorcio(consorcio)" class="dropdown-item">
            {{ consorcio.nombre }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { API_CONSORCIOS } from '@renderer/config/config';
import { useConsorcioStore } from '@renderer/stores/consorcioStore';
import { useAdminStore } from '@renderer/stores/adminStore';

const consorcioStore = useConsorcioStore();
const adminStore = useAdminStore();
const idAdm = adminStore.administracionData.idAdm;
const consorciosUrl = API_CONSORCIOS(idAdm);

// Simulación de datos de consorcios
const consorcios = ref([]);

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectConsorcio = (consorcio) => {
    consorcioStore.setConsorcio(consorcio);
    isDropdownOpen.value = false;

};

const obtenerConsorcios = async () => {
  try {
    const response = await axios.get(consorciosUrl);

    // Asegúrate de que response.data sea un arreglo
    const consorciosData = Array.isArray(response.data) ? response.data : [];

    // Ordena solo si consorciosData no está vacío
    consorcios.value = consorciosData.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  } catch (error) {
    console.error('Error al obtener consorcios:', error);
  }
};

onMounted(() => {
  obtenerConsorcios();
});


</script>

<style>
/* Estilos básicos */
.dropdown-menu {
  position: absolute;
  margin-top: 10px;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}
.dropdown-item {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
}
.dropdown-item:hover {
  background: #f0f0f0;
}
</style>
