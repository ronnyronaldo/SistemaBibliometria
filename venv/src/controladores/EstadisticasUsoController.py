from modelos.EstadisticasUso import EstadisticasUso
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class EstadisticasUsoSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = EstadisticasUso
        sqla_session = db.session
    id_estadisticas_uso = fields.Number(dump_only=True)
    id_base_datos_digital = fields.Number(required=True)
    año = fields.Number(required=True)
    mes = fields.String(required=True)
    numero_busquedas = fields.Number(required=True)
    id_mes = fields.Number(required=True)

def listarEstadisticasUso():
    get_estadisticas_uso = EstadisticasUso.query.all()
    estadisticas_uso_schema = EstadisticasUsoSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    return make_response(jsonify({"estadisticas_uso": estadisticas_uso}))

def buscarEstadisticasUsoPorId(id_base_datos_digital):

    estadisticasRespuesta= (db.session.query(EstadisticasUso).filter(EstadisticasUso.id_base_datos_digital == id_base_datos_digital)
        .with_entities(EstadisticasUso.id_estadisticas_uso, EstadisticasUso.id_base_datos_digital, EstadisticasUso.año, EstadisticasUso.mes, EstadisticasUso.numero_busquedas, EstadisticasUso.id_mes).order_by(EstadisticasUso.año.asc(), EstadisticasUso.id_mes.asc())).all()
    datos = []
    for dato in estadisticasRespuesta:
        datos.append(dict(dato)) # Serializo cada fila
    return make_response(jsonify({"estadisticas_uso": datos}))
    
def insertarEstadisticasUso(nuevoEstadisticasUso):
    get_estadisticas_uso = EstadisticasUso.query.filter((EstadisticasUso.id_base_datos_digital == nuevoEstadisticasUso['id_base_datos_digital']) & (EstadisticasUso.año == nuevoEstadisticasUso['año']) & (EstadisticasUso.id_mes == nuevoEstadisticasUso['id_mes']))
    estadisticas_uso_schema = EstadisticasUsoSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    numeroEstadisticasUso = len(estadisticas_uso)
    if numeroEstadisticasUso == 0:
        EstadisticasUso(nuevoEstadisticasUso['id_base_datos_digital'],
        nuevoEstadisticasUso['año'],
        nuevoEstadisticasUso['mes'],
        nuevoEstadisticasUso['numero_busquedas'], nuevoEstadisticasUso['id_mes']).create()
        return make_response(jsonify({"respuesta": {"valor":"Valor ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"Los datos que ingreso ya esta registrado", "error":"True"}}))

def eliminarEstadisticasUso(id_estadisticas_uso):
    estadisticasUso = EstadisticasUso.query.get(id_estadisticas_uso)
    EstadisticasUso.delete(estadisticasUso)
    return make_response(jsonify({"respuesta": {"valor":"Estadistica de uso eliminada correctamente.", "error":"False"}}))
