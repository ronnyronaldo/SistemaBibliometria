from flask import Blueprint
from flask import request
from controladores.MedioPublicacionController import listaMedioPublicacion, verificaMedioPublicacionPorNombre, insertarMedioPublicacion, eliminarMedioPublicacion
servicio_medio_publicacion =  Blueprint('servicio_medio_publicacion', __name__)
@servicio_medio_publicacion.route('/insertar', methods=['POST']) 
def insertar():
    nuevoMedioPublicacion = request.json #Obtengo los datos del medio de publicación para el Nuevo Ingreso
    return insertarMedioPublicacion(nuevoMedioPublicacion)

@servicio_medio_publicacion.route('/listar', methods=['GET']) 
def listarMedioPublicacion():
    return listaMedioPublicacion()

@servicio_medio_publicacion.route('/verificaMedioPublicacionPorNombre/<string:nombre>', methods=['GET']) 
def listarMedioPublicacionPorNombre(nombre):
    return verificaMedioPublicacionPorNombre(nombre)

@servicio_medio_publicacion.route('/eliminar/<int:id_medio_publicacion>', methods=['GET']) 
def eliminarMedioPublicacionPorId(id_medio_publicacion):
    return eliminarMedioPublicacion(id_medio_publicacion)
