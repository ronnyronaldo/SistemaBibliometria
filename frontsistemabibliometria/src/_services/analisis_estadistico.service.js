import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const analisisEstadisticoService = {
    numeroPublicacionesPorAreaUnesco,
    numeroPublicacionesAreaFrascati,
    numeroPublicacionesAreaFrascatiPorAnio,
    numeroPublicacionesAreaUnescoPorAnio,
    numeroPublicacionesMediosPublicacion,
    numeroPublicacionesMediosPublicacionPorAreaFrascati,
    numeroPublicacionesMediosPublicacionPorAreaUnesco,
    numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio,
    numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio,
    numeroPublicacionesPorCuartil,
    numeroPublicacionesPorCuartilPorAreaUnesco,
    numeroPublicacionesPorCuartilPorAreaFrascati,
    numeroPublicacionesPorCuartilPorAreaUnescoPorAnio,
    numeroPublicacionesPorCuartilPorAreaFrascatiPorAnio,
    numeroPublicacionesPorFactorImpacto,
    numeroPublicacionesPorFactorImpactoPorAreaUnesco,
    numeroPublicacionesPorFactorImpactoPorAreaFrascati,
    numeroPublicacionesPorFactorImpactoPorAreaUnescoPorAnio,
    numeroPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio
};
/////////
async function numeroPublicacionesPorAreaUnesco() {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorAreaUnesco`);
}

async function numeroPublicacionesAreaFrascati() {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesAreaFrascati`);
}

async function numeroPublicacionesAreaUnescoPorAnio(anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesAreaUnescoPorAnio/` + anio_publicacion);
}

async function numeroPublicacionesAreaFrascatiPorAnio(anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesAreaFrascatiPorAnio/` + anio_publicacion);
}

///////
async function numeroPublicacionesMediosPublicacion() {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesMediosPublicacion`);
}

async function numeroPublicacionesMediosPublicacionPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesMediosPublicacionPorAreaFrascati/` + id_area_frascati);
}

async function numeroPublicacionesMediosPublicacionPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesMediosPublicacionPorAreaUnesco/` + id_area_unesco);
}

async function numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio/`+id_area_frascati+"/"+anio_publicacion);
}

async function numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio/`+id_area_unesco+"/"+anio_publicacion);
}

//////////
async function numeroPublicacionesPorCuartil() {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorCuartil`);
}

async function numeroPublicacionesPorCuartilPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorCuartilPorAreaUnesco/` + id_area_unesco);
}

async function numeroPublicacionesPorCuartilPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorCuartilPorAreaFrascati/` + id_area_frascati);
}

async function numeroPublicacionesPorCuartilPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorCuartilPorAreaUnescoPorAnio/`+id_area_unesco+"/"+anio_publicacion);
}

async function numeroPublicacionesPorCuartilPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorCuartilPorAreaFrascatiPorAnio/`+id_area_frascati+"/"+anio_publicacion);
}
//////

//////////
async function numeroPublicacionesPorFactorImpacto() {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorFactorImpacto`);
}

async function numeroPublicacionesPorFactorImpactoPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorFactorImpactoPorAreaUnesco/` + id_area_unesco);
}

async function numeroPublicacionesPorFactorImpactoPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorFactorImpactoPorAreaFrascati/` + id_area_frascati);
}

async function numeroPublicacionesPorFactorImpactoPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorFactorImpactoPorAreaUnescoPorAnio/`+id_area_unesco+"/"+anio_publicacion);
}

async function numeroPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion) {
    return fetchWrapper.get(`${endpoints.baseUrlAnalisisEstadistico}/numeroPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio/`+id_area_frascati+"/"+anio_publicacion);
}

//////







