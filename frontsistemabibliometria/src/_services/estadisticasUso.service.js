import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const estadisticasUsoService = {
    listarEstadisticasUsoPorId,
    insertar,
    eliminar
};

async function listarEstadisticasUsoPorId(id_base_datos_digital) {
    return fetchWrapper.get(`${endpoints.baseUrlEstadisticasUso}/buscarEstadisticasUsoPorId/`+ id_base_datos_digital);
}
async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlEstadisticasUso}/insertar`, params);
}
async function eliminar(id_estadisticas_uso) {
    return fetchWrapper.get(`${endpoints.baseUrlEstadisticasUso}/eliminar/` + id_estadisticas_uso);
}




