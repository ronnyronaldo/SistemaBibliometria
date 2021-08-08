from flask import Blueprint
from flask import request
from controladores.LeyBradfordController import numeroMediosPublicacionReferenicasAreaFrascati, numeroMediosPublicacionReferenicasAreaUnesco, numeroMediosPublicacionReferenicasAreaFrascatiPorAnio, numeroMediosPublicacionReferenicasAreaUnescoPorAnio
from controladores.LeyBradfordController  import numeroMediosPublicacionReferenicas
servicio_ley_bradford =  Blueprint('servicio_ley_bradford', __name__)

@servicio_ley_bradford.route('/numeroMediosPublicacion', methods=['GET']) 
def contarMediosPublicacionReferencias():
    return numeroMediosPublicacionReferenicas()

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascati(id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascati(id_area_frascati)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnesco(id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnesco(id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnescoPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnescoPorAnio(anio_publicacion_desde,anio_publicacion_hasta, id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascatiPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati)

