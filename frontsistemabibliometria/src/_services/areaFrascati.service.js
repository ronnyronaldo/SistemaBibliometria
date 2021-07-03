import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaFrascatiService = {
    validarAreaFrascatiPorNombre
};

async function validarAreaFrascatiPorNombre(nombre) {
    console.log(nombre)
    return fetchWrapper.get(`${endpoints.baseUrlAreaFrascati}/validarAreaFrascatiPorNombre/`+ nombre);
}




