from flask import Blueprint
from flask import request
from controladores.MedioPublicacionPublicacionController import listaMedioPublicacionPublicacion, conteoMediosPublicacionPublicacion
from controladores.MedioPublicacionPublicacionController import eliminarMediosPublicacionPublicacion
servicio_medio_publicacion_publicacion =  Blueprint('servicio_medio_publicacion_publicacion', __name__)

@servicio_medio_publicacion_publicacion.route('/listar', methods=['GET']) 
def listar():
    return listaMedioPublicacionPublicacion()

@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacion', methods=['GET']) 
def conteo():
    return conteoMediosPublicacionPublicacion()

@servicio_medio_publicacion_publicacion.route('/eliminarTodo', methods=['GET']) 
def eliminarTodo():
    return eliminarMediosPublicacionPublicacion()

