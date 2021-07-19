from flask import Blueprint
from flask import request
from controladores.AutorController import listaAutores, eliminarAutores, insertarAutor
servicio_autor =  Blueprint('servicio_autor', __name__)
@servicio_autor.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAutor = request.json #Obtengo los datos del Autor para el Nuevo Ingreso
    return insertarAutor(nuevoAutor)

@servicio_autor.route('/listar', methods=['GET']) 
def listarAutores():
    return listaAutores()

@servicio_autor.route('/eliminar/<int:id_autor>', methods=['GET']) 
def eliminarAutorPorId(id_autor):
    return eliminarAutores(id_autor)

