from flask import Blueprint
from controladores.AreaFrascatiController import validarAreaFrascatiPorNombre
servicio_area_frascati= Blueprint('servicio_area_frascati', __name__)
@servicio_area_frascati.route('/validarAreaFrascatiPorNombre/<string:nombre>', methods=['GET']) 
def validar(nombre):
    return validarAreaFrascatiPorNombre(nombre)


