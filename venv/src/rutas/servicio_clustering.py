from flask import Blueprint
from controladores.Clustering import ejecutar
servicio_clustering =  Blueprint('servicio_clustering', __name__)
@servicio_clustering.route('/ejecutar', methods=['GET']) 
def clustering():
    return ejecutar()
