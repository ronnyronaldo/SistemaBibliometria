from modelos.ResumenMediosPublicacion import ResumenMediosPublicacion
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func
from controladores.SJRController import listaSJRPorId
from controladores.MedioPublicacionPublicacionController import listaMedioPublicacionPublicacionPorId
from controladores.MedioPublicacionCitacionController import listaMedioPublicacionCitacionPorId
from controladores.MedioPublicacionBusquedaController import listaMedioPublicacionBusquedaPorId


db = SQLAlchemy()

class ResumenMedioPublicacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ResumenMediosPublicacion
        sqla_session = db.session
    id_resumen = fields.Number(dump_only=True)
    id_medio_publicacion = fields.String(required=True)
    id_medio_citacion = fields.String(required=True)
    id_medio_busqueda = fields.String(required=True)
    id_medio_sjr = fields.String(required=True)

def listaResumenMediosPublicacion():
    get_resumen_medios_publicacion = ResumenMediosPublicacion.query.all()
    resumen_medios_publicacion_schema = ResumenMedioPublicacionSchema(many=True)
    resumen_medios_publicacion =  resumen_medios_publicacion_schema.dump(get_resumen_medios_publicacion)
    respuestaFinal = []
    for item in resumen_medios_publicacion:
        listadoMediosCitacion = []
        listadoMediosPublicacion = []
        listadoMediosBusqueda = []
        listadoMediosSJR = []
        mediosCitacion = item['id_medio_citacion'].split(sep=',')
        mediosPublicacion = item['id_medio_publicacion'].split(sep=',')
        mediosBusqueda = item['id_medio_busqueda'].split(sep=',')
        mediosSJR = item['id_medio_sjr'].split(sep=',')
        for itemCitacion in mediosCitacion:
            if(itemCitacion != ''): 
                citacion = listaMedioPublicacionCitacionPorId(itemCitacion)[0]
                listadoMediosCitacion.append(citacion)
        for itemPublicacion in mediosPublicacion:
            if(itemPublicacion != ''): 
                publicacion = listaMedioPublicacionPublicacionPorId(itemPublicacion)[0]
                listadoMediosPublicacion.append(publicacion)
        for itemBusqueda in mediosBusqueda:
            if(itemBusqueda != ''): 
                busqueda = listaMedioPublicacionBusquedaPorId(itemBusqueda)[0]
                listadoMediosBusqueda.append(busqueda)
        for itemSJR in mediosSJR:
            if(itemSJR != ''): 
                sjr = listaSJRPorId(itemSJR)[0]
                listadoMediosSJR.append(sjr)
        respuesta = {
            "publicacion": listadoMediosPublicacion,
            "citacion": listadoMediosCitacion,
            "busquedaResult": listadoMediosBusqueda,
            "sjrResult" : listadoMediosSJR,
            "indexado" : item['indexado']
        }
        respuestaFinal.append(respuesta)
    return make_response(jsonify({"resumen_medios_publicacion": respuestaFinal}))

def eliminarResumenMediosPublicacion():
    try:
        num_rows_deleted = db.session.query(ResumenMediosPublicacion).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))












