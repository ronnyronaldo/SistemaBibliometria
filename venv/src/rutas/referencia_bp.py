from flask import Blueprint
from controladores.ReferenciaController import listaReferencias, verificacionReferencia
referencia_bp = Blueprint('referencia_bp', __name__)

@referencia_bp.route('/listar', methods=['GET']) 
def listar():
    return  listaReferencias()

@referencia_bp.route('/verificacionReferencia', methods=['GET']) 
def filtrar():
    return verificacionReferencia()
