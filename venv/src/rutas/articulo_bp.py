from flask import Blueprint
from controladores.ArticuloController import listaArticulos, extraerReferencias
articulo_bp = Blueprint('articulo_bp', __name__)
@articulo_bp.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()

@articulo_bp.route('/referencias', methods=['GET']) 
def getReferencias():
    return extraerReferencias()