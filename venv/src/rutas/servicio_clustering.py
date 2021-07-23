from flask import Blueprint
from controladores.Clustering import ejecutar, ejecutarAnios, clusterAreas, clusterMediosPublicacionOrdenAutor, clusterRevistasRefNumCit, clusterAreasPorAnio, clusterMediosPublicacionOrdenAutorPorAnio
from controladores.Clustering import clusterMediosPublicacionOrdenAutorPorAreaFrascati, clusterMediosPublicacionOrdenAutorPorAreaUnesco
from controladores.Clustering import clusterMediosPublicacionOrdenAutorPorAreaFrascatiYAnioPublicacion, clusterMediosPublicacionOrdenAutorPorAreaUnescoYAnioPublicacion
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutar', methods=['GET']) 
def clustering():
    return ejecutar()
    
@servicio_clustering.route('/ejecutarAnios', methods=['GET']) 
def clusteringAnios():
    print('entre al servicio')
    return ejecutarAnios()

@servicio_clustering.route('/ejecutarClusterAreas/<int:num_cluster>', methods=['GET']) 
def clusteringAreas(num_cluster):
    return clusterAreas(num_cluster)

@servicio_clustering.route('/ejecutarMediosPublicacionOrdenAutor/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionOrdenAutor(num_cluster):
    return clusterMediosPublicacionOrdenAutor(num_cluster)

@servicio_clustering.route('/ejecutarRevistasRefNumCit/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCit(num_cluster):
    return clusterRevistasRefNumCit(num_cluster)

@servicio_clustering.route('/ejecutarClusterAreasPorAnio/<int:anio_publicacion>/<int:num_cluster>', methods=['GET']) 
def clusteringAreasPorAnio(anio_publicacion, num_cluster):
    return clusterAreasPorAnio(anio_publicacion, num_cluster)

@servicio_clustering.route('/ejecutarClusterMediosPublicacionPorAnio/<int:anio_publicacion>/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionPorAnio(anio_publicacion, num_cluster):
    return clusterMediosPublicacionOrdenAutorPorAnio(anio_publicacion, num_cluster)

@servicio_clustering.route('/ejecutarClusterMediosPublicacionPorAreaFrascati/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionPorAreaFrascati(id_area_frascati, num_cluster):
    return clusterMediosPublicacionOrdenAutorPorAreaFrascati(id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarClusterMediosPublicacionPorAreaUnesco/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionPorAreaUnesco(id_area_unesco, num_cluster):
    return clusterMediosPublicacionOrdenAutorPorAreaUnesco(id_area_unesco, num_cluster)

@servicio_clustering.route('/ejecutarClusterMediosPublicacionPorAreaFrascatiYAnioPublicacion/<int:anio_publicacion>/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster):
    return clusterMediosPublicacionOrdenAutorPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarClusterMediosPublicacionPorAreaUnescoYAnioPublicacion/<int:anio_publicacion>/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringMediosPublicacionPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster):
    return clusterMediosPublicacionOrdenAutorPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster)

