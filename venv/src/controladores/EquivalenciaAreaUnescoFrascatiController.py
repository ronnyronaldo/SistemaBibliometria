from modelos.EquivalenciaAreaUnescoFrascati import EquivalenciaAreaUnescoFrascati
from modelos.AreaUnesco import AreaUnesco
from modelos.AreaFrascati import AreaFrascati
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class EquivalenciaAreaUnescoFrascatiSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = EquivalenciaAreaUnescoFrascati
        sqla_session = db.session
    id_equivalencia_area = fields.Number(dump_only=True)
    id_area_unesco = fields.Number(required=True)
    id_area_frascati = fields.Number(required=True)

def listaEquivalenciaAreaUnesco(id_area_unesco):
    areaUnescoRespuesta = (db.session.query(EquivalenciaAreaUnescoFrascati, AreaFrascati, AreaUnesco).filter(EquivalenciaAreaUnescoFrascati.id_area_unesco == id_area_unesco)
        .with_entities(EquivalenciaAreaUnescoFrascati.id_area_unesco, EquivalenciaAreaUnescoFrascati.id_area_frascati, EquivalenciaAreaUnescoFrascati.id_equivalencia_area, AreaFrascati.descripcion.label('areaFrascati'), AreaUnesco.descripcion_unesco.label('areaUnesco'))
        .join(AreaFrascati, EquivalenciaAreaUnescoFrascati.id_area_frascati == AreaFrascati.id_area_frascati)
        .join(AreaUnesco, EquivalenciaAreaUnescoFrascati.id_area_unesco == AreaUnesco.id_area_unesco)).all()
    datos = []
    for dato in areaUnescoRespuesta:
        datos.append(dict(dato)) # Serializo cada fila
    return make_response(jsonify({"datos": datos}))
    
def insertarEquivalenciaAreaUnesco(nuevaEquivalencia):
    get_equivalencia = EquivalenciaAreaUnescoFrascati.query.filter((EquivalenciaAreaUnescoFrascati.id_area_unesco == int(nuevaEquivalencia['id_area_unesco'])) & (EquivalenciaAreaUnescoFrascati.id_area_frascati == int(nuevaEquivalencia['id_area_frascati'])))
    equivalencia_schema = EquivalenciaAreaUnescoFrascatiSchema(many=True)
    equivalencia = equivalencia_schema.dump(get_equivalencia)
    numeroEquivalencias = len(equivalencia)
    if numeroEquivalencias  == 0:
        EquivalenciaAreaUnescoFrascati(int(nuevaEquivalencia['id_area_unesco']), int(nuevaEquivalencia['id_area_frascati'])).create()
        return make_response(jsonify({"respuesta": {"valor":"Asignado la equivalencia correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La equivalencia ya esta ingresada", "error":"True"}}))


def eliminarEquivalenciaAreaUnesco(id_equivalencia_area):
    try:
        equivalencia = EquivalenciaAreaUnescoFrascati.query.get(id_equivalencia_area)
        EquivalenciaAreaUnescoFrascati.delete(equivalencia)
        return make_response(jsonify({"respuesta": {"valor":"Equivalencia eliminada correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar la equivalencia.", "error":"True"}}))



   
