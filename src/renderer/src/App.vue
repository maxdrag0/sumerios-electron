<script setup>
import MenuNavegacion from './components/MenuNavegacion.vue';
</script>

<template>
  <MenuNavegacion />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
:root {
/* COLORES SUMERIOS */
  --sumerio-rojo-claro: #BF3641;
  --sumerio-rojo-oscuro: #8C3030;
  --sumerio-marron: #BF9341;
  --sumerio-crema: #F2E399;
  --sumerio-negro: #181818;

  --color-text-1: #ffffff;
  --color-text-2: rgba(235, 235, 235, 0.64);

  --vt-c-white-soft: #f8f8f8;
  --vt-c-white-mute: #f2f2f2;

  --vt-c-black: #181818;
  --vt-c-black-soft: #222222;
  --vt-c-black-mute: #282828;

  --vt-c-divider-dark-1: rgba(84, 84, 84, 0.65);
  --vt-c-divider-dark-2: rgba(84, 84, 84, 0.48);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  min-height: 100vh;
  color: var(--sumerio-negro);
  background-image: url('@/assets/edificios.jpg');
  background-size: cover;
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body h1{
  text-align: center;
}

a{
  text-decoration: none;
  color: var(--sumerio-negro);
  transition: 0.4s;
  padding: 3px;
}

@media (hover: hover) {
  a:hover {
    outline: 3px black;
    color:white;
  }
}

.container-view {
  width: 100%;
  height: 100%;
  background-color: var(--sumerio-crema);
  border: 100px black;
  border-radius: 10px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}

main {
  width: 100%;
  height: calc(100vh - 80px);
  margin-top: 80px;
  padding-top: 25px;
  padding-right: 10px;
  padding-bottom: 5px;
  padding-left: 10px;
  box-sizing: border-box;
}
</style>
