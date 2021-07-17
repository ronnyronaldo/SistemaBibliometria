from modelos.AreaUnesco import AreaUnesco
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AreaUnescoSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = AreaUnesco
        sqla_session = db.session
    id_area_unesco =  fields.Number(dump_only=True)
    descripcion_unesco = fields.String(required=True)

def validarAreaUnescoPorNombre(nombre):
    get_area_unesco = AreaUnesco.query.filter(AreaUnesco.descripcion_unesco == nombre)
    area_unesco_schema = AreaUnescoSchema(many=True)
    area_unesco = area_unesco_schema.dump(get_area_unesco)
    return make_response(jsonify({"area_unesco": area_unesco}))

def listaAreaUnesco():
    get_area_unesco = AreaUnesco.query.all()
    area_unesco_schema = AreaUnescoSchema(many=True)
    area_unesco = area_unesco_schema.dump(get_area_unesco)
    return make_response(jsonify({"area_unesco": area_unesco}))

def insertarAreaUnesco(nuevoAreaUnesco):
    print(nuevoAreaUnesco['descripcion_unesco'])
    get_area_unesco = AreaUnesco.query.filter(AreaUnesco.descripcion_unesco == nuevoAreaUnesco['descripcion_unesco'])
    area_unesco_schema = AreaUnescoSchema(many=True)
    area_unesco = area_unesco_schema.dump(get_area_unesco)
    numeroAreaUnesco = len(area_unesco)
    if numeroAreaUnesco == 0:
        AreaUnesco(nuevoAreaUnesco['descripcion_unesco']).create()
        return make_response(jsonify({"respuesta": {"valor":"Área Unesco ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"El Área Unesco ya esta registrado", "error":"True"}}))

def eliminarAreaUnesco(id_area_unesco):
    areaUnesco = AreaUnesco.query.get(id_area_unesco)
    AreaUnesco.delete(areaUnesco)
    return make_response(jsonify({"respuesta": {"valor":"Área Unesco eliminada correctamente.", "error":"False"}}))