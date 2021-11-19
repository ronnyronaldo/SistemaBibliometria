import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const JournalService = {
    listar,
    insertarScienceDirect

};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlJournal}/listar`);
}

async function insertarScienceDirect(params) {
    return fetchWrapper.post(`${endpoints.baseUrlJournal}/insertarScienceDirect`, params);
}