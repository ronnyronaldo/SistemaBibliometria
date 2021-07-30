from flask import Blueprint
from flask import request
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesAreaUnesco, numeroPublicacionesAreaFrascati
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesAreaUnescoPorAnioPublicacion, numeroPublicacionesAreaFrascatiPorAnioPublicacion
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesMediosPublicacion, numeroPublicacionesMediosPublicacionPorAreaUnesco
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesMediosPublicacionPorAreaFrascati, numeroPublicacionesMediosPublicacionPorAreaUnesco
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio, numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesQuartil, numeroPublicacionesQuartilPorAreaUnesco, numeroPublicacionesQuartilPorAreaFrascati
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesQuartilPorAreaUnescoPorAnio, numeroPublicacionesQuartilPorAreaFrascatiPorAnio
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesFactorImpacto, numeroPublicacionesFactorImpactoPorAreaUnesco
from controladores.DatosAnalisisEstadisticoController import numeroPublicacionesFactorImpactoPorAreaUnescoPorAnio, numeroPublicacionesFactorImpactoPorAreaFrascati, numeroPublicacionesFactorImpactoPorAreaFrascatiPorAnio
servicio_analisis_estadistico =  Blueprint('servicio_analisis_estadistico', __name__)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorAreaUnesco', methods=['GET']) 
def contarPublicacionsPorAreaUnesco():
    return numeroPublicacionesAreaUnesco()


@servicio_analisis_estadistico.route('/numeroPublicacionesAreaFrascati', methods=['GET']) 
def contarPublicacionesAreaFrascati():
    return numeroPublicacionesAreaFrascati()

@servicio_analisis_estadistico.route('/numeroPublicacionesAreaFrascatiPorAnio/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesAreaFrascatiPorAnio(anio_publicacion):
    return numeroPublicacionesAreaFrascatiPorAnioPublicacion(anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesAreaUnescoPorAnio/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesAreaUnescoPorAnio(anio_publicacion):
    return numeroPublicacionesAreaUnescoPorAnioPublicacion(anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesMediosPublicacion', methods=['GET']) 
def contarPublicacionsMediosPublicacion():
    return numeroPublicacionesMediosPublicacion()

@servicio_analisis_estadistico.route('/numeroPublicacionesMediosPublicacionPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarPublicacionesMediosPublicacionPorAreaFrascati(id_area_frascati):
    return numeroPublicacionesMediosPublicacionPorAreaFrascati(id_area_frascati)

@servicio_analisis_estadistico.route('/numeroPublicacionesMediosPublicacionPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarPublicacionesMediosPublicacionPorAreaUnesco(id_area_unesco):
    return numeroPublicacionesMediosPublicacionPorAreaUnesco(id_area_unesco)

@servicio_analisis_estadistico.route('/numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio/<int:id_area_frascati>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesMediosPublicacionPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    return numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio/<int:id_area_unesco>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesMediosPublicacionPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    return numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorCuartil', methods=['GET']) 
def contarPublicacionesPorCuartil():
    return numeroPublicacionesQuartil()

@servicio_analisis_estadistico.route('/numeroPublicacionesPorCuartilPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarPublicacionesPorCuartilPorAreaUnesco(id_area_unesco):
    return numeroPublicacionesQuartilPorAreaUnesco(id_area_unesco)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorCuartilPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarPublicacionesPorCuartilPorAreaFrascati(id_area_frascati):
    return numeroPublicacionesQuartilPorAreaFrascati(id_area_frascati)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorCuartilPorAreaUnescoPorAnio/<int:id_area_unesco>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesPorCuartilPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    return numeroPublicacionesQuartilPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorCuartilPorAreaFrascatiPorAnio/<int:id_area_frascati>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesPorCuartilPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    return numeroPublicacionesQuartilPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorFactorImpacto', methods=['GET']) 
def contarPublicacionesPorFactorImpacto():
    return numeroPublicacionesFactorImpacto()

@servicio_analisis_estadistico.route('/numeroPublicacionesPorFactorImpactoPorAreaUnesco/<int:id_area_unesco>', methods=['GET']) 
def contarPublicacionesPorFactorImpactoPorAreaUnesco(id_area_unesco):
    return numeroPublicacionesFactorImpactoPorAreaUnesco(id_area_unesco)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorFactorImpactoPorAreaFrascati/<int:id_area_frascati>', methods=['GET']) 
def contarPublicacionesPorFactorImpactoPorAreaFrascati(id_area_frascati):
    return numeroPublicacionesFactorImpactoPorAreaFrascati(id_area_frascati)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorFactorImpactoPorAreaUnescoPorAnio/<int:id_area_unesco>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesPorFactorImpactoPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    return numeroPublicacionesFactorImpactoPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion)

@servicio_analisis_estadistico.route('/numeroPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio/<int:id_area_frascati>/<int:anio_publicacion>', methods=['GET']) 
def contarPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    return numeroPublicacionesFactorImpactoPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion)