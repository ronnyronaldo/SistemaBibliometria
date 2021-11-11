import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const areaCategoriaSJRService = {
    listaAreaCategoriaSJR,
    insertar,
    eliminar
};

async function listaAreaCategoriaSJR(id_categoria_sjr) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaCategoriaSJR}/listaAreaCategoriaSJR/`+id_categoria_sjr); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlAreaCategoriaSJR}/insertar`, params);
}

async function eliminar(id_area_categoria_sjr) {
    return fetchWrapper.get(`${endpoints.baseUrlAreaCategoriaSJR}/eliminar/` + id_area_categoria_sjr);
}





