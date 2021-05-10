from flask import Blueprint
from controladores.ReferenciaController import listaReferencias, verificacionReferencia, listarReferenciasNoEncontradas, listarReferenciasErroneasEncontradas
referencia_bp = Blueprint('referencia_bp', __name__)

@referencia_bp.route('/listar', methods=['GET']) 
def listar():
    return  listaReferencias()

@referencia_bp.route('/verificacionReferencia', methods=['GET']) 
def filtrar():
    return verificacionReferencia()

@referencia_bp.route('/listarReferenciasNoEncontradas', methods=['GET']) 
def referenciasNoEncontradasScholar():
    return listarReferenciasNoEncontradas()
    
@referencia_bp.route('/listarReferenciasErroneasEncontradas', methods=['GET']) 
def referenciasErroneasScholar():
    return listarReferenciasErroneasEncontradas()
