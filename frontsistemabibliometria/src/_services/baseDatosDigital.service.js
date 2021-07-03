import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const baseDatosDigitalService = {
    listar,
    listarBaseDatosDigitalPorId,
    validarBaseDatosDigitalPorNombre
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlBaseDatosDigital}/listar`);
}

async function listarBaseDatosDigitalPorId(id_base_datos_digital) {
    return fetchWrapper.get(`${endpoints.baseUrlBaseDatosDigital}/buscarBaseDatosDigitalPorId/`+ id_base_datos_digital);
}

async function validarBaseDatosDigitalPorNombre(nombre_base_datos_digital) {
    return fetchWrapper.get(`${endpoints.baseUrlBaseDatosDigital}/validarBaseDatosDigitalPorNombre/`+ nombre_base_datos_digital);
}




