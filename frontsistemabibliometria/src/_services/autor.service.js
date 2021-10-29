import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";
export const autorService = {
    listar,
    actualizar
    
};
async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlAutor}/listar`);
}
async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAutor}/actualizar`, params);
}