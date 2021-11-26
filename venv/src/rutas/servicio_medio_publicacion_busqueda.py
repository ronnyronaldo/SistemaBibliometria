from flask import Blueprint
from flask import request
from controladores.MedioPublicacionBusquedaController import listaMedioPublicacionBusqueda, conteoMediosPublicacionBusqueda, conteoMediosPublicacionBusquedaPorAnio
servicio_medio_publicacion_busqueda =  Blueprint('servicio_medio_publicacion_busqueda', __name__)
@servicio_medio_publicacion_busqueda.route('/listar', methods=['GET']) 
def listar():
    return listaMedioPublicacionBusqueda()
    
# Conteo sin Filttros
@servicio_medio_publicacion_busqueda.route('/conteoMediosPublicacionBusqueda', methods=['GET']) 
def conteo():
    return conteoMediosPublicacionBusqueda()

# Medio de Publicacion Por Año
@servicio_medio_publicacion_busqueda.route('/conteoMediosPublicacionBusquedaPorAnio/<int:anio_desde>/<int:anio_hasta>', methods=['GET']) 
def contarMediosPublicacionBusquedaPorAnio(anio_desde, anio_hasta):
    return conteoMediosPublicacionBusquedaPorAnio(anio_desde, anio_hasta)
