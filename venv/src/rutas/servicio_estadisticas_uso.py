from flask import Blueprint
from flask import request
from controladores.EstadisticasUsoController import listarEstadisticasUso, buscarEstadisticasUsoPorId, insertarEstadisticasUso, eliminarEstadisticasUso
servicio_estadisticas_uso= Blueprint('servicio_estadisticas_uso', __name__)

@servicio_estadisticas_uso.route('/listar', methods=['GET']) 
def listar():
    return listarEstadisticasUso()

@servicio_estadisticas_uso.route('/buscarEstadisticasUsoPorId/<int:id_base_datos_digital>', methods=['GET']) 
def listarEstadisticasUsoPorId(id_base_datos_digital):
    return buscarEstadisticasUsoPorId(id_base_datos_digital)

@servicio_estadisticas_uso.route('/insertar', methods=['POST']) 
def insertar():
    nuevoEstadisticasUso = request.json #Obtengo los datos de las estadísticas de uso para el Nuevo Ingreso
    return insertarEstadisticasUso(nuevoEstadisticasUso)

@servicio_estadisticas_uso.route('/eliminar/<int:id_estadisticas_uso>', methods=['GET']) 
def eliminarEstadisticaUsoPorId(id_estadisticas_uso):
    return eliminarEstadisticasUso(id_estadisticas_uso)

