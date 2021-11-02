from flask import Blueprint
from flask import request
from controladores.AreaUnescoController import validarAreaUnescoPorNombre, listaAreaUnesco, insertarAreaUnesco, eliminarAreaUnesco
from controladores.AreaUnescoController import actualizarAreaUnesco
servicio_area_unesco= Blueprint('servicio_area_unesco', __name__)
@servicio_area_unesco.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAreaUnesco = request.json #Obtengo los datos del Area Unesco para el Nuevo Ingreso
    return insertarAreaUnesco(nuevoAreaUnesco)

@servicio_area_unesco.route('/validarAreaUnescoPorNombre/<string:nombre>', methods=['GET']) 
def validar(nombre):
    return validarAreaUnescoPorNombre(nombre)

@servicio_area_unesco.route('/listaAreaUnesco', methods=['GET']) 
def listaAreas():
    return listaAreaUnesco()

@servicio_area_unesco.route('/eliminar/<int:id_area_unesco>', methods=['GET']) 
def eliminarAreaUnescoPorId(id_area_unesco):
    return eliminarAreaUnesco(id_area_unesco)

@servicio_area_unesco.route('/actualizar', methods=['POST']) 
def actualizar():
    area_unesco = request.json #Obtengo los datos del area unesco para la actualizacion
    return actualizarAreaUnesco(area_unesco)


