from flask import Blueprint
from flask import request
from controladores.AreaCategoriaSJRController import listaAreaCategoriaSJR, insertarAreaCategoriaSJR, eliminarAreaCategoriaSJR
servicio_area_categoria_sjr= Blueprint('servicio_area_categoria_sjr', __name__)
@servicio_area_categoria_sjr.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAreaCategoriaSJR = request.json #Obtengo los datos del Area Categoria para el Nuevo Ingreso
    return insertarAreaCategoriaSJR(nuevoAreaCategoriaSJR)

@servicio_area_categoria_sjr.route('/listaAreaCategoriaSJR/<int:id_area_sjr>', methods=['GET']) 
def listaAreaCategoria(id_area_sjr):
    return listaAreaCategoriaSJR(id_area_sjr)

@servicio_area_categoria_sjr.route('/eliminar/<int:id_area_categoria_sjr>', methods=['GET']) 
def eliminarAreaCategoriaPorId(id_area_categoria_sjr):
    return eliminarAreaCategoriaSJR(id_area_categoria_sjr)



