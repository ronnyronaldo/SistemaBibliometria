from flask import Blueprint
from controladores.Clustering import clusterAreas, clusterMediosPublicacionOrdenAutor, clusterRevistasRefNumCit, clusterAreasPorAnio, clusterMediosPublicacionOrdenAutorPorAnio
from controladores.Clustering import clusterMediosPublicacionOrdenAutorPorAreaFrascati, clusterMediosPublicacionOrdenAutorPorAreaUnesco
from controladores.Clustering import clusterMediosPublicacionOrdenAutorPorAreaFrascatiYAnioPublicacion, clusterMediosPublicacionOrdenAutorPorAreaUnescoYAnioPublicacion
from controladores.Clustering import clusterRevistasRefNumCitPorAnio, clusterRevistasRefNumCitPorAreaFrascati
from controladores.Clustering import clusterRevistasRefNumCitPorAreaUnesco, clusterRevistasRefNumCitPorAreFraYAniPub
from controladores.Clustering import clusterRevistasRefNumCitPorAreUneYAniPub, redesAutores, redesAutoresAreas
from controladores.Clustering import clusterCuartilAreaUnesco
servicio_clustering =  Blueprint('servicio_clustering', __name__)
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
# Medios Publicacion
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
# Medios Publicacion

# Medios Publicacion Referencias
@servicio_clustering.route('/ejecutarRevistasRefNumCitPorAnio/<int:anio_publicacion>/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCitPorAnio(anio_publicacion, num_cluster):
    return clusterRevistasRefNumCitPorAnio(anio_publicacion, num_cluster)

@servicio_clustering.route('/ejecutarRevistasRefNumCitPorAreFra/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCitPorAreaFrascati(id_area_frascati, num_cluster):
    return clusterRevistasRefNumCitPorAreaFrascati(id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarRevistasRefNumCitPorAreUne/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCitPorAreaUnesco(id_area_unesco, num_cluster):
    return clusterRevistasRefNumCitPorAreaUnesco(id_area_unesco, num_cluster)

@servicio_clustering.route('/ejecutarRevistasRefNumCitPorAreFraYAniPub/<int:anio_publicacion>/<int:id_area_frascati>/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCitPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster):
    return clusterRevistasRefNumCitPorAreFraYAniPub(anio_publicacion, id_area_frascati, num_cluster)

@servicio_clustering.route('/ejecutarRevistasRefNumCitPorAreUneYAniPub/<int:anio_publicacion>/<int:id_area_unesco>/<int:num_cluster>', methods=['GET']) 
def clusteringRevistasRefNumCitPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster):
    return clusterRevistasRefNumCitPorAreUneYAniPub(anio_publicacion, id_area_unesco, num_cluster)
# Medios Publicacion Referencias

@servicio_clustering.route('/ejecutarRedesAutores/<int:orden>', methods=['GET']) 
def clusteringRedesAutores(orden):
    return redesAutores(orden)

@servicio_clustering.route('/ejecutarRedesAutoresAreas/<int:area>', methods=['GET']) 
def clusteringRedesAutoresAreas(area):
    return redesAutoresAreas(area)

@servicio_clustering.route('/ejecutarCuartilAreaUnesco/<int:num_cluster>', methods=['GET']) 
def clusteringCuartilArea(num_cluster):
    return clusterCuartilAreaUnesco(num_cluster)

