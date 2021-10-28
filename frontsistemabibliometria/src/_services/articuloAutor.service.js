import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";
export const articuloAutorService = {
    listarArticulosPorIdAutor,
    insertar,
    eliminar
};
async function listarArticulosPorIdAutor(id_autor) {
    return fetchWrapper.get(`${endpoints.baseUrlArticuloAutor}/listarPorIdAutor/`+id_autor);
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlArticuloAutor}/insertar`, params);
}

async function eliminar(id_articulo_autor) {
    return fetchWrapper.get(`${endpoints.baseUrlArticuloAutor}/eliminar/` + id_articulo_autor);
}


