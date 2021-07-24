from flask import Blueprint
from flask import request
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAnio, numeroDetalleReferenciaIngresadas
servicio_detalle_referencia =  Blueprint('servicio_detalle_referencia', __name__)

@servicio_detalle_referencia.route('/listaDetalleReferenciaPorAnio/<int:anio_publicacion>', methods=['GET']) 
def listarDetalleReferenciaPorAnio(anio_publicacion):
    return listaDetalleReferenciaPorAnio(anio_publicacion)

@servicio_detalle_referencia.route('/numeroDetalleReferenciaIngresadas', methods=['GET']) 
def numeroDetalleReferencia():
    return numeroDetalleReferenciaIngresadas()

