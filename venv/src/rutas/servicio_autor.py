from flask import Blueprint
from flask import request
from controladores.AutorController import listaAutores, actualizarAutor
servicio_autor =  Blueprint('servicio_autor', __name__)

@servicio_autor.route('/listar', methods=['GET']) 
def listarAutores():
    return listaAutores()

@servicio_autor.route('/actualizar', methods=['POST']) 
def actualizar():
    autor = request.json #Obtengo los datos del autor para la actualizacion
    return actualizarAutor(autor)
