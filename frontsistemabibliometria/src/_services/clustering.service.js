import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    clusterAreas,
    ejecutarClusterAreas,
    ejecutarClusterMediosPublicacionOrden,
    ejecutarclusteringRevRefNumCit,
    ejecutarclusteringAreasPorAnio,
    ejecutarclusteringMediosPublicacionPorAnio,
    ejecutarclusteringMediosPublicacionPorAreaFrascati,
    ejecutarclusteringMediosPublicacionPorAreaUnesco,
    ejecutarclusteringMediosPublicacionPorAreaFrascatiYAnioPublicacion,
    ejecutarclusteringMediosPublicacionPorAreaUnescoYAnioPublicacion
};

async function clusterAreas() {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutar`);
}
// Cluster por Areas
async function ejecutarClusterAreas(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreas/`+ num_cluster);
}
async function ejecutarclusteringAreasPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterAreasPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}
// Cluster por Areas
// Cluster por Medios Publicacion
async function ejecutarClusterMediosPublicacionOrden(numeroCluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarMediosPublicacionOrdenAutor/` +  numeroCluster);
}
async function ejecutarclusteringMediosPublicacionPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}
async function ejecutarclusteringMediosPublicacionPorAreaFrascati(id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAreaFrascati/`+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringMediosPublicacionPorAreaUnesco(id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAreaUnesco/`+ id_area_unesco +'/'+ num_cluster);
}
async function ejecutarclusteringMediosPublicacionPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAreaFrascatiYAnioPublicacion/`+anio_publicacion+"/"+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringMediosPublicacionPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterMediosPublicacionPorAreaUnescoYAnioPublicacion/`+anio_publicacion+"/"+ id_area_unesco +'/'+ num_cluster);
}
// Cluter por Medios Publicacion
async function ejecutarclusteringRevRefNumCit(numeroCluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCit/`+numeroCluster);
}









