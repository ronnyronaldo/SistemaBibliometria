from flask import Blueprint
from flask import request
from controladores.ReferenciaController import listaReferenciasPorIdArticulo, insertarReferenciaManual, eliminarReferencia, insertarReferenciaAutomatico, listaReferenciasNoEncontradasPorIdArticulo, obtenerDetalleReferenciaIndividual
servicio_referencia= Blueprint('servicio_referencia', __name__)
@servicio_referencia.route('/insertarManual', methods=['POST']) 
def insertarManual():
    nuevoReferencia = request.json #Obtengo los datos de la referencia para el Nuevo Ingreso
    return insertarReferenciaManual(nuevoReferencia) 

@servicio_referencia.route('/insertarAutomatico', methods=['POST']) 
def insertarAutomatico():
    nuevoReferencia = request.json #Obtengo los datos del referencia para el Nuevo Ingreso
    return insertarReferenciaAutomatico(nuevoReferencia) 

@servicio_referencia.route('/obtenerDetalleReferenciaIndividual', methods=['POST']) 
def buscarDetalleReferenciaIndividual():
    referenciaBuscar = request.json #Obtengo los datos de la referencia para la busqueda del detalle 
    return obtenerDetalleReferenciaIndividual(referenciaBuscar) 

@servicio_referencia.route('/listarReferenciasPorIdArticulo/<int:id_articulo>', methods=['GET']) 
def listarReferenciasPorIdArticulo(id_articulo):
    return listaReferenciasPorIdArticulo(id_articulo)

@servicio_referencia.route('/listarReferenciasNoEncontradasPorIdArticulo/<int:id_articulo>', methods=['GET']) 
def listarReferenciasNoEncontradasPorIdArticulo(id_articulo):
    return listaReferenciasNoEncontradasPorIdArticulo(id_articulo)

@servicio_referencia.route('/eliminar/<int:id_referencia>', methods=['GET']) 
def eliminarReferenciasPorId(id_referencia):
    return eliminarReferencia(id_referencia)
