from modelos.ArticuloScopus import ArticuloScopus
from modelos.ArticuloReferenciaScopus import ArticuloReferenciaScopus
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ArticuloScopusSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ArticuloScopus
        sqla_session = db.session
    id_article = fields.Number(dump_only=True)
    Authors = fields.String(required=True)
    Authors_ID = fields.String(required=True)
    Title = fields.String(required=True)
    Year = fields.Number(required=True)
    Source_Title = fields.String(required=True)
    Volume = fields.String(required=True)
    Issue = fields.String(required=True)
    Art_No = fields.String(required=True)
    Page_start = fields.String(required=True)
    Page_end = fields.String(required=True)
    Page_count = fields.String(required=True)
    Cited_by = fields.String(required=True)
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

class ArticuloReferenciaScopusSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ArticuloScopus
        sqla_session = db.session
    id_article_pwh = fields.Number(dump_only=True)
    id_article = fields.Number(required=True)
    References = fields.String(required=True)

def listaArticulos():
    get_articulos = ArticuloScopus.query.all()
    articulos_schema = ArticuloScopusSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"articulos": articulos}))

def extraerReferencias():
    get_articulos = ArticuloScopus.query.with_entities(ArticuloScopus.id_article, ArticuloScopus.References)
    articulos_schema = ArticuloReferenciaScopusSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    for articulo in articulos:
        id_article = articulo["id_article"]
        referencesString = articulo["References"]
        referencesList = []
        if not referencesString == None: 
            referencesList = referencesString.split(';')
            for reference in referencesList:
                ArticuloReferenciaScopus(id_article, reference).create()
    return make_response(jsonify({"extraerReferencias": "True"}))