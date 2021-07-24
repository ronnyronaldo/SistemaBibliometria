import { fetchWrapper } from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const referenciaService = {
    listarReferenciasPorIdArticulo,
    listarReferenciasNoEcontradasPorIdArticulo,
    insertarManual,
    insertarAutomatico,
    buscarDetalleReferenciaIndividual,
    eliminar,
    numeroReferencias
};

async function numeroReferencias() {
    return fetchWrapper.get(`${endpoints.baseUrlReferencia}/numeroReferenciaIngresadas`);
}

async function listarReferenciasPorIdArticulo(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlReferencia}/listarReferenciasPorIdArticulo/` + id_articulo);
}

async function listarReferenciasNoEcontradasPorIdArticulo(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlReferencia}/listarReferenciasNoEncontradasPorIdArticulo/` + id_articulo);
}

async function insertarManual(params) {
    return fetchWrapper.post(`${endpoints.baseUrlReferencia}/insertarManual`, params);
}

async function insertarAutomatico(params) {
    return fetchWrapper.post(`${endpoints.baseUrlReferencia}/insertarAutomatico`, params);
}

async function buscarDetalleReferenciaIndividual(params) {
    return fetchWrapper.post(`${endpoints.baseUrlReferencia}/obtenerDetalleReferenciaIndividual`, params);
}

async function eliminar(id_referencia) {
    return fetchWrapper.get(`${endpoints.baseUrlReferencia}/eliminar/` + id_referencia);
}




