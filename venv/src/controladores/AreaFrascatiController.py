from modelos.AreaFrascati import AreaFrascati
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AreaFrascatiSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = AreaFrascati
        sqla_session = db.session
    id_area_frascati =  fields.Number(dump_only=True)
    descripcion = fields.String(required=True)

def validarAreaFrascatiPorNombre(nombre):
    get_area_frascati = AreaFrascati.query.filter(AreaFrascati.descripcion == nombre)
    area_frascati_schema = AreaFrascatiSchema(many=True)
    area_frascati = area_frascati_schema.dump(get_area_frascati)
    return make_response(jsonify({"area_frascati": area_frascati}))

def listaAreaFrascati():
    get_area_frascati = AreaFrascati.query.all()
    area_frascati_schema = AreaFrascatiSchema(many=True)
    area_frascati = area_frascati_schema.dump(get_area_frascati)
    return make_response(jsonify({"area_frascati": area_frascati}))

def insertarAreaFrascati(nuevoAreaFrascati):
    print(nuevoAreaFrascati['descripcion'])
    get_area_frascati = AreaFrascati.query.filter(AreaFrascati.descripcion == nuevoAreaFrascati['descripcion'])
    area_frascati_schema = AreaFrascatiSchema(many=True)
    area_frascati = area_frascati_schema.dump(get_area_frascati)
    numeroAreaFrascati = len(area_frascati)
    if numeroAreaFrascati == 0:
        AreaFrascati(nuevoAreaFrascati['descripcion']).create()
        return make_response(jsonify({"respuesta": {"valor":"Área Frascati ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"El Área Frascati ya esta registrado", "error":"True"}}))

def eliminarAreaFrascati(id_area_frascati):
    print(id_area_frascati)
    areaFrascati = AreaFrascati.query.get(id_area_frascati)
    AreaFrascati.delete(areaFrascati)
    return make_response(jsonify({"respuesta": {"valor":"Área Frascati eliminada correctamente.", "error":"False"}}))
