from flask import Blueprint
from controladores.MedioPublicacionController import listaMedioPublicacion
servicio_medio_publicacion =  Blueprint('servicio_medio_publicacion', __name__)
@servicio_medio_publicacion.route('/listar', methods=['GET']) 
def listarMedioPublicacion():
    return listaMedioPublicacion()
