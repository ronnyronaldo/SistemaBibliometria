import { fetchWrapper } from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const estadisticasJournalService = {
    insertar,
    listarEstadisticasJournalPorId,
    eliminar
};

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlEstadisticasJournal}/insertar`, params);
}

async function listarEstadisticasJournalPorId(id_base_datos_digital, id_journal) {
    return fetchWrapper.get(`${endpoints.baseUrlEstadisticasJournal}//buscarEstadisticasJournalaPorId/`+ id_base_datos_digital+'/'+id_journal);
}

async function eliminar(id_estadisticas_journal) {
    return fetchWrapper.get(`${endpoints.baseUrlEstadisticasJournal}/eliminar/` + id_estadisticas_journal);
}




