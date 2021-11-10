from flask import Blueprint
from flask import request
from controladores.AreaSJRController import listaAreaSJR, insertarAreaSJR, eliminarAreaSJR
from controladores.AreaSJRController import actualizarAreaSJR
servicio_area_sjr= Blueprint('servicio_area_sjr', __name__)
@servicio_area_sjr.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAreaSJR = request.json #Obtengo los datos del Area Frascati para el Nuevo Ingreso
    return insertarAreaSJR(nuevoAreaSJR)

@servicio_area_sjr.route('/listaAreaSJR', methods=['GET']) 
def listaAreas():
    return listaAreaSJR()

@servicio_area_sjr.route('/eliminar/<int:id_area_sjr>', methods=['GET']) 
def eliminarAreaFrascatiPorId(id_area_sjr):
    return eliminarAreaSJR(id_area_sjr)

@servicio_area_sjr.route('/actualizar', methods=['POST']) 
def actualizar():
    area_sjr = request.json #Obtengo los datos del area frascati para la actualizacion
    return actualizarAreaSJR(area_sjr)


