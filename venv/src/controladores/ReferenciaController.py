from modelos.Referencia import Referencia
from modelos.ReferenciaCompleta import ReferenciaCompleta
from modelos.ArticuloReferencias import ArticuloReferencias
from modelos.ReferenciasNoEncontradas import ReferenciasNoEncontradas
from modelos.ReferenciasErroneas import ReferenciasErroneas
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import concat
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
    referencias = (db.session.query(ArticuloReferencias, Referencia)
        .join(Referencia.articulosReferencia)
        ).filter((ArticuloReferencias.reference.like(concat('%',Referencia.title,'%'))) & (ArticuloReferencias.reference.like(concat('%', Referencia.pub_year, '%')))).all()
    for referencia in referencias:
        ReferenciaCompleta(referencia.Referencia.id_articleRef , referencia.Referencia.id, referencia.Referencia.container_type, "null", referencia.Referencia.filled, referencia.Referencia.gsrank, referencia.Referencia.pub_url, referencia.Referencia.author_id, referencia.Referencia.num_citations, referencia.Referencia.url_scholarbib, referencia.Referencia.url_add_sclib, referencia.Referencia.citedby_url, referencia.Referencia.url_related_articles, referencia.Referencia.title, referencia.Referencia.author, referencia.Referencia.pub_year, referencia.Referencia.venue, referencia.Referencia.abstract).create()

    return make_response(jsonify({"Comparadas titulo de las referencias": "referencias"}))

def listarReferenciasNoEncontradas():
    subquery = (db.session.query(ArticuloReferencias, Referencia).with_entities(ArticuloReferencias.id)
        .join(Referencia.articulosReferencia))
    query = db.session.query(ArticuloReferencias).filter(ArticuloReferencias.id.notin_(subquery)).filter(ArticuloReferencias.id <= 181)
    referencias = query.all()
    for referencia in referencias:
        ReferenciasNoEncontradas(referencia.id,referencia.id_article_pwh, referencia.id_article, referencia.reference).create()
    return make_response(jsonify({"Listando referencias no encontradas": "referencias"}))

def listarReferenciasErroneasEncontradas():
    subquery = (db.session.query(Referencia, ReferenciaCompleta).with_entities(Referencia.id_articleRef)
        .join(ReferenciaCompleta, Referencia.id_articleRef == ReferenciaCompleta.id_articleRef))
    query = db.session.query(Referencia, ArticuloReferencias).filter(Referencia.id_articleRef.notin_(subquery)).filter((Referencia.id_articleRef <= 181) & (ArticuloReferencias.id == Referencia.id_articleRef))
    referencias = query.all()
    for referencia in referencias:
        ReferenciasErroneas(referencia.ArticuloReferencias.id, referencia.ArticuloReferencias.id_article_pwh, referencia.ArticuloReferencias.id_article, referencia.ArticuloReferencias.reference).create()
    return make_response(jsonify({"Referencias erroneas": "referencias"}))