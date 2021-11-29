from flask import Blueprint
from flask import request
from controladores.EquivalenciaAreaUnescoFrascatiController import listaEquivalenciaAreaUnesco, insertarEquivalenciaAreaUnesco, eliminarEquivalenciaAreaUnesco
servicio_equivalencia_area_unesco_frascati = Blueprint('servicio_equivalencia_area_unesco_frascati', __name__)
@servicio_equivalencia_area_unesco_frascati.route('/insertar', methods=['POST']) 
def insertar():
    nuevoEquivalenciaAreaUnesco = request.json #Obtengo los datos de la equivalencia con el area unesco
    return insertarEquivalenciaAreaUnesco(nuevoEquivalenciaAreaUnesco)

@servicio_equivalencia_area_unesco_frascati.route('/listaEquivalenciaPorArea/<int:id_area_unesco>', methods=['GET']) 
def listaEquivalenciaPorArea(id_area_unesco):
    return listaEquivalenciaAreaUnesco(id_area_unesco)

@servicio_equivalencia_area_unesco_frascati.route('/eliminar/<int:id_equivalencia_area>', methods=['GET']) 
def eliminarEquivalenciaAreaUnescoPorId(id_equivalencia_area):
    return eliminarEquivalenciaAreaUnesco(id_equivalencia_area)
    