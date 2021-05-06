from modelos.Referencia import Referencia
from modelos.ArticuloReferencias import ArticuloReferencias
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Referencia
        sqla_session = db.session
    id = fields.Number(dump_only=True)
    id_articleRef  = fields.Number(required=True)
    container_type = fields.String(required=True)
    source = fields.String(required=True)
    filled = fields.String(required=True)
    gsrank = fields.String(required=True)
    pub_url =  fields.String(required=True)
    author_id =  fields.String(required=True)
    num_citations = fields.Number(required=True)
    url_scholarbib = fields.String(required=True)
    url_add_sclib = fields.String(required=True)
    citedby_url = fields.String(required=True)
    url_related_articles = fields.String(required=True)
    title = fields.String(required=True)
    author = fields.String(required=True)
    pub_year = fields.Number(required=True)
    venue = fields.String(required=True)
    abstract = fields.String(required=True)

def listaReferencias():
    get_referencias = Referencia.query.all()
    referencia_schema = ReferenciaSchema(many=True)
    referencias = referencia_schema.dump(get_referencias)
    return make_response(jsonify({"referencias": referencias}))

def verificacionReferencia():
    get_referencias = Referencia.query(Referencia, ArticuloReferencias).join(Referencia.id_articleRef, ArticuloReferencias.id).all()
    referencia_schema = ReferenciaSchema(many=True)
    referencias = referencia_schema.dump(get_referencias)

    for referencia in  referencias:
        print(referencia)
    return make_response(jsonify({"Comparadas titulo de las referencias": "True"}))
