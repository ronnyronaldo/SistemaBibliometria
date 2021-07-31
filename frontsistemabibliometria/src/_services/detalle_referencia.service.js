import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const detalleReferenciaService = {
    numeroDetalleReferencia,
    detalleReferenciaPorIdArticulo,
    detalleReferenciaPorAreaUnesco,
    detalleReferenciaPorAreaFrascati,
    detalleReferenciaPorAreaUnescoPorAnio,
    detalleReferenciaPorAreaFrascatiPorAnio,
    actualizarDetalleReferencia
};

async function numeroDetalleReferencia() {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/numeroDetalleReferenciaIngresadas`);
}
async function detalleReferenciaPorIdArticulo(id_articulo) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorIdArticulo/`+ id_articulo);
}

async function detalleReferenciaPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorAreaUnesco/`+ id_area_unesco);
}

async function detalleReferenciaPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorAreaFrascati/`+ id_area_frascati);
}

async function detalleReferenciaPorAreaUnescoPorAnio(anio_publicacion, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorAreaUnescoYAnio/`+ anio_publicacion+"/"+id_area_unesco);
}

async function detalleReferenciaPorAreaFrascatiPorAnio(anio_publicacion, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlDetalleReferencia}/listaDetalleReferenciaPorAreaFrascatiYAnio/`+ anio_publicacion+ "/" +id_area_frascati);
}

async function actualizarDetalleReferencia(params) {
    return fetchWrapper.post(`${endpoints.baseUrlDetalleReferencia}/actualizarDetalleReferencia`, params);
}