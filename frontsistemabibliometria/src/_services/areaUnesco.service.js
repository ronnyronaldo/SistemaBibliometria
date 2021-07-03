import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaUnescoService = {
    validarAreaUnescoPorNombre
};

async function validarAreaUnescoPorNombre(nombre) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaUnesco}/validarAreaUnescoPorNombre/`+ nombre);
}




