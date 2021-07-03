from flask import Blueprint
from controladores.AreaUnescoController import validarAreaUnescoPorNombre
servicio_area_unesco= Blueprint('servicio_area_unesco', __name__)
@servicio_area_unesco.route('/validarAreaUnescoPorNombre/<string:nombre>', methods=['GET']) 
def validar(nombre):
    return validarAreaUnescoPorNombre(nombre)


