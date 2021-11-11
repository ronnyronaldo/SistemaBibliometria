from flask import Blueprint
from flask import request
from controladores.CategoriasSJRController import listaCategorias
servicio_categorias_sjr= Blueprint('servicio_categorias_sjr', __name__)

@servicio_categorias_sjr.route('/listaCategoriasSJR', methods=['GET']) 
def listar():
    return listaCategorias()



