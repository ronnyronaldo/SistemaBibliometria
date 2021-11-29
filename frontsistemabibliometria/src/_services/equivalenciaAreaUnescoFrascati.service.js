import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const equivalenciaAreaUnescoFrascatiService = {
    listaEquivalenciaAreaUnesco,
    insertar,
    eliminar
};

async function listaEquivalenciaAreaUnesco(id_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlEquivalenciaAreaUnescoFracati}/listaEquivalenciaPorArea/`+id_area_unesco); 
}

async function insertar(params) {
    return fetchWrapper.post(`${endpoints.baseUrlEquivalenciaAreaUnescoFracati}/insertar`, params);
}

async function eliminar(id_equivalencia_area_unesco) {
    return fetchWrapper.get(`${endpoints.baseUrlEquivalenciaAreaUnescoFracati}/eliminar/` + id_equivalencia_area_unesco);
}