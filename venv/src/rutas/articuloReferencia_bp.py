from flask import Blueprint
from controladores.ArticuloReferenciaController import listaArticulosReferencias
articuloReferencia_bp = Blueprint('articuloReferencia_bp', __name__)
@articuloReferencia_bp.route('/listar', methods=['GET']) 
def listar():
    return listaArticulosReferencias()