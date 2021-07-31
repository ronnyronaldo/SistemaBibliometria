import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const publicacionService = {
    listar,
    insertar,
    eliminar,
    obtenerDetalleClusterAreasPub,
    obtenerDetalleClusterMediosPublicacion,
    obtenerDetalleClusterMediosPublicacionReferencias,
    numeroArticulosIngresados,
    numeroArticulosNoTienenReferencias,
    obtenerDetalleClusteringCuartilAreaUnesco,
    actualizar
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/listar`);
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

async function obtenerDetalleClusterAreasPub(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/obtenerDetalleClusterAreasPub`, params);
}

async function obtenerDetalleClusterMediosPublicacion(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/obtenerDetalleMediosPublicacion`, params);
}

async function obtenerDetalleClusterMediosPublicacionReferencias(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/obtenerDetalleMediosPublicacionReferencias`, params);
}

async function obtenerDetalleClusteringCuartilAreaUnesco(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/obtenerDetalleClusterCuartilAreUne`, params);
}

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlPublicacion}/actualizar`, params);
}






