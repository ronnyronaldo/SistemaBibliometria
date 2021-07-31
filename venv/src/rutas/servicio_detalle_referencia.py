from flask import Blueprint
from flask import request
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAnio, numeroDetalleReferenciaIngresadas, listaDetalleReferenciaPorIdArticulo
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascati
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaUnesco
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaUnescoYAnioPublicacion, actualizarDetalleReferencia

servicio_detalle_referencia =  Blueprint('servicio_detalle_referencia', __name__)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAnio/<int:anio_publicacion>', methods=['GET']) 
def listarDetalleReferenciaPorAnio(anio_publicacion):
    return listaDetalleReferenciaPorAnio(anio_publicacion)

@servicio_detalle_referencia.route('/numeroDetalleReferenciaIngresadas', methods=['GET']) 
def numeroDetalleReferencia():
    return numeroDetalleReferenciaIngresadas()

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorIdArticulo/<int:id_articulo>', methods=['GET']) 
def listarDetalleReferenciaPorIdArticulo(id_articulo):
    return listaDetalleReferenciaPorIdArticulo(id_articulo)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def listarDetalleReferenciaPorAreaFrascati(id_area_frascati):
    return listaDetalleReferenciaPorAreaFrascati(id_area_frascati)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def listarDetalleReferenciaPorAreaUnesco(id_area_unesco):
    return listaDetalleReferenciaPorAreaUnesco(id_area_unesco)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAreaFrascatiYAnio/<int:anio_publicacion>/<int:id_area_frascati>', methods=['GET']) 
def listarDetalleReferenciaPorAreaFrascatiYAnio(anio_publicacion, id_area_frascati):
    return listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAreaUnescoYAnio/<int:anio_publicacion>/<int:id_area_unesco>', methods=['GET']) 
def listarDetalleReferenciaPorAreaUnescoYAnio(anio_publicacion, id_area_unesco):
    return listaDetalleReferenciaPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco)

@servicio_detalle_referencia.route('/actualizarDetalleReferencia', methods=['POST']) 
def actualizar():
    detalleReferencia = request.json #Obtengo los datos de las estadísticas de uso para el Nuevo Ingreso
    return actualizarDetalleReferencia(detalleReferencia)
