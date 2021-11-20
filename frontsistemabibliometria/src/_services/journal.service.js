import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const JournalService = {
    listar,
    insertarScienceDirect,
    insertarEbsco

};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlJournal}/listar`);
}

async function insertarScienceDirect(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarScienceDirect`, params);
}

async function insertarEbsco(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarEbsco`, params);
}