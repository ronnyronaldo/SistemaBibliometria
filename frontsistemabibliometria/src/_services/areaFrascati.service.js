import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaFrascatiService = {
    validarAreaFrascatiPorNombre,
    listaAreasFrascati,
    insertar,
    eliminar,
    actualizar
};

async function validarAreaFrascatiPorNombre(nombre) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaFrascati}/validarAreaFrascatiPorNombre/`+ nombre);
}

async function listaAreasFrascati() {
    return fetchWrapper.get(`${endpoints.baseUrlAreaFrascati}/listaAreaFrascati`); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaFrascati}/insertar`, params);
}

async function eliminar(id_area_frascati) {
    console.log(id_area_frascati)
    return fetchWrapper.get(`${endpoints.baseUrlAreaFrascati}/eliminar/` + id_area_frascati);
}

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaFrascati}/actualizar`, params);
}




