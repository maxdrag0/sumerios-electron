<script setup></script>

<template>
  <nav class="navbar">
    <div class="logo-container">
      <router-link to="/" class="btn btn-primary">
        <img
          src="@renderer/assets/sumerios-min.png"
          alt="Menu"
          class="logo-button"
        />
      </router-link>
    </div>
    <ul class="bottom-menu">
      <router-link to="/administracion" class="btn btn-primary">
        <li>Administracion</li>
      </router-link>
      <router-link to="/consorcios" class="btn btn-primary">
        <li>Consorcios</li>
      </router-link>
      <router-link to="/uf" class="btn btn-primary">
        <li>UF</li>
      </router-link>
      <router-link to="/proveedores" class="btn btn-primary">
        <li>Proveedor</li>
      </router-link>
      <router-link to="/pagouf" class="btn btn-primary">
        <li>Pago expensa</li>
      </router-link>
      <router-link to="/egreso" class="btn btn-primary">
        <li>Egresos</li>
      </router-link>
      <router-link to="/gastoParticular" class="btn btn-primary">
        <li>GP</li>
      </router-link>
      <router-link to="/ingreso" class="btn btn-primary">
        <li>Ingresos</li>
      </router-link>
      <router-link to="/expensas" class="btn btn-primary">
        <li>Expensas</li>
      </router-link>
    </ul>
  </nav>
</template>

<style scoped>
  .navbar {
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--sumerio-rojo-claro);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: 60px;
  }

  .logo-container {
    position: relative;
    padding-top: 15px;
    z-index: 1100;
  }

  .logo-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    transition: transform 1.5s ease; /* Suaviza el cambio de escala */
  }

  .logo-button:hover {
    transform: scale(1.05); /* Agranda el botón un 10% */
  }

  .bottom-menu {
    font-weight: bold;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--sumerio-marron);
    list-style: none;
    padding: 5px;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  .bottom-menu li {
    font-weight: bold;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
    color: var(--sumerio-negro);
  }

  .bottom-menu li:hover {
    background-color: var(--sumerio-rojo-oscuro);
  }

  .btn {
    width: 20%;
    text-align: center;
  }
</style>

