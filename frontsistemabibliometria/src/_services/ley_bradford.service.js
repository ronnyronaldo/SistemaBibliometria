import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const leyBradfordService = {
    numeroMediosPublicacionPorAreaFrascati,
    numeroMediosPublicacionPorAreaUnesco,
    numeroMediosPublicacionPorAreaUnescoPorAnio,
    numeroMediosPublicacionPorAreaFrascatiPorAnio
};

async function numeroMediosPublicacionPorAreaFrascati(id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaFrascati/`+id_area_frascati);
}
async function numeroMediosPublicacionPorAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaUnesco/`+ id_area_unesco);
}

async function numeroMediosPublicacionPorAreaUnescoPorAnio(anio_publicacion, id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaUnescoPorAnio/`+anio_publicacion+"/"+id_area_unesco);
}

async function numeroMediosPublicacionPorAreaFrascatiPorAnio(anio_publicacion, id_area_frascati) {
    return fetchWrapper.get(`${endpoints.baseUrlLeyBradford}/numeroMediosPublicacionPorAreaFrascatiPorAnio/`+anio_publicacion+"/"+ id_area_frascati);
}







