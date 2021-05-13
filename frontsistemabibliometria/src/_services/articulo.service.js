import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";


export const articuloService = {
    listar
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrl}/listar`);
}




