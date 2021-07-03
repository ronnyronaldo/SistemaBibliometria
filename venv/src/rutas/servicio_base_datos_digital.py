from flask import Blueprint
from controladores.BaseDatosDigitalController import listarBaseDatosDigital, buscarBaseDatosDigitalPorId, validarBaseDatosDigitalPorNombre
servicio_base_datos_digital= Blueprint('servicio_base_datos_digital', __name__)
@servicio_base_datos_digital.route('/listar', methods=['GET']) 
def listar():
    return listarBaseDatosDigital()

@servicio_base_datos_digital.route('/buscarBaseDatosDigitalPorId/<int:id_base_datos_digital>', methods=['GET']) 
def listarBaseDatosDigitalPorId(id_base_datos_digital):
    return buscarBaseDatosDigitalPorId(id_base_datos_digital)

@servicio_base_datos_digital.route('/validarBaseDatosDigitalPorNombre/<string:nombre_base_datos_digital>', methods=['GET']) 
def listarBaseDatosDigitalPorNombre(nombre_base_datos_digital):
    return validarBaseDatosDigitalPorNombre(nombre_base_datos_digital)

