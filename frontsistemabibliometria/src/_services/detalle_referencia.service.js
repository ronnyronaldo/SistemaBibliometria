import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const detalleReferenciaService = {
    numeroDetalleReferencia
};

async function numeroDetalleReferencia() {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/numeroDetalleReferenciaIngresadas`);
}