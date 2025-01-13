import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@renderer/stores/auth.js';
import App from '@renderer/App.vue';
import Administracion from '@renderer/views/Administracion.vue';
import Consorcios from '@renderer/views/Consorcios.vue';
import Expensas from '@renderer/views/Expensas.vue';
import UF from '@renderer/views/UF.vue';
import Proveedor from '@renderer/views/Proveedor.vue';
import Ingreso from '@renderer/views/Ingreso.vue';
import Egreso from '@renderer/views/Egreso.vue';
import PagoUF from '@renderer/views/PagoUF.vue';
import CrearAdministracion from '@renderer/views/CrearAdministracion.vue';
import CrearConsorcio from '@renderer/views/CrearConsorcio.vue';
import CrearUF from '@renderer/views/CrearUF.vue';
import Login from '@renderer/views/Login.vue';
import EdicionEstadoCuentaUF from '@renderer/views/EdicionEstadoCuentaUF.vue';
import GastoParticular from '@renderer/views/GastoParticular.vue';

// import Registrar from '@/views/Registrar.vue';

const routes = [
    { path: '/',
      name: 'home',
      component: App,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    // {
    //   path: '/registrar',
    //   name: 'registrar',
    //   component: Registrar,
    // },
    { path: '/administracion',
      name: 'administracion',
      component: Administracion,
      meta: { requiresAuth: true },
    },
    {
      path:'/consorcios',
      name:'consorcios',
      component: Consorcios,
      meta: { requiresAuth: true },
    },
    {
      path:'/uf',
      name:'uf',
      component: UF,
      meta: { requiresAuth: true },
    },
    {
      path:'/proveedores',
      name:'proveedores',
      component: Proveedor,
      meta: { requiresAuth: true },
    },
    {
      path:'/pagouf',
      name:'pagouf',
      component: PagoUF,
      meta: { requiresAuth: true },
    },
    {
      path:'/ingreso',
      name:'ingreso',
      component: Ingreso,
      meta: { requiresAuth: true },
    },
    {
      path:'/egreso',
      name:'egreso',
      component: Egreso,
      meta: { requiresAuth: true },
    },
    {
      path:'/gastoParticular',
      name:'gastoParticular',
      component: GastoParticular,
      meta: { requiresAuth: true },
    },
    {
      path:'/expensas',
      name:'expensas',
      component: Expensas,
      meta: { requiresAuth: true },
    },
    { path: '/crear-administracion',
      name: 'CrearAdministracion',
      component: CrearAdministracion,
      meta: { requiresAuth: true },
    },
    { path: '/crear-consorcio',
      name: 'CrearConsorcio',
      component: CrearConsorcio,
      meta: { requiresAuth: true },
    },
    {
      path: '/crear-uf/:idConsorcioCreado',
      name: 'CrearUF',
      component: CrearUF,
      meta: { requiresAuth: true },
      props: route => ({ idConsorcioCreado: Number(route.params.idConsorcioCreado) })
    },
    {
      path:'/edicionEstadoCuentaUf/:idConsorcio',
      name:'edicionEstadoCuentaUf',
      component: EdicionEstadoCuentaUF,
      meta: { requiresAuth: true },
      props: route => ({ idConsorcio: Number(route.params.idConsorcio) })
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Accede al estado de autenticación

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      // Si la ruta requiere autenticación y el usuario no está autenticado
      next({ path: '/login' });
  } else {
      next(); // Permite la navegación
  }
});



export default router;