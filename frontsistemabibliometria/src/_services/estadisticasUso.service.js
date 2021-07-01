import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const estadisticasUsoService = {
    listarEstadisticasUsoPorId
};

async function listarEstadisticasUsoPorId(id_base_datos_digital) {
    return fetchWrapper.get(`${endpoints.baseUrlEstadisticasUso}/buscarEstadisticasUsoPorId/`+ id_base_datos_digital);
}




