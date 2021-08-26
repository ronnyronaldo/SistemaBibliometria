import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const publicacionService = {
    listar,
    listarPublicacionesSinReferencias,
    listarPublicacionesSinCompletarReferencias,
    insertar,
    eliminar,
    numeroArticulosIngresados,
    numeroArticulosNoTienenReferencias,
    obtenerDetalleClusteringCuartilFI,    
    actualizar
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/listar`);
}

async function listarPublicacionesSinReferencias() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/listarArticulosSinReferencias`);
}

async function listarPublicacionesSinCompletarReferencias() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/listarArticulosSinCompletarReferencias`);
}

async function numeroArticulosIngresados() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/numeroArticulosIngresados`);
}

async function numeroArticulosNoTienenReferencias() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/numeroArticulosNoTienenReferencias`);
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/insertar`, params);
}

async function eliminar(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/eliminar/` + id_articulo);
}

async function obtenerDetalleClusteringCuartilFI(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/obtenerDetalleClusterCuartilFI`, params);
}

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/actualizar`, params);
}






