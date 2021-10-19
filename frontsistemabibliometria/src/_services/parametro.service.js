import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const parametroService = {
    actualizar,
    listaParametro,
    insertar,
    eliminar
};

async function listaParametro() {
    return fetchWrapper.get(`${endpoints.baseUrlParametro}/listar`); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlParametro}/insertar`, params);
}

async function eliminar(id_parametro) {
    return fetchWrapper.get(`${endpoints.baseUrlParametro}/eliminar/` + id_parametro);
}

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlParametro}/actualizar`, params);
}




