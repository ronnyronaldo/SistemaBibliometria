from flask import Blueprint
from flask import request
from controladores.ParametrosController import listarParametros, insertarParametros, eliminarParametros, actualizarParametros

servicio_parametro= Blueprint('servicio_parametro', __name__)
@servicio_parametro.route('/insertar', methods=['POST']) 
def insertar():
    nuevoParamatro = request.json #Obtengo los datos del parametro para el Nuevo Ingreso
    return insertarParametros(nuevoParamatro)

@servicio_parametro.route('/listar', methods=['GET']) 
def listar():
    return listarParametros()


@servicio_parametro.route('/eliminar/<int:id_parametro>', methods=['GET']) 
def eliminar(id_parametro):
    return eliminarParametros(id_parametro)


@servicio_parametro.route('/actualizar', methods=['POST']) 
def actualizar():
    parametro = request.json #Obtengo los datos del parametro para la actualizacion
    return actualizarParametros(parametro)