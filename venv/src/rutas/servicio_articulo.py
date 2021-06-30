from flask import Blueprint
from controladores.ArticuloController import listaArticulos, asignarMedioPublicacion
servicio_articulo= Blueprint('servicio_articulo', __name__)
@servicio_articulo.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()

@servicio_articulo.route('/asignarMedioPublicacion', methods=['GET']) 
def asignar():
    return asignarMedioPublicacion()
