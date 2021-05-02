from modelos.Articulo import Articulo
from modelos.ArticuloReferencias import ArticuloReferencias
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

class ArticuloReferenciasSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Articulo
        sqla_session = db.session
    id_article_pwh = fields.Number(dump_only=True)
    id_article = fields.Number(required=True)
    References = fields.String(required=True)

def listaArticulos():
    get_articulos = Articulo.query.all()
    articulos_schema = ArticuloSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"articulos": articulos}))

def extraerReferencias():
    get_articulos = Articulo.query.with_entities(Articulo.id_article_pwh ,Articulo.id_article, Articulo.References)
    articulos_schema = ArticuloReferenciasSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    for articulo in articulos:
        id_article_pwh = articulo["id_article_pwh"]
        id_article = articulo["id_article"]
        referencesString = articulo["References"]
        referencesList = []
        if not referencesString == None: 
            referencesList = referencesString.split(';')
            for reference in referencesList:
                ArticuloReferencias(id_article_pwh,  id_article, reference).create()
    return make_response(jsonify({"extraerReferencias": "True"}))