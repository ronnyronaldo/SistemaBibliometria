import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const detalleReferenciaService = {
    numeroDetalleReferencia,
    detalleReferenciaPorIdArticulo
};

async function numeroDetalleReferencia() {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/numeroDetalleReferenciaIngresadas`);
}
async function detalleReferenciaPorIdArticulo(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorIdArticulo/`+ id_articulo);
}