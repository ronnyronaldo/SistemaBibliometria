from flask import Blueprint
from flask import request
from controladores.MedioPublicacionPublicacionController import listaMedioPublicacionPublicacion, conteoMediosPublicacionPublicacion
from controladores.MedioPublicacionPublicacionController import conteoMediosPublicacionPublicacionPorAnio
from controladores.MedioPublicacionPublicacionController import conteoMediosPublicacionPublicacionPorAreaFrascati
from controladores.MedioPublicacionPublicacionController import conteoMediosPublicacionPublicacionPorAreaUnesco
from controladores.MedioPublicacionPublicacionController import conteoMediosPublicacionPublicacionPorAreaUnescoPorAnio
from controladores.MedioPublicacionPublicacionController import conteoMediosPublicacionPublicacionPorAreaFrascatiPorAnio

servicio_medio_publicacion_publicacion =  Blueprint('servicio_medio_publicacion_publicacion', __name__)

@servicio_medio_publicacion_publicacion.route('/listar', methods=['GET']) 
def listar():
    return listaMedioPublicacionPublicacion()

# Conteno sin Filtros
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacion', methods=['GET']) 
def conteo():
    return conteoMediosPublicacionPublicacion()

# Medio de Publicacion Por Año
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacionPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>', methods=['GET']) 
def contarMediosPublicacionPublicacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    return conteoMediosPublicacionPublicacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta)

# Medio de Publicacion Area Frascati
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionPublicacionPorAreaFrascati(id_area_frascati):
    return conteoMediosPublicacionPublicacionPorAreaFrascati(id_area_frascati)

# Medio de Publicacion Area Unesco
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionPublicacionPorAreaUnesco(id_area_unesco):
    return conteoMediosPublicacionPublicacionPorAreaUnesco(id_area_unesco)

# Medio de Publicacion Area Unesco y Año
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacionPorAreaUnescoPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionPublicacionPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    return conteoMediosPublicacionPublicacionPorAreaUnescoPorAnio(anio_publicacion_desde,anio_publicacion_hasta, id_area_unesco)

# Medio de Publicacion Area Frascati y Año
@servicio_medio_publicacion_publicacion.route('/conteoMediosPublicacionPublicacionPorAreaFrascatiPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    return conteoMediosPublicacionPublicacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati)



