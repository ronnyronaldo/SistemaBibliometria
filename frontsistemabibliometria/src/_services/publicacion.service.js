import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const publicacionService = {
    listar,
    insertar,
    eliminar,
    obtenerDetalleClusterAreasPub,
    obtenerDetalleClusterMediosPublicacion
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlPublicacion}/listar`);
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







