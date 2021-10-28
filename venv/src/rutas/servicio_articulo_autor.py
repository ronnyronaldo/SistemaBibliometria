from flask import Blueprint
from flask import request
from controladores.ArticuloAutorController import eliminarArticuloAutor, insertarAutor, listaArticulosPorIdAutor
servicio_articulo_autor =  Blueprint('servicio_articulo_autor', __name__)
@servicio_articulo_autor.route('/insertar', methods=['POST']) 
def insertar():
    nuevoAutor = request.json #Obtengo los datos del Autor para el Nuevo Ingreso
    return insertarAutor(nuevoAutor)

@servicio_articulo_autor.route('/listarPorIdAutor/<string:id_autor>', methods=['GET']) 
def listarArticulosPorIdAutor(id_autor):
    return listaArticulosPorIdAutor(id_autor)

@servicio_articulo_autor.route('/eliminar/<int:id_articulo_autor>', methods=['GET']) 
def eliminarArticuloPorAutor(id_articulo_autor):
    return eliminarArticuloAutor(id_articulo_autor)

