from flask import Blueprint
from flask import request
from controladores.LeyBradfordController import numeroMediosPublicacionReferenicasAreaFrascati, numeroMediosPublicacionReferenicasAreaUnesco, numeroMediosPublicacionReferenicasAreaFrascatiPorAnio, numeroMediosPublicacionReferenicasAreaUnescoPorAnio
from controladores.LeyBradfordController  import numeroMediosPublicacionReferenicas, numeroMediosPublicacionReferenicasPorAnio, numeroMediosPublicacionPropiasPorAnio
from controladores.LeyBradfordController  import numeroMediosPublicacionPropias
from controladores.LeyBradfordController  import numeroMediosPublicacionPropiasAreaFrascati
from controladores.LeyBradfordController  import numeroMediosPublicacionPropiasAreaUnesco
from controladores.LeyBradfordController  import numeroMediosPublicacionPropiasAreaFrascatiPorAnio
from controladores.LeyBradfordController  import numeroMediosPublicacionPropiasAreaUnescoPorAnio
from controladores.LeyBradfordController  import listarDatosLeyBradford
from controladores.LeyBradfordController  import coincidenciasNombreRevistas
servicio_ley_bradford =  Blueprint('servicio_ley_bradford', __name__)

@servicio_ley_bradford.route('/listar', methods=['GET']) 
def listar():
    return listarDatosLeyBradford()

# Coincidencia nombre de las revistas
@servicio_ley_bradford.route('/coincidencia', methods=['GET']) 
def coincidencia():
    return coincidenciasNombreRevistas()

# Medios de Publicacion Sin Filtros
@servicio_ley_bradford.route('/numeroMediosPublicacion', methods=['GET']) 
def contarMediosPublicacionReferencias():
    return numeroMediosPublicacionReferenicas()

@servicio_ley_bradford.route('/numeroMediosPublicacionPropios', methods=['GET']) 
def contarMediosPublicacionPropios():
    return numeroMediosPublicacionPropias()
# Medios de Publicacion por Año
@servicio_ley_bradford.route('/numeroMediosPublicacionPropiosPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>', methods=['GET']) 
def contarMediosPublicacionPropiosPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    return numeroMediosPublicacionPropiasPorAnio(anio_publicacion_desde, anio_publicacion_hasta)

@servicio_ley_bradford.route('/numeroMediosPublicacionPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    return numeroMediosPublicacionReferenicasPorAnio(anio_publicacion_desde, anio_publicacion_hasta)
#  Medios de Publicacion por Area Frascati
@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascati(id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascati(id_area_frascati)

@servicio_ley_bradford.route('/numeroMediosPublicacionPropiosPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionPropiosPorAreaFrascati(id_area_frascati):
    return numeroMediosPublicacionPropiasAreaFrascati(id_area_frascati)
# Medios de Publicacion por Area Unesco
@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnesco(id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnesco(id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPropiosPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionPropiosPorAreaUnesco(id_area_unesco):
    return numeroMediosPublicacionPropiasAreaUnesco(id_area_unesco)
# Medios de Publicacion por Año y Area Unesco
@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaUnescoPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    return numeroMediosPublicacionReferenicasAreaUnescoPorAnio(anio_publicacion_desde,anio_publicacion_hasta, id_area_unesco)

@servicio_ley_bradford.route('/numeroMediosPublicacionPropiosPorAreaUnescoPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionPropiosPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    return numeroMediosPublicacionPropiasAreaUnescoPorAnio(anio_publicacion_desde,anio_publicacion_hasta, id_area_unesco)
# Medios de Publicacion por Año y Area Frascati
@servicio_ley_bradford.route('/numeroMediosPublicacionPorAreaFrascatiPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionReferenciasPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    return numeroMediosPublicacionReferenicasAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati)

@servicio_ley_bradford.route('/numeroMediosPublicacionPropiosPorAreaFrascatiPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionPropiosPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    return numeroMediosPublicacionPropiasAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati)

