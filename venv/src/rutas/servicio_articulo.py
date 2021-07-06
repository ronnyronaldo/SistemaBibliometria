from flask import Blueprint
from flask import request
from controladores.ArticuloController import listaArticulos, asignarMedioPublicacion, insertarArticulo, eliminarArticulo, listaArticulosMineria
servicio_articulo= Blueprint('servicio_articulo', __name__)
@servicio_articulo.route('/insertar', methods=['POST']) 
def insertar():
    nuevoArticulo = request.json #Obtengo los datos del articulo para el Nuevo Ingreso
    return insertarArticulo(nuevoArticulo)

@servicio_articulo.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()

@servicio_articulo.route('/asignarMedioPublicacion', methods=['GET']) 
def asignar():
    return asignarMedioPublicacion()

@servicio_articulo.route('/eliminar/<int:id_articulo>', methods=['GET']) 
def eliminarArticuloPorId(id_articulo):
    return eliminarArticulo(id_articulo)

@servicio_articulo.route('/listarMineria', methods=['GET']) 
def listarMineria():
    return listaArticulosMineria()
