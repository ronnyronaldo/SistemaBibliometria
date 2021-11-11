import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const categoriasSJRService = {
    listaCategoriasSJR,
};

async function listaCategoriasSJR() {
    return fetchWrapper.get(`${endpoints.baseUrlCategoriasSJR}/listaCategoriasSJR`); 
}





