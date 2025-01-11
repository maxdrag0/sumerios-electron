<template>
    <div>
      <button @click="toggleDropdown" class="btn btn-primary">
        {{ tipoEgresoStore.selectedTipoEgreso?.descripcion || 'Tipo Egreso' }}
      </button>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <ul>
          <li v-for="tipoEgreso in tiposEgreso" :key="tipoEgreso.name">
            <button @click="selectTipoEgreso(tipoEgreso)" class="dropdown-item">
              {{ tipoEgreso.descripcion }}
            </button>
          </li>
        </ul>
      </div>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useTipoEgresoStore } from '@renderer/stores/tipoEgresoStore';

  const tipoEgresoStore = useTipoEgresoStore();
  // Simulación de datos de consorcios
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

  const isDropdownOpen = ref(false);

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const selectTipoEgreso = (tipoEgreso) => {
    tipoEgresoStore.setTipoEgreso(tipoEgreso);
    isDropdownOpen.value = false;
    console.log(JSON.stringify(tipoEgresoStore.selectedTipoEgreso))

  };

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