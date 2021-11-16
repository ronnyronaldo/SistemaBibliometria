import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const equivalenciaAreaUnescoService = {
    listaEquivalenciaAreaUnesco,
    insertar,
    eliminar
};

async function listaEquivalenciaAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlEquivalenciaAreaUnesco}/listaEquivalenciaPorArea/`+id_area_unesco); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlEquivalenciaAreaUnesco}/insertar`, params);
}

async function eliminar(id_equivalencia_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlEquivalenciaAreaUnesco}/eliminar/` + id_equivalencia_area_unesco);
}