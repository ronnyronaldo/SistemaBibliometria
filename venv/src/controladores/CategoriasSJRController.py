from modelos.CategoriasSJR import CategoriasSJR
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class CategoriasSJRSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = CategoriasSJR
        sqla_session = db.session
    id_categoria  = fields.Number(required=True)
    nombre = fields.String(required=True)

def insertar(nombre):
    CategoriasSJR(nombre).create()

