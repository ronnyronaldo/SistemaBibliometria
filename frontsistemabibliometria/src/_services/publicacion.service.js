import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const publicacionService = {
    listar
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrl}/listar`);
}




