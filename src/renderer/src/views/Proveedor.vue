<template>
    <div class="container-view">
        <div class="container">
            <div class="tabla-proveedores">
                <table class="table table-striped">
                <thead>
                    <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>CUIT</th>
                    <th>Telefono</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="proveedor in proveedores"
                    :key="proveedor.idProveedor"
                    @click="seleccionarProveedor(proveedor)"
                    >
                    <td>{{ proveedor.nombre }}</td>
                    <td>{{ proveedor.descripcion }}</td>
                    <td>{{ proveedor.cuit }}</td>
                    <td>{{ proveedor.telefono }}</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div class="formulario-proveedor">
                <h3>Crear Proveedor</h3>
                <form @submit.prevent="crearOEditarProveedor">
                    <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input
                            id="nombre"
                            type="text"
                            v-model="proveedor.nombre"
                            class="form-control"
                            required
                            />
                    </div>
                    <div class="form-group">
                            <label for="cuit">CUIT</label>
                            <input
                            id="cuit"
                            type="text"
                            v-model="proveedor.cuit"
                            class="form-control"
                            required
                            />
                    </div>
                    <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <input
                            id="descripcion"
                            type="text"
                            v-model="proveedor.descripcion"
                            class="form-control"
                            />
                    </div>
                    <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <input
                            id="telefono"
                            type="text"
                            v-model="proveedor.telefono"
                            class="form-control"
                            />
                    </div>
                    <div class="form-group">
                            <label for="cbu">CBU</label>
                            <input
                            id="cbu"
                            type="text"
                            v-model="proveedor.cbu"
                            class="form-control"
                            />
                    </div>
                <button type="submit" class="btn btn-primary">
                    {{ proveedor.idProveedor ? 'Actualizar' : 'Crear' }}
                </button>
                <button v-if="proveedor.idProveedor !== null" @click="cancelarEdicion()" class="btn btn-primary">
                    Cancelar edicion
                </button>
                <button v-if="proveedor.idProveedor !== null" @click="eliminarProveedor(proveedor.idProveedor)" class="btn btn-primary">
                    Eliminar
                </button>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAdminStore } from '@renderer/stores/adminStore';

  const adminStore = useAdminStore();
  const proveedores = ref([]);
  const proveedor = ref({
    idProveedor: null,
    idAdm: adminStore.administracionData.idAdm,
    nombre: '',
    telefono: '',
    descripcion: '',
    cuit: '',
    cbu:'',
  });


  const seleccionarProveedor = (proveedorSeleccionado) => {
    proveedor.value = {
        idProveedor: proveedorSeleccionado.idProveedor,
        idAdm: adminStore.administracionData.idAdm,
        nombre: proveedorSeleccionado.nombre,
        descripcion: proveedorSeleccionado.descripcion,
        telefono: proveedorSeleccionado.telefono,
        cuit: proveedorSeleccionado.cuit,
        cbu: proveedorSeleccionado.cbu,
        };
    };

    const cancelarEdicion = () => {
    proveedor.value = {
            idProveedor: null,
            idAdm: adminStore.administracionData.idAdm,
            nombre: '',
            descripcion: '',
            telefono: '',
            cuit: '',
            cbu:'',
        };
    };

  const crearOEditarProveedor = async () => {
    console.log(JSON.stringify(proveedor.value));
    try {
        if (proveedor.value.idProveedor !== null) {
        // Si idIngreso no es null, actualiza el ingreso
        await axios.put(`http://localhost:8080/api/administraciones/${adminStore.administracionData.idAdm}/proveedores/${proveedor.value.idProveedor}`, proveedor.value);
        alert("Proveedor actualizado con éxito");
        } else {
        // Si idIngreso es null, crea un nuevo ingreso
        await axios.post(`http://localhost:8080/api/administraciones/${adminStore.administracionData.idAdm}/proveedores`, proveedor.value);
        alert("Proveedor creado con éxito");
        }

        await cargarProveedoresAdm();

        proveedor.value = {
            idProveedor: null,
            idAdm: adminStore.administracionData.idAdm,
            nombre: '',
            descripcion: '',
            telefono: '',
            cuit: '',
            cbu:'',
        };
    } catch (error) {
        console.error("Error al crear o editar el proveedor:", error);
    }
    };

  const eliminarProveedor = async (idProveedor) => {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar el proveedor?');

    if(confirmar){
        try{
        await axios.delete(`http://localhost:8080/api/administraciones/${adminStore.administracionData.idAdm}/proveedores/${proveedor.value.idProveedor}`);
        alert('Proveedor eliminado con éxito.');

        await cargarProveedoresAdm();

        } catch (error) {
        console.error("Error al proveedor  el ingreso:", error);
        }
    } else{
        alert("Eliminacion cancelada")
    }
    }

  const cargarProveedoresAdm = async () => {
    try {
        const response = await axios.get(
        `http://localhost:8080/api/administraciones/${adminStore.administracionData.idAdm}/proveedores`
        );
        proveedores.value = response.data;
        console.log(JSON.stringify(proveedores.value))
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }
    };

    onMounted(() => {
        cargarProveedoresAdm();
    });

</script>

<style scoped>
    .container-view {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 10px;
    }

    .container {
        display: flex;
        gap: 20px;
        width: 100%;
    }

    .tabla-proveedores {
        flex: 2; /* La tabla ocupa más espacio proporcionalmente que el formulario */
        background: #f3d08e;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 15px;
        overflow: auto; /* Permite scroll si el contenido es mayor que el contenedor */
    }

    .tabla-proveedores .table {
        margin: 0;
        width: 100%; /* La tabla ocupa todo el ancho disponible dentro del contenedor */
        table-layout: auto; /* Permite que las columnas se ajusten al contenido */
    }

    .tabla-proveedores th,
    .tabla-proveedores td {
        text-align: left;
        vertical-align: middle;
        padding: 10px; /* Espaciado interno para mejor visualización */
    }

    .tabla-proveedores th {
        background-color: var(--sumerio-marron);
        font-weight: bold;
        color: black;
    }

    .tabla-proveedores tr:hover {
        background-color: #f2f2f2;
        cursor: pointer;
    }

    .formulario-proveedor {
        flex: 1; /* El formulario ocupa menos espacio proporcionalmente */
        background: #f3d08e;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    .formulario-proveedor h3 {
        text-align: center;
        font-weight: bold;
        color: black;
        margin-bottom: 20px;
    }

    .formulario-proveedor .form-group {
        margin-bottom: 10px;
    }

    .formulario-proveedor label {
        font-weight: bold;
    }

    .formulario-proveedor input {
        border: 1px solid #ced4da;
        border-radius: 4px;
        padding: 1px;
        width: 100%;
        box-sizing: border-box;
    }

    .formulario-proveedor .btn {
        font-weight: bold;
        background-color: var(--sumerio-marron);
        display: block;
        width: 100%;
        margin-top: 10px;
        padding: 10px;
        border: none;
        color: black;
        font-size: 12px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }

    .formulario-proveedor .btn:hover {
        background-color: #0056b3;
    }

    .formulario-proveedor .btn-primary:nth-child(2) {
        background-color: #6c757d;
    }

    .formulario-proveedor .btn-primary:nth-child(2):hover {
        background-color: #5a6268;
    }
</style>


