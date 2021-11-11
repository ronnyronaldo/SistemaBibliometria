import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaSJRService = {
    listaAreasSJR,
    insertar,
    eliminar,
    actualizar
};

async function listaAreasSJR() {
    return fetchWrapper.get(`${endpoints.baseUrlAreaSJR}/listaAreaSJR`); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaSJR}/insertar`, params);
}

async function eliminar(id_area_sjr) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaSJR}/eliminar/` + id_area_sjr);
}

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaSJR}/actualizar`, params);
}




