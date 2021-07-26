from flask import Blueprint
from flask import request
from controladores.LeyBradfordController import numeroMediosPublicacionReferenicasAreaFrascati, numeroMediosPublicacionReferenicasAreaUnesco, numeroMediosPublicacionReferenicasAreaFrascatiPorAnio, numeroMediosPublicacionReferenicasAreaUnescoPorAnio
servicio_ley_bradford =  Blueprint('servicio_ley_bradford', __name__)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascati(id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascati(id_area_frascati)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnesco(id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnesco(id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnescoPorAnio/<int:anio_publicacion>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnescoPorAnio(anio_publicacion, id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnescoPorAnio(anio_publicacion, id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascatiPorAnio/<int:anio_publicacion>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascatiPorAnio(anio_publicacion, id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascatiPorAnio(anio_publicacion, id_area_frascati)

