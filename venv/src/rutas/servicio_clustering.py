from flask import Blueprint
from controladores.Clustering import clusterFactorImpactoXCuartil, clusterCuarFIPorAnio, redesAutoresAreasOrden, clusterCuarFIPorAreaFrascati,clusterCuarFIPorAreaUnesco, clusterCuarFIPorAreaFrascatiYAnioPublicacion,clusterCuarFIPorAnioAreaUnescoYAnioPublicacion
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutarFactorImpactoXCuartil/<int:num_cluster>', methods=['GET']) 
def clusteringFactorImpactoXCuartil(num_cluster):
    return clusterFactorImpactoXCuartil(num_cluster)

@servicio_clustering.route('/ejecutarClusterCuarFIPorAnio/<int:anio_publicacion>/<int:num_cluster>', methods=['GET']) 
def clusteringCuarFIPorAnio(anio_publicacion, num_cluster):
    return clusterCuarFIPorAnio(anio_publicacion, num_cluster)

@servicio_clustering.route('/ejecutarClusterCuarFIPorAreaFrascati/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringCuarFIPorAreaFrascati(id_area_frascati, num_cluster):
    return clusterCuarFIPorAreaFrascati(id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarClusterCuarFIPorAreaUnesco/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringCuarFIPorAreaUnesco(id_area_unesco, num_cluster):
    return clusterCuarFIPorAreaUnesco(id_area_unesco, num_cluster)

@servicio_clustering.route('/ejecutarClusterCuarFIPorAreaFrascatiYAnioPublicacion/<int:anio_publicacion>/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringCuarFIPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster):
    return clusterCuarFIPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarClusterCuarFIPorAnioAreaUnescoYAnioPublicacion/<int:anio_publicacion>/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringCuarFIPorAnioAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster):
    return clusterCuarFIPorAnioAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster)

@servicio_clustering.route('/ejecutarRedesAutoresAreasOrden/<int:orden>/<int:area>', methods=['GET']) 
def clusteringRedesAutoresAreasOrden(orden,area):
    return redesAutoresAreasOrden(orden,area)


    

