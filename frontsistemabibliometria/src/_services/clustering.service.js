import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    clusterAreas,
    ejecutarClusterAreas,
    ejecutarClusterMediosPublicacionOrden,
    ejecutarclusteringRevRefNumCit,
    ejecutarclusteringAreasPorAnio
};

async function clusterAreas() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutar`);
}

async function ejecutarClusterAreas(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreas`+'/'+ num_cluster);
}

async function ejecutarClusterMediosPublicacionOrden() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarMediosPublicacionOrdenAutor`);
}

async function ejecutarclusteringRevRefNumCit() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCit`);
}

async function ejecutarclusteringAreasPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreasPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}







