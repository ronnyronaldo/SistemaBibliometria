from flask import Blueprint
from controladores.ArticuloScopusController import listaArticulos
servicio_articulo_scopus = Blueprint('servicio_articulo_scopus', __name__)
@servicio_articulo_scopus.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()