from flask import Blueprint
from controladores.Clustering import clusterFactorImpactoXCuartil, redesAutoresAreasOrden
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutarFactorImpactoXCuartil/<int:num_cluster>', methods=['GET']) 
def clusteringFactorImpactoXCuartil(num_cluster):
    return clusterFactorImpactoXCuartil(num_cluster)

@servicio_clustering.route('/ejecutarRedesAutoresAreasOrden/<int:orden>/<int:area>', methods=['GET']) 
def clusteringRedesAutoresAreasOrden(orden,area):
    return redesAutoresAreasOrden(orden,area)


    

