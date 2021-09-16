import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const leyBradfordService = {
    numeroMediosPublicacionesReferencias,
    numeroMediosPublicacionesReferenciasPorAnio,
    numeroMediosPublicacionPorAreaFrascati,
    numeroMediosPublicacionPorAreaUnesco,
    numeroMediosPublicacionPorAreaUnescoPorAnio,
    numeroMediosPublicacionPorAreaFrascatiPorAnio,
    numeroMediosPublicacionesPropios,
    numeroMediosPublicacionesPropiosPorAnio,
    numeroMediosPublicacionPropiosPorAreaFrascati,
    numeroMediosPublicacionPropiosPorAreaUnesco,
    numeroMediosPublicacionPropiosPorAreaUnescoPorAnio,
    numeroMediosPublicacionPropiosPorAreaFrascatiPorAnio
};

// Medios de Publicacion de las Referencias
async function numeroMediosPublicacionesReferencias() {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacion`);
}

async function numeroMediosPublicacionesReferenciasPorAnio(anio_publicacion_desde, anio_publicacion_hasta) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta);
}


async function numeroMediosPublicacionPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaFrascati/`+id_area_frascati);
}
async function numeroMediosPublicacionPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaUnesco/`+ id_area_unesco);
}

async function numeroMediosPublicacionPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaUnescoPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+id_area_unesco);
}

async function numeroMediosPublicacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaFrascatiPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+ id_area_frascati);
}

// Medios de la Publicacion de las Publicaciones Propias de los investigadores de la Universidad de Cuenca

async function numeroMediosPublicacionesPropios() {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropios`);
}

async function numeroMediosPublicacionesPropiosPorAnio(anio_publicacion_desde, anio_publicacion_hasta) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropiosPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta);
}

async function numeroMediosPublicacionPropiosPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropiosPorAreaFrascati/`+id_area_frascati);
}
async function numeroMediosPublicacionPropiosPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropiosPorAreaUnesco/`+ id_area_unesco);
}

async function numeroMediosPublicacionPropiosPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropiosPorAreaUnescoPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+id_area_unesco);
}

async function numeroMediosPublicacionPropiosPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPropiosPorAreaFrascatiPorAnio/`+anio_publicacion_desde+"/"+anio_publicacion_hasta+"/"+ id_area_frascati);
}







