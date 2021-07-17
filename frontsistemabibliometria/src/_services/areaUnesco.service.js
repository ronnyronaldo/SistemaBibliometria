import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaUnescoService = {
    validarAreaUnescoPorNombre,
    listaAreasUnesco,
    insertar,
    eliminar
};

async function validarAreaUnescoPorNombre(nombre) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaUnesco}/validarAreaUnescoPorNombre/`+ nombre);
}

async function listaAreasUnesco() {
    return fetchWrapper.get(`${endpoints.baseUrlAreaUnesco}/listaAreaUnesco`); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaUnesco}/insertar`, params);
}

async function eliminar(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaUnesco}/eliminar/` + id_area_unesco);
}





