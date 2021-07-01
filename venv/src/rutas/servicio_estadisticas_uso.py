from flask import Blueprint
from controladores.EstadisticasUsoController import listarEstadisticasUso, buscarEstadisticasUsoPorId
servicio_estadisticas_uso= Blueprint('servicio_estadisticas_uso', __name__)

@servicio_estadisticas_uso.route('/listar', methods=['GET']) 
def listar():
    return listarEstadisticasUso()

@servicio_estadisticas_uso.route('/buscarEstadisticasUsoPorId/<int:id_base_datos_digital>', methods=['GET']) 
def listarEstadisticasUsoPorId(id_base_datos_digital):
    return buscarEstadisticasUsoPorId(id_base_datos_digital)

