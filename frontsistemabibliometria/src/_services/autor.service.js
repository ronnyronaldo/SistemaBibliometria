import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";
export const autorService = {
    listar,
    eliminar,
    insertar
};
async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlAutor}/listar`);
}
async function eliminar(id_autor) {
    return fetchWrapper.get(`${endpoints.baseUrlAutor}/eliminar/` + id_autor);
}
async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAutor}/insertar`, params);
}

