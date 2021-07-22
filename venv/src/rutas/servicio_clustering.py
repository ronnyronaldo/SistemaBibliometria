from flask import Blueprint
from controladores.Clustering import ejecutar, ejecutarAnios, clusterAreas, clusterMediosPublicacionOrdenAutor, clusterRevistasRefNumCit, clusterAreasPorAnio
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

@servicio_clustering.route('/ejecutarRevistasRefNumCit', methods=['GET']) 
def clusteringRevistasRefNumCit():
    return clusterRevistasRefNumCit()

@servicio_clustering.route('/ejecutarClusterAreasPorAnio/<int:anio_publicacion>/<int:num_cluster>', methods=['GET']) 
def clusteringAreasPorAnio(anio_publicacion, num_cluster):
    return clusterAreasPorAnio(anio_publicacion, num_cluster)
