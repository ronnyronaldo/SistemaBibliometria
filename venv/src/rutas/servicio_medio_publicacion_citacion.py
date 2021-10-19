from flask import Blueprint
from flask import request
from controladores.MedioPublicacionCitacionController import listaMedioPublicacionCitacion, conteoMediosPublicacionCitacion
from controladores.MedioPublicacionCitacionController import conteoMediosPublicacionCitacionPorAnio
from controladores.MedioPublicacionCitacionController import conteoMediosPublicacionCitacionPorAreaFrascati
from controladores.MedioPublicacionCitacionController import conteoMediosPublicacionCitacionPorAreaUnesco
from controladores.MedioPublicacionCitacionController import conteoMediosPublicacionCitacionPorAreaUnescoPorAnio
from controladores.MedioPublicacionCitacionController import conteoMediosPublicacionCitacionPorAreaFrascatiPorAnio

servicio_medio_publicacion_citacion =  Blueprint('servicio_medio_publicacion_citacion', __name__)

@servicio_medio_publicacion_citacion.route('/listar', methods=['GET']) 
def listar():
    return listaMedioPublicacionCitacion()
    
# Conteo sin Filttros
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacion', methods=['GET']) 
def conteo():
    return conteoMediosPublicacionCitacion()

# Medio de Publicacion Por Año
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacionPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>', methods=['GET']) 
def contarMediosPublicacionCitacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    return conteoMediosPublicacionCitacionPorAnio(anio_publicacion_desde, anio_publicacion_hasta)

# Medio de Publicacion Area Frascati
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionCitacionPorAreaFrascati(id_area_frascati):
    return conteoMediosPublicacionCitacionPorAreaFrascati(id_area_frascati)

# Medio de Publicacion Area Unesco
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionCitacionPorAreaUnesco(id_area_unesco):
    return conteoMediosPublicacionCitacionPorAreaUnesco(id_area_unesco)

# Medio de Publicacion Area Unesco y Año
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionCitacionPorAreaUnescoPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_unesco>', methods=['GET']) 
def contarMediosPublicacionCitacionPorAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    return conteoMediosPublicacionCitacionPorAreaUnescoPorAnio(anio_publicacion_desde,anio_publicacion_hasta, id_area_unesco)

# Medio de Publicacion Area Frascati y Año
@servicio_medio_publicacion_citacion.route('/conteoMediosPublicacionPublicacionPorAreaFrascatiPorAnio/<int:anio_publicacion_desde>/<int:anio_publicacion_hasta>/<int:id_area_frascati>', methods=['GET']) 
def contarMediosPublicacionCitacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    return conteoMediosPublicacionCitacionPorAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati)