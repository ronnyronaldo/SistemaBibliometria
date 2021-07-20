from modelos.ArticuloScopus import ArticuloScopus
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

def buscarArticuloParaExtraerReferencias(titulo, titulo_alternativo, anio_publicacion):
    get_articulos = ArticuloScopus.query.filter(((ArticuloScopus.Title == titulo) | (ArticuloScopus.Title == titulo_alternativo)) & (ArticuloScopus.Year == anio_publicacion)).with_entities(ArticuloScopus.id_article, ArticuloScopus.References)
    articulos_schema = ArticuloScopusSchema(many=True)
    articulos = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"articulo_scopus": articulos}))
