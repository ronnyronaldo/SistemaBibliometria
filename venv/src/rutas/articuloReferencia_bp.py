from flask import Blueprint
from controladores.ArticuloReferenciaController import listaArticulosReferencias, obtenerDetalleReferencias
articuloReferencia_bp = Blueprint('articuloReferencia_bp', __name__)

@articuloReferencia_bp.route('/listar', methods=['GET']) 
def listar():
    return listaArticulosReferencias()

@articuloReferencia_bp.route('/detalleReferencia', methods=['GET']) 
def detallarReferencia():
    return obtenerDetalleReferencias()