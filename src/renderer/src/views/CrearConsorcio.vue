<template>
    <div class="container-view">
        <h1>Crear Consorcio</h1>
        <div v-if="!estadoCuentaConsorcio" class="container">
            <form @submit.prevent="crearConsorcio"  class="formulario">
                <!-- Campos para el consorcio -->
                <h2>Datos del consorcio</h2>
                <div>
                <label for="nombre">Nombre:</label>
                <input type="text" v-model="consorcio.nombre" required />
                </div>
                <div>
                <label for="nombre">Direccion:</label>
                <input type="text" v-model="consorcio.direccion" required />
                </div>
                <div>
                <label for="nombre">Ciudad:</label>
                <input type="text" v-model="consorcio.ciudad" required />
                </div>
                <div>
                <label for="nombre">CUIT:</label>
                <input type="text" v-model="consorcio.cuit" />
                </div>
                <h3>Datos bancarios del consorcio</h3>
                <div>
                <label for="nombre">Titulo de cuenta:</label>
                <input type="text" v-model="consorcio.titulo" />
                </div>
                <div>
                <label for="nombre">Banco:</label>
                <input type="text" v-model="consorcio.banco" />
                </div>
                <div>
                <label for="nombre">Numero de cuenta:</label>
                <input type="text" v-model="consorcio.numCuenta" />
                </div>
                <div>
                <label for="nombre">CBU:</label>
                <input type="text" v-model="consorcio.cbu" />
                </div>
                <div>
                <label for="nombre">Alias:</label>
                <input type="text" v-model="consorcio.alias" />
                </div>


                <button type="submit">Guardar Consorcio</button>
            </form>
            <div class="datos-reactivos">
                <h2>Datos Consorcio</h2>
                <h3>Nombre: - {{ consorcio.nombre }}</h3>
                <h3>Direccion: - {{ consorcio.direccion }}</h3>
                <h3>Ciudad: - {{ consorcio.ciudad }}</h3>
                <h2>Datos Bancarios</h2>
                <h3>Titulo: - {{ consorcio.titulo }}</h3>
                <h3>Banco: - {{ consorcio.banco }}</h3>
                <h3>Numero de cuenta: - {{ consorcio.numCuenta }}</h3>
                <h3>CBU: - {{ consorcio.cbu }}</h3>
                <h3>Alias: - {{ consorcio.alias }}</h3>
            </div>
        </div>

        <div v-if="estadoCuentaConsorcio" class="estado-cuenta">
          <h2>Modifique el Estado de cuenta del Consorcio</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Total</th>
                <th>Efectivo</th>
                <th>Banco</th>
                <th>Fondo Adm</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  contenteditable="true"
                  @input="actualizarEstado('total', $event)"
                  class="editable-cell"
                >
                  {{ estadoCuentaConsorcio.total }}
                </td>
                <td
                  contenteditable="true"
                  @input="actualizarEstado('efectivo', $event)"
                  class="editable-cell"
                >
                  {{ estadoCuentaConsorcio.efectivo }}
                </td>
                <td
                  contenteditable="true"
                  @input="actualizarEstado('banco', $event)"
                  class="editable-cell"
                >
                  {{ estadoCuentaConsorcio.banco }}
                </td>
                <td
                  contenteditable="true"
                  @input="actualizarEstado('fondoAdm', $event)"
                  class="editable-cell"
                >
                  {{ estadoCuentaConsorcio.fondoAdm }}
                </td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="guardarEstadoCuenta"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
</template>

<script setup>
  import { API_CONSORCIOS } from '@renderer/config/config';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { useAdminStore } from '@renderer/stores/adminStore';
  import { useIntermediaStore } from '@renderer/stores/intermediaStore';

  const adminStore = useAdminStore();
  const idAdm = adminStore.administracionData.idAdm;
  const intermediaStore = useIntermediaStore();

  const consorcio = ref({
    nombre: '',
    direccion: '',
    ciudad: '',
    idAdm,
    cuit: '',
    titulo: '',
    banco: '',
    numCuenta:'',
    cbu: '',
    alias: ''
  });
  const idConsorcioCreado = ref(null);
  const estadoCuentaConsorcio = ref(null);

  const router = useRouter();
  const apiConsorcios = API_CONSORCIOS(adminStore.administracionData.idAdm);

  const crearConsorcio = async () => {
    try {
      const response = await axios.post(apiConsorcios, consorcio.value);
      const { id } = response.data;

      console.log('ID del consorcio creado:', id); // Verifica el ID recibido

      idConsorcioCreado.value = id; // Asigna directamente
      await cargarEstadoCuentaConsorcio(id); // Asegúrate de esperar esta función
    } catch (error) {
      console.error('Error al crear consorcio:', error.response ? error.response.data : error.message);
    }
  };

  const cargarEstadoCuentaConsorcio = async (idConsorcio) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/estado_cuenta_consorcio/consorcio/${idConsorcio}`);
      estadoCuentaConsorcio.value = response.data; // Asigna datos correctamente
      console.log('Estado de cuenta cargado:', JSON.stringify(estadoCuentaConsorcio.value));
    } catch (error) {
      console.error('Error al obtener el estado de cuenta:', error);
    }
  };

  const actualizarEstado = (campo, event) => {
    estadoCuentaConsorcio.value[campo] = event.target.textContent.trim();
    console.log(`Actualizado ${campo}:`, estadoCuentaConsorcio.value[campo]);
  };

  const guardarEstadoCuenta = async () =>{
    console.log('Estado de cuenta a enviar:', JSON.stringify(estadoCuentaConsorcio.value));
    console.log(`http://localhost:8080/api/estado_cuenta_consorcio/${estadoCuentaConsorcio.value.idEstadoCuentaConsorcio}`);
    console.log(`http://localhost:8080/api/estado_cuenta_consorcio/${estadoCuentaConsorcio.idEstadoCuentaConsorcio}`);

    try {
      await axios.put(`http://localhost:8080/api/estado_cuenta_consorcio/${estadoCuentaConsorcio.value.idEstadoCuentaConsorcio}`, estadoCuentaConsorcio.value);
      alert("Estado de cuenta actualizado con éxito");
      intermediaStore.loadIntermedias();
      router.push({ name: 'CrearUF', params: { idConsorcioCreado: idConsorcioCreado.value } });
    } catch (error) {
      console.error('Error al editar el estado de cuenta:', error);
    }
  }

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espacio entre el formulario y los datos */
}

.formulario {
  flex: 1;
}

.datos-reactivos {
  flex: 1;
}

form div {
  margin-bottom: 7px;
}

button {
  margin-top: 10px;
}
</style>