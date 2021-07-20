from flask import Blueprint
from controladores.Clustering import ejecutar, ejecutarAnios, clusterAreas, clusterMediosPublicacionOrdenAutor, clusterRevistasRefNumCit
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutar', methods=['GET']) 
def clustering():
    return ejecutar()
    
@servicio_clustering.route('/ejecutarAnios', methods=['GET']) 
def clusteringAnios():
    print('entre al servicio')
    return ejecutarAnios()

@servicio_clustering.route('/ejecutarClusterAreas', methods=['GET']) 
def clusteringAreas():
    print('entre al servicio')
    return clusterAreas()

@servicio_clustering.route('/ejecutarMediosPublicacionOrdenAutor', methods=['GET']) 
def clusteringMediosPublicacionOrdenAutor():
    return clusterMediosPublicacionOrdenAutor()

@servicio_clustering.route('/ejecutarRevistasRefNumCit', methods=['GET']) 
def clusteringRevistasRefNumCit():
    return clusterRevistasRefNumCit()
