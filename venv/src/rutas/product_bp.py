from flask import Blueprint
from controladores.ProductController import listaProductos
product_bp = Blueprint('product_bp', __name__)
@product_bp.route('/', methods=['GET']) 
def listar():
    return listaProductos()