import { fetchWrapper} from '../_helpers/fetch-wrapper';
import endpoints from "./endpoints";

export const clusteringService = {
    ejecutarclusteringCuarFIPorAnio,
    ejecutarclusteringCuarFIPorAreaFrascati,
    ejecutarclusteringCuarFIPorAreaUnesco,
    ejecutarclusteringCuarFIPorAreaFrascatiYAnioPublicacion,
    ejecutarclusteringCuarFIPorAreaUnescoYAnioPublicacion,
    ejecutarClusterFactorImpactoXCuartil,
    ejecutarclusteringRedesAutoresAreasOrden
};

// Redes de autores por orden de autor y area unesco
async function ejecutarclusteringRedesAutoresAreasOrden(orden,area) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarRedesAutoresAreasOrden/`+ orden +'/'+ area);
}

async function ejecutarclusteringCuarFIPorAnio(anio_publicacion, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAnio/`+ anio_publicacion+'/'+ num_cluster);
}
async function ejecutarclusteringCuarFIPorAreaFrascati(id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAreaFrascati/`+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringCuarFIPorAreaUnesco(id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAreaUnesco/`+ id_area_unesco +'/'+ num_cluster);
}
async function ejecutarclusteringCuarFIPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAreaFrascatiYAnioPublicacion/`+anio_publicacion+"/"+ id_area_frascati +'/'+ num_cluster);
}
async function ejecutarclusteringCuarFIPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarClusterCuarFIPorAnioAreaUnescoYAnioPublicacion/`+anio_publicacion+"/"+ id_area_unesco +'/'+ num_cluster);
}

// Cluster por Cuartil y Factor de Impacto
async function ejecutarClusterFactorImpactoXCuartil(num_cluster) {
    return fetchWrapper.get(`${endpoints.baseUrlClustering}/ejecutarFactorImpactoXCuartil/`+ num_cluster);
}








