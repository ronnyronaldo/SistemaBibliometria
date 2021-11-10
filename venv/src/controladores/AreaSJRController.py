from modelos.AreaSJR import AreaSJR
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AreaSJRSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = AreaSJR
        sqla_session = db.session
    id_area_sjr =  fields.Number(dump_only=True)
    nombre = fields.String(required=True)

def listaAreaSJR():
    get_area_sjr = AreaSJR.query.all()
    area_sjr_schema = AreaSJRSchema(many=True)
    area_sjr = area_sjr_schema.dump(get_area_sjr)
    return make_response(jsonify({"area_sjr": area_sjr}))

def insertarAreaSJR(nuevoAreaSJR):
    print(nuevoAreaSJR['nombre'])
    get_area_sjr = AreaSJR.query.filter(AreaSJR.nombre == nuevoAreaSJR['nombre'])
    area_sjr_schema = AreaSJRSchema(many=True)
    area_sjr = area_sjr_schema.dump(get_area_sjr)
    numeroAreaSJR = len(area_sjr)
    if numeroAreaSJR == 0:
        AreaSJR(nuevoAreaSJR['nombre']).create()
        return make_response(jsonify({"respuesta": {"valor":"Área SJR ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"El Área SJR ya esta registrado", "error":"True"}}))

def eliminarAreaSJR(id_area_sjr):
    try:
        areaSJR = AreaSJR.query.get(id_area_sjr)
        AreaSJR.delete(areaSJR)
        return make_response(jsonify({"respuesta": {"valor":"Área SJR eliminada correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar el área sjr ya que hay datos relacionados con la misma.", "error":"True"}}))

def actualizarAreaSJR(areaSJR):
    area_sjr = AreaSJR.query.get_or_404(areaSJR['id_area_sjr'])
    area_sjr.nombre = areaSJR['nombre']
    AreaSJR.create(area_sjr)
    return make_response(jsonify({"respuesta": {"valor":"Área Sjr actualizado correctamente.", "error":"False"}}))

   
