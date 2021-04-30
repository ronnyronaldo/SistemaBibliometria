from flask import Blueprint
from controladores.ArticuloController import listaArticulos
articulo_bp = Blueprint('articulo_bp', __name__)
@articulo_bp.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()