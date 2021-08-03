from flask import Blueprint
from flask import request
from controladores.ArticuloController import listaArticulos, asignarMedioPublicacion, insertarArticulo, eliminarArticulo, listaArticulosMineria, listaArticulosMineriaAnios, obtenerDetalleClusterAreasPub, obtenerDetalleClusterMediosPublicacion, obtenerDetalleClusterMediosPublicacionRef
from controladores.ArticuloController import numeroArticulosIngresados, numeroArticulosNoTienenReferencias, obtenerDetalleClusterCuartilAreUne, obtenerDetalleClusterCuartilFI, actualizarArticulo
servicio_articulo= Blueprint('servicio_articulo', __name__)
@servicio_articulo.route('/insertar', methods=['POST']) 
def insertar():
    nuevoArticulo = request.json #Obtengo los datos del articulo para el Nuevo Ingreso
    return insertarArticulo(nuevoArticulo)

@servicio_articulo.route('/listar', methods=['GET']) 
def listar():
    return listaArticulos()

@servicio_articulo.route('/asignarMedioPublicacion', methods=['GET']) 
def asignar():
    return asignarMedioPublicacion()

@servicio_articulo.route('/eliminar/<int:id_articulo>', methods=['GET']) 
def eliminarArticuloPorId(id_articulo):
    return eliminarArticulo(id_articulo)

@servicio_articulo.route('/listarMineria', methods=['GET']) 
def listarMineria():
    return listaArticulosMineria()

@servicio_articulo.route('/listarMineriaAnios', methods=['GET']) 
def listarMineriaAnios():
    return listaArticulosMineriaAnios()

@servicio_articulo.route('/obtenerDetalleClusterAreasPub', methods=['POST']) 
def obtenerDetalleClusteringAreasPub():
    detalleCluster = request.json #Obtengo los datos del detalle del cluster
    return obtenerDetalleClusterAreasPub(detalleCluster)

@servicio_articulo.route('/obtenerDetalleMediosPublicacion', methods=['POST']) 
def obtenerDetalleClusteringMediosPublicacion():
    detalleCluster = request.json #Obtengo los datos del detalle del cluster medios publicacion
    return obtenerDetalleClusterMediosPublicacion(detalleCluster)

@servicio_articulo.route('/obtenerDetalleMediosPublicacionReferencias', methods=['POST']) 
def obtenerDetalleClusteringMediosPublicacionReferencias():
    detalleCluster = request.json #Obtengo los datos del detalle del cluster medios publicacion
    return obtenerDetalleClusterMediosPublicacionRef(detalleCluster)

@servicio_articulo.route('/numeroArticulosIngresados', methods=['GET']) 
def numeroArticulos():
    return numeroArticulosIngresados()

@servicio_articulo.route('/numeroArticulosNoTienenReferencias', methods=['GET']) 
def numeroArticulosNoTienenRef():
    return numeroArticulosNoTienenReferencias()

@servicio_articulo.route('/obtenerDetalleClusterCuartilAreUne', methods=['POST']) 
def obtenerDetalleClusteringCuartilAreaUnesco():
    detalleCluster = request.json #Obtengo los datos del detalle del cluster medios publicacion
    return obtenerDetalleClusterCuartilAreUne(detalleCluster)

@servicio_articulo.route('/obtenerDetalleClusterCuartilFI', methods=['POST']) 
def obtenerDetalleClusteringCuartilFI():
    detalleCluster = request.json #Obtengo los datos del detalle del cluster medios publicacion
    return obtenerDetalleClusterCuartilFI(detalleCluster)

@servicio_articulo.route('/actualizar', methods=['POST']) 
def actualizar():
    articulo = request.json #Obtengo los datos del articulo para la actualizacion
    return actualizarArticulo(articulo)
