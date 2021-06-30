import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const medioPublicacionService = {
    listar
};

async function listar() {
    return fetchWrapper.get(`${endpoints.baseUrlMedioPublicacion}/listar`);
}





