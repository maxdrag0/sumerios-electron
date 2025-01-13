<template>
    <div class="container-view">
      <div class="register-container">
        <h1>Crear Administracion</h1>
          <form @submit.prevent="crearAdministracion">
            <div class="input-row">
            <input v-model="administracion.nombre" type="text" placeholder="Nombre" required />
            <input v-model="administracion.direccion" type="text" placeholder="Direccion" required />
          </div>
          <div class="input-row">
            <input v-model="administracion.telefono" type="text" placeholder="Telefono de la administracion" required />
            <input v-model="administracion.cuit" type="text" placeholder="CUIT de la administracion" required />
          </div>
          <div class="input-row">
            <input v-model="administracion.mail" type="mail" placeholder="mail@tumail.com" required />
          </div>
            <button type="submit">Registro</button>
          </form>
      </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useAdminStore } from '@renderer/stores/adminStore';
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';
    import { useRouter, useRoute } from 'vue-router';
    import axios from 'axios';

    // Instancias del router y la ruta actual
    const router = useRouter();
    const route = useRoute();

    const adminStore = useAdminStore();

    const adminCreated = ref(false);
    const administracion = ref({
      administradorId: adminStore.administradorData.idAppUser,
      nombre:'',
      direccion:'',
      telefono:'',
      cuit:'',
      mail:'',
    });

    const crearAdministracion = async()=>{
      try{
        const response = await axios.post('http://localhost:8080/api/administraciones', administracion.value);
        toast.success('Administracion creada con éxito!',{
          "theme": "colored",
          "type": "success",
          "position": "top-center",
          "transition": "flip",
          "dangerouslyHTMLString": true
        });

      administracion.value = {
        administradorId: adminStore.administradorData.idAppUser,
        nombre:'',
        direccion:'',
        telefono:'',
        cuit:'',
        mail:'',
      };

      await adminStore.loadAdministradorData(adminStore.administradorData.username);
      await router.push({ name: 'home' });

      } catch (error) {
        console.error('Error al crear la administracion:', error);
      }
    }

</script>

<style scoped>
  .container-view {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    background: var(--sumerio-rojo-claro);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 100%;
    max-width: 400px;
  }

  .register-container {
    background: var(--sumerio-rojo-claro);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 100%;
    max-width: 600px;
  }

  .input-row {
    display: flex;
    gap: 1rem;
  }

  .input-row input {
    flex: 1;
  }

  h1 {
    color: var(--sumerio-crema);
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: bold;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  input {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 6px;
    background: var(--vt-c-black-mute);
    color: var(--color-text-1);
    font-size: 1rem;
  }

  input::placeholder {
    color: var(--sumerio-crema);
  }

  input:focus {
    outline: 2px solid var(--sumerio-rojo-claro);
  }

  button {
    padding: 0.75rem;
    background: var(--sumerio-marron);
    color: var(--color-text-1);
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-bottom: 1rem;
  }

  button:hover {
    background: #ac843b;
  }

</style>