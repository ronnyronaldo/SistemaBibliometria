import { fetchWrapper } from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const JournalService = {
    listarJournalPorBaseDatosDigital,
    insertarScienceDirect,
    insertarEbsco,
    insertarScopus,
    insertarEstadisticasScienceDirect

};

async function listarJournalPorBaseDatosDigital(id_base_datos_digital) {
    return fetchWrapper.get(`${endpoints.baseUrlJournal}/listarPorBaseDatosDigital/` + id_base_datos_digital);
}

async function insertarScienceDirect(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarScienceDirect`, params);
}

async function insertarEbsco(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarEbsco`, params);
}

async function insertarScopus(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarScopus`, params);
}

async function insertarEstadisticasScienceDirect(params) {
    return fetchWrapper.post(`${endpoints.baseUrlEstadisticasJournal}/insertarEstadisticasScienceDirect`, params);
}