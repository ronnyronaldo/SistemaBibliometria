from modelos.EstadisticasJournal import EstadisticasJournal
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class EstadisticasJournalSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = EstadisticasJournal
        sqla_session = db.session
    id_estadisticas_journal = fields.Number(dump_only=True)
    id_base_datos_digital = fields.Number(required=True)
    id_journal = fields.Number(required=True)
    año = fields.Number(required=True)
    mes = fields.String(required=True)
    numero_busquedas = fields.Number(required=True)

def buscarEstadisticasJournalPorId(id_base_datos_digital, id_journal):
    get_estadisticas_uso = EstadisticasJournal.query.filter((EstadisticasJournal.id_base_datos_digital == id_base_datos_digital) & (EstadisticasJournal.id_journal == id_journal))
    estadisticas_uso_schema = EstadisticasJournalSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    return make_response(jsonify({"estadisticas_uso_journal": estadisticas_uso}))

def insertarEstadisticasJournal(nuevoEstadisticasUso):
    get_estadisticas_uso = EstadisticasJournal.query.filter((EstadisticasJournal.id_base_datos_digital == nuevoEstadisticasUso['id_journal']) & (EstadisticasJournal.id_base_datos_digital == nuevoEstadisticasUso['id_base_datos_digital']) & (EstadisticasJournal.año == nuevoEstadisticasUso['año']) & (EstadisticasJournal.mes == nuevoEstadisticasUso['mes']))
    estadisticas_uso_schema = EstadisticasJournalSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    numeroEstadisticasUso = len(estadisticas_uso)
    if numeroEstadisticasUso == 0:
        EstadisticasJournal(nuevoEstadisticasUso['id_base_datos_digital'],
        nuevoEstadisticasUso['id_journal'],
        nuevoEstadisticasUso['año'],
        nuevoEstadisticasUso['mes'],
        nuevoEstadisticasUso['numero_busquedas']).create()
        return make_response(jsonify({"respuesta": {"valor":"Valor ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"Los datos que ingreso ya esta registrado", "error":"True"}}))

def eliminarEstadisticasJournal(id_estadisticas_journal):
    estadisticasUso = EstadisticasJournal.query.get(id_estadisticas_journal)
    EstadisticasJournal.delete(estadisticasUso)
    return make_response(jsonify({"respuesta": {"valor":"Estadistica de uso eliminada correctamente.", "error":"False"}}))
