import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const medioPublicacionService = {
    listar,
    listarMediosPublicacionPublicacion,
    listarMediosPublicacionResumen,
    listarMediosPublicacionCitacion,
    listarMediosPublicacionBusqueda,
    actualizarMediosPublicacionPublicacion,
    actualizarMediosPublicacionCitacion,
    validarMedioPublicacionPorNombre,
    insertar,
    eliminar,
    actualizarMediosPublicacionPublicacionPorAnio,
    actualizarMediosPublicacionPublicacionPorAreaFrascati,
    actualizarMediosPublicacionPublicacionPorAreaUnesco,
    actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio,
    actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio,
    actualizarMediosPublicacionCitacionPorAnio,
    actualizarMediosPublicacionCitacionPorAreaFrascati,
    actualizarMediosPublicacionCitacionPorAreaUnesco,
    actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio,
    actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio,
    actualizarMediosPublicacionBusquedaPorAnio,
    actualizarMediosPublicacionBusqueda,
    actualizar
};

async function actualizar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlMedioPublicacion}/actualizar`, params);
}

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/listar`);
}

async function validarMedioPublicacionPorNombre(nombre) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/verificaMedioPublicacionPorNombre/`+ nombre);
}
async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlMedioPublicacion}/insertar`, params);
}
async function eliminar(id_medio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/eliminar/` + id_medio_publicacion);
}

// Medios de Publicacion Publicacion
async function listarMediosPublicacionPublicacion() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/listar`);
}
async function actualizarMediosPublicacionPublicacion() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacion`);
}
async function actualizarMediosPublicacionPublicacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacionPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta);
}

async function actualizarMediosPublicacionPublicacionPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacionPorAreaFrascati/`+id_area_frascati);
}
async function actualizarMediosPublicacionPublicacionPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacionPorAreaUnesco/`+ id_area_unesco);
}

async function actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacionPorAreaUnescoPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+id_area_unesco);
}

async function actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionPublicacion}/conteoMediosPublicacionPublicacionPorAreaFrascatiPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+ id_area_frascati);
}
// Medios de Publicacion Citacion
async function listarMediosPublicacionCitacion() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/listar`);
}
async function actualizarMediosPublicacionCitacion() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacion`);
}

async function actualizarMediosPublicacionCitacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacionPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta);
}

async function actualizarMediosPublicacionCitacionPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacionPorAreaFrascati/`+id_area_frascati);
}
async function actualizarMediosPublicacionCitacionPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacionPorAreaUnesco/`+ id_area_unesco);
}

async function actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacionPorAreaUnescoPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+id_area_unesco);
}

async function actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionCitacion}/conteoMediosPublicacionCitacionPorAreaFrascatiPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+ id_area_frascati);
}

// Medios de Publicacion Busqueda
async function listarMediosPublicacionBusqueda() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionBusqueda}/listar`);
}

async function actualizarMediosPublicacionBusqueda() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionBusqueda}/conteoMediosPublicacionBusqueda`);
}

async function actualizarMediosPublicacionBusquedaPorAnio(anio_publicacion_desde, anio_publicacion_hasta) {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacionBusqueda}/conteoMediosPublicacionBusquedaPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta);
}
// Lista Medios de Publicacion Resumen
async function listarMediosPublicacionResumen() {
    return fetchWrapper.get(`${endpoints.baseUrlResumenMedioPublicacion}/listar`);
}





