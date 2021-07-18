from flask import Blueprint
from flask import request
from controladores.AutorController import listaAutores, eliminarAutores
servicio_autor =  Blueprint('servicio_autor', __name__)
@servicio_autor.route('/listar', methods=['GET']) 
def listarAutores():
    return listaAutores()

@servicio_autor.route('/eliminar/<int:id_autor>', methods=['GET']) 
def eliminarAutorPorId(id_autor):
    return eliminarAutores(id_autor)

