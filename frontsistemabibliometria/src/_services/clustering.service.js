import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    clusterAreas,
    ejecutarClusterAreas,
    ejecutarClusterMediosPublicacionOrden,
    ejecutarclusteringRevRefNumCit,
    ejecutarclusteringAreasPorAnio,
    ejecutarclusteringMediosPublicacionPorAnio
};

async function clusterAreas() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutar`);
}

async function ejecutarClusterAreas(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreas/`+ num_cluster);
}

async function ejecutarClusterMediosPublicacionOrden(numeroCluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarMediosPublicacionOrdenAutor/` +  numeroCluster);
}

async function ejecutarclusteringRevRefNumCit(numeroCluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCit/`+numeroCluster);
}

async function ejecutarclusteringAreasPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreasPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}

async function ejecutarclusteringMediosPublicacionPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}






