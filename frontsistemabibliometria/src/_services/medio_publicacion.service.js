import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const medioPublicacionService = {
    listar,
    validarMedioPublicacionPorNombre
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/listar`);
}
async function validarMedioPublicacionPorNombre(nombre) {
    console.log(nombre)
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/verificaMedioPublicacionPorNombre/`+ nombre);
}






