from flask import Blueprint
from flask import request
from controladores.MedioPublicacionCitacionController import listaMedioPublicacionCitacion, conteoMediosPublicacionCitacion
from controladores.MedioPublicacionCitacionController import eliminarMediosPublicacionCitacion
servicio_medio_publicacion_citacion =  Blueprint('servicio_medio_publicacion_citacion', __name__)

@servicio_medio_publicacion_citacion.route('/listar', methods=['GET']) 
def listar():
    return listaMedioPublicacionCitacion()

@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacion', methods=['GET']) 
def conteo():
    return conteoMediosPublicacionCitacion()

@servicio_medio_publicacion_citacion.route('/eliminarTodo', methods=['GET']) 
def eliminarTodo():
    return eliminarMediosPublicacionCitacion()

