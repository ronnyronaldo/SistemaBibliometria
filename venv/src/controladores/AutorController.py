from modelos.Autor import Autor
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AutorSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Autor
        sqla_session = db.session
    id_autor = fields.Number(dump_only=True)
    id_articulo = fields.Number(required=True)
    identificacion = fields.String(required=True)
    orden_autor = fields.Number(required=True)
    nombre = fields.String(required=True)

def listaAutores():
    get_autor = Autor.query.all()
    autor_schema = AutorSchema(many=True)
    autores = autor_schema.dump(get_autor)
    return make_response(jsonify({"autor": autores}))

