from modelos.ArticuloReferencias import ArticuloReferencias
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ArticuloReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ArticuloReferencias
        sqla_session = db.session
    id = fields.Number(dump_only=True)
    id_article_pwh = fields.Number(dump_only=True)
    id_article = fields.Number(required=True)
    references = fields.String(required=True)

def listaArticulosReferencias():
    get_articulos = ArticuloReferencias.query.all()
    articulos_schema = ArticuloReferenciaSchema(many=True)
    articulosRef = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"referencias": articulosRef}))
