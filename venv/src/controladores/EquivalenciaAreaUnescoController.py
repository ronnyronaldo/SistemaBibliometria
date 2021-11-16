from modelos.EquivalenciaAreaUnesco import EquivalenciaAreaUnesco
from modelos.AreaSJR import AreaSJR
from modelos.AreaUnesco import AreaUnesco
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class EquivalenciaAreaUnescoSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = EquivalenciaAreaUnesco
        sqla_session = db.session
    id_equivalencia_area = fields.Number(dump_only=True)
    id_area_unesco = fields.Number(required=True)
    id_area_sjr = fields.Number(required=True)

def listaEquivalenciaAreaUnesco(id_area_unesco):
    areaUnescoRespuesta = (db.session.query(EquivalenciaAreaUnesco, AreaSJR, AreaUnesco).filter(EquivalenciaAreaUnesco.id_area_unesco == id_area_unesco)
        .with_entities(EquivalenciaAreaUnesco.id_area_unesco, EquivalenciaAreaUnesco.id_area_sjr, EquivalenciaAreaUnesco.id_equivalencia_area, AreaSJR.nombre.label('areaSJR'), AreaUnesco.descripcion_unesco.label('areaUnesco'))
        .join(AreaSJR, EquivalenciaAreaUnesco.id_area_sjr == AreaSJR.id_area_sjr)
        .join(AreaUnesco, EquivalenciaAreaUnesco.id_area_unesco == AreaUnesco.id_area_unesco)).all()
    datos = []
    for dato in areaUnescoRespuesta:
        datos.append(dict(dato)) # Serializo cada fila
    return make_response(jsonify({"datos": datos}))

def insertarEquivalenciaAreaUnesco(nuevaEquivalencia):
    get_equivalencia = EquivalenciaAreaUnesco.query.filter((EquivalenciaAreaUnesco.id_area_unesco == int(nuevaEquivalencia['id_area_unesco'])) & (EquivalenciaAreaUnesco.id_area_sjr == int(nuevaEquivalencia['id_area_sjr'])))
    equivalencia_schema = EquivalenciaAreaUnescoSchema(many=True)
    equivalencia = equivalencia_schema.dump(get_equivalencia)
    numeroEquivalencias = len(equivalencia)
    if numeroEquivalencias  == 0:
        EquivalenciaAreaUnesco(int(nuevaEquivalencia['id_area_unesco']), int(nuevaEquivalencia['id_area_sjr'])).create()
        return make_response(jsonify({"respuesta": {"valor":"Asignado la equivalencia correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La equivalencia ya esta ingresada", "error":"True"}}))


def eliminarEquivalenciaAreaUnesco(id_equivalencia_area):
    try:
        equivalencia = EquivalenciaAreaUnesco.query.get(id_equivalencia_area)
        EquivalenciaAreaUnesco.delete(equivalencia)
        return make_response(jsonify({"respuesta": {"valor":"Equivalencia eliminada correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar la equivalencia.", "error":"True"}}))



   
