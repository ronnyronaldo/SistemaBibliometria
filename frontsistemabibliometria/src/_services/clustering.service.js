import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    clusterAreas
};

async function clusterAreas() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutar`);
}







