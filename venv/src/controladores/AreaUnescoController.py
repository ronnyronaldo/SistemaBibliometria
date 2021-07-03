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
