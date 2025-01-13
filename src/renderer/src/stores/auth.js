import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAdminStore } from './adminStore';
import { useIntermediaStore } from './intermediaStore';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const token = ref(null); // Token del usuario
  const router = useRouter();

  // Configurar interceptor de Axios
  axios.interceptors.request.use(
    (config) => {
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const logIn = async ({ username, password }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      token.value = response.data.token;
      isAuthenticated.value = true;

      const adminStore = useAdminStore();
      const intermediaStore = useIntermediaStore();

      await adminStore.loadAdministradorData(username);
      await intermediaStore.loadIntermedias();

    } catch (error) {
      alert('Error al iniciar sesión');
      console.error('Error al iniciar sesión:', error);
    }
  };

  const logOut = async () => {
    isAuthenticated.value = false;
    token.value = null;
    const adminStore = useAdminStore();
    adminStore.adminData = null;
    adminStore.adminDetails = null;
    await router.push({ name: 'login' });
  };

  return {
    isAuthenticated,
    token,
    logIn,
    logOut,
  };
});