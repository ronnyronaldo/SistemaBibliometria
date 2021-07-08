from flask import Blueprint
from controladores.Clustering import ejecutar, ejecutarAnios
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutar', methods=['GET']) 
def clustering():
    return ejecutar()
    
@servicio_clustering.route('/ejecutarAnios', methods=['GET']) 
def clusteringAnios():
    print('entre al servicio')
    return ejecutarAnios()
