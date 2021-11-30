from flask import Blueprint
from flask import request
from controladores.ResumenMedioPublicacionController import listaResumenMediosPublicacion
servicio_resumen_medios_publicacion =  Blueprint('servicio_resumen_medios_publicacion', __name__)
@servicio_resumen_medios_publicacion.route('/listar', methods=['GET']) 
def listar():
    return listaResumenMediosPublicacion()

