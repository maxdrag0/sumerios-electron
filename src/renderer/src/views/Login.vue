<template>
  <div class="container-view">
    <div class="login-container">
      <h1>Iniciar Sesión</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="username" type="username" placeholder="Usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <router-link to="/">Crear nueva administración</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@renderer/stores/auth';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  await authStore.logIn({ username: username.value, password: password.value });
};
</script>

<style scoped>
.container-view {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background: var(--sumerio-rojo-claro);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
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

router-link {
  display: block;
  margin-top: 1.5rem;
  color: var(--sumerio-crema);
  text-decoration: none;
  font-size: 0.9rem;
}

router-link:hover {
  color: var(--sumerio-marron);
}
</style>
