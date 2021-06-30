from modelos.MedioPublicacion import MedioPublicacion
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class MedioPublicacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = MedioPublicacion
        sqla_session = db.session
    id_medio_publicacion = fields.Number(dump_only=True)
    nombre = fields.String(required=True)

def listaMedioPublicacion():
    get_medio_publicacion = MedioPublicacion.query.all()
    medio_publicacion_schema = MedioPublicacionSchema(many=True)
    medios_publicacion = medio_publicacion_schema.dump(get_medio_publicacion)
    return make_response(jsonify({"mediosPublicacion": medios_publicacion}))

