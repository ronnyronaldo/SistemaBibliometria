import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";
export const autorService = {
    listar
    
};
async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlAutor}/listar`);
}


