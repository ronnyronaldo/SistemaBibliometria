from flask import Blueprint
from flask import request
from controladores.AutorController import listaAutores
servicio_autor =  Blueprint('servicio_autor', __name__)
@servicio_autor.route('/listar', methods=['GET']) 
def listarAutores():
    return listaAutores()

