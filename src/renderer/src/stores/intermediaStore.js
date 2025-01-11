import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useIntermediaStore = defineStore('intermedia', () => {
    const intermedias = ref([]);
    const selectedIntermedia = ref(null);

    const loadIntermedias = async () => {
        try{
            const response = await axios.get("http://localhost:8080/api/intermedia_expensa_consorcio");
            intermedias.value = response.data;
            console.log(JSON.stringify(intermedias.value))
        } catch (error) {
            console.error('Error al cargar los datos intermedios:', error);
        }
    }

    const setIntermediaForConsorcio = (idConsorcio) => {
        if(idConsorcio === null){
            selectedIntermedia.value = null;
            return;
        }

        if (!Array.isArray(intermedias.value)) {
            console.error('intermedias.value no es un arreglo:', intermedias.value);
            return;
        }

        selectedIntermedia.value = intermedias.value.find(
          (intermedia) => intermedia.idConsorcio === idConsorcio
        ) || null;

    };


    return {
        intermedias,
        selectedIntermedia,
        loadIntermedias,
        setIntermediaForConsorcio
    };
});