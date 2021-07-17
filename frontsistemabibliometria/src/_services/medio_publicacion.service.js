import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const medioPublicacionService = {
    listar,
    validarMedioPublicacionPorNombre,
    insertar,
    eliminar,
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/listar`);
}
async function validarMedioPublicacionPorNombre(nombre) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/verificaMedioPublicacionPorNombre/`+ nombre);
}
async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlMedioPublicacion}/insertar`, params);
}

async function eliminar(id_medio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/eliminar/` + id_medio_publicacion);
}






