import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const referenciaService = {
    listarReferenciasPorIdArticulo
};

async function listarReferenciasPorIdArticulo(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlReferencia}/listarReferenciasPorIdArticulo/`+ id_articulo);
}




