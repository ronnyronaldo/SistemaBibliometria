import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const publicacionService = {
    listar,
    insertar,
    eliminar
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







