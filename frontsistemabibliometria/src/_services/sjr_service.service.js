import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const SJRService = {
    listar,
    insertar

};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlSJR}/listar`);
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlSJR}/insertar`, params);
}