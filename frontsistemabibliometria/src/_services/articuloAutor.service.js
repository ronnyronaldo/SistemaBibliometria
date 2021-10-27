import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";
export const articuloAutorService = {
    listarArticulosPorIdAutor
};
async function listarArticulosPorIdAutor(id_autor) {
    return fetchWrapper.get(`${endpoints.baseUrlArticuloAutor}/listarPorIdAutor/`+id_autor);
}

