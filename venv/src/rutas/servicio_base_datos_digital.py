from flask import Blueprint
from controladores.BaseDatosDigitalController import listarBaseDatosDigital, buscarBaseDatosDigitalPorId
servicio_base_datos_digital= Blueprint('servicio_base_datos_digital', __name__)

@servicio_base_datos_digital.route('/listar', methods=['GET']) 
def listar():
    return listarBaseDatosDigital()

@servicio_base_datos_digital.route('/buscarBaseDatosDigitalPorId/<int:id_base_datos_digital>', methods=['GET']) 
def listarBaseDatosDigitalPorId(id_base_datos_digital):
    return buscarBaseDatosDigitalPorId(id_base_datos_digital)

