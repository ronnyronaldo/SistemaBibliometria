import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    clusterAreas,
    ejecutarClusterAreas,
    ejecutarClusterMediosPublicacionOrden,
    ejecutarclusteringRevRefNumCit,
    ejecutarclusteringAreasPorAnio,
    ejecutarclusteringCuarFIPorAnio,
    ejecutarclusteringMediosPublicacionPorAreaFrascati,
    ejecutarclusteringMediosPublicacionPorAreaUnesco,
    ejecutarclusteringMediosPublicacionPorAreaFrascatiYAnioPublicacion,
    ejecutarclusteringMediosPublicacionPorAreaUnescoYAnioPublicacion,
    ejecutarclusteringRevRefNumCitPorAnio,
    ejecutarclusteringRevRefNumCitPorAreaFrascati,
    ejecutarclusteringRevRefNumCitPorAreaUnesco,
    ejecutarclusteringRevRefNumCitPorAreaFrascatiYAnioPublicacion,
    ejecutarclusteringRevRefNumCitPorAreaUnescoYAnioPublicacion,
    ejecutarclusteringRedesAutores,
    ejecutarclusteringRedesAutoresAreas,
    ejecutarClusterCuartilAreaUnesco,
    ejecutarClusterFactorImpactoXCuartil,
    ejecutarclusteringRedesAutoresAreasOrden
};

// Redes de autores por orden de autor y area unesco
async function ejecutarclusteringRedesAutoresAreasOrden(orden,area) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRedesAutoresAreasOrden/`+ orden +'/'+ area);
}

// Redes de autores por orden de autor
async function ejecutarclusteringRedesAutores(orden) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRedesAutores/`+ orden);
}

// Redes de autores por areas
async function ejecutarclusteringRedesAutoresAreas(area) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRedesAutoresAreas/`+ area);
}

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
async function ejecutarclusteringCuarFIPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAnio/`+ anio_publicacion+'/'+ num_cluster);
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
// Cluster por Medios de Publicacion de las Referencias
async function ejecutarclusteringRevRefNumCit(numeroCluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCit/`+numeroCluster);
}
async function ejecutarclusteringRevRefNumCitPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCitPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}
async function ejecutarclusteringRevRefNumCitPorAreaFrascati(id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCitPorAreFra/`+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringRevRefNumCitPorAreaUnesco(id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCitPorAreUne/`+ id_area_unesco +'/'+ num_cluster);
}
async function ejecutarclusteringRevRefNumCitPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCitPorAreFraYAniPub/`+anio_publicacion+"/"+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringRevRefNumCitPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRevistasRefNumCitPorAreUneYAniPub/`+anio_publicacion+"/"+ id_area_unesco +'/'+ num_cluster);
}

// Cluster por Medios de Publicacion de las Referencias

// Cluster por Cuartil y Area Unesco
async function ejecutarClusterCuartilAreaUnesco(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarCuartilAreaUnesco/`+ num_cluster);
}

// Cluster por Cuartil y Factor de Impacto
async function ejecutarClusterFactorImpactoXCuartil(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarFactorImpactoXCuartil/`+ num_cluster);
}








