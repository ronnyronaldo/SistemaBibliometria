from modelos.Articulo import Articulo
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ArticuloSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Articulo
        sqla_session = db.session
    id_article_pwh = fields.Number(dump_only=True)
    id_article = fields.Number(required=True)
    version = fields.Number(required=True)
    date_from = fields.Date(required=True)
    date_to = fields.Date(required=True)
    Authors = fields.String(required=True)
    Authors_ID = fields.String(required=True)
    Title = fields.String(required=True)
    Year = fields.Number(required=True)
    Source_Title = fields.String(required=True)
    Volume = fields.String(required=True)
    Issue = fields.String(required=True)
    Art_No = fields.String(required=True)
    Cited_by = fields.Number(required=True)
    DOI = fields.String(required=True)
    Link = fields.String(required=True)
    Abstract = fields.String(required=True)
    Index_Keywords = fields.String(required=True)
    References = fields.String(required=True)
    Document_Type = fields.String(required=True)
    Publication_Stage = fields.String(required=True)
    Open_Access = fields.String(required=True)
    Source = fields.String(required=True)
    EID = fields.String(required=True)

def listaArticulos():
    get_articulos = Articulo.query.all()
    articulos_schema = ArticuloSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"articulos": articulos}))