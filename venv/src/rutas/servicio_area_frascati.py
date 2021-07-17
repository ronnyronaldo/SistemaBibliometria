from flask import Blueprint
from flask import request
from controladores.AreaFrascatiController import validarAreaFrascatiPorNombre, listaAreaFrascati, insertarAreaFrascati, eliminarAreaFrascati
servicio_area_frascati= Blueprint('servicio_area_frascati', __name__)
@servicio_area_frascati.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAreaFrascati = request.json #Obtengo los datos del Area Frascati para el Nuevo Ingreso
    return insertarAreaFrascati(nuevoAreaFrascati)

@servicio_area_frascati.route('/validarAreaFrascatiPorNombre/<string:nombre>', methods=['GET']) 
def validar(nombre):
    return validarAreaFrascatiPorNombre(nombre)

@servicio_area_frascati.route('/listaAreaFrascati', methods=['GET']) 
def listaAreas():
    return listaAreaFrascati()

@servicio_area_frascati.route('/eliminar/<int:id_area_frascati>', methods=['GET']) 
def eliminarAreaFrascatiPorId(id_area_frascati):
    return eliminarAreaFrascati(id_area_frascati)


