from modelos.DetalleReferenciaScopus import DetalleReferenciaScopus
from modelos.ReferenciaCorrectaScopus import ReferenciaCorrectaScopus
from modelos.ArticuloReferenciaScopus import ArticuloReferenciaScopus
from modelos.ReferenciaNoEncontradaScopus import ReferenciaNoEncontradaScopus
from modelos.ReferenciaErroneaScopus import ReferenciaErroneaScopus
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import concat
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class DetalleReferenciaScopusSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = DetalleReferenciaScopus
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
    get_referencias = DetalleReferenciaScopus.query.all()
    referencia_schema = DetalleReferenciaScopusSchema(many=True)
    referencias = referencia_schema.dump(get_referencias)
    return make_response(jsonify({"referencias": referencias}))

def verificacionReferencia():
    referencias = (db.session.query(ArticuloReferenciaScopus, DetalleReferenciaScopus)
        .join(DetalleReferenciaScopus.articulosReferencia)
        ).filter((ArticuloReferenciaScopus.reference.like(concat('%',DetalleReferenciaScopus.title,'%'))) & (ArticuloReferenciaScopus.reference.like(concat('%', DetalleReferenciaScopus.pub_year, '%')))).all()
    for referencia in referencias:
        ReferenciaCorrectaScopus(referencia.DetalleReferenciaScopus.id_articleRef , referencia.DetalleReferenciaScopus.id, referencia.DetalleReferenciaScopus.container_type, "null", referencia.DetalleReferenciaScopus.filled, referencia.DetalleReferenciaScopus.gsrank, referencia.DetalleReferenciaScopus.pub_url, referencia.DetalleReferenciaScopus.author_id, referencia.DetalleReferenciaScopus.num_citations, referencia.DetalleReferenciaScopus.url_scholarbib, referencia.DetalleReferenciaScopus.url_add_sclib, referencia.DetalleReferenciaScopus.citedby_url, referencia.DetalleReferenciaScopus.url_related_articles, referencia.DetalleReferenciaScopus.title, referencia.DetalleReferenciaScopus.author, referencia.DetalleReferenciaScopus.pub_year, referencia.DetalleReferenciaScopus.venue, referencia.DetalleReferenciaScopus.abstract).create()

    return make_response(jsonify({"Comparadas titulo de las referencias": "referencias"}))

def listarReferenciasNoEncontradas():
    subquery = (db.session.query(ArticuloReferenciaScopus, DetalleReferenciaScopus).with_entities(ArticuloReferenciaScopus.id)
        .join(DetalleReferenciaScopus.articulosReferencia))
    query = db.session.query(ArticuloReferenciaScopus).filter(ArticuloReferenciaScopus.id.notin_(subquery))
    referencias = query.all()
    for referencia in referencias:
        ReferenciasNoEncontradas(referencia.id,referencia.id_article_pwh, referencia.id_article, referencia.reference).create()
    return make_response(jsonify({"Listando referencias no encontradas": "referencias"}))

def listarReferenciasErroneasEncontradas():
    subquery = (db.session.query(DetalleReferenciaScopus, ReferenciaCompleta).with_entities(DetalleReferenciaScopus.id_articleRef)
        .join(ReferenciaCompleta, DetalleReferenciaScopus.id_articleRef == ReferenciaCompleta.id_articleRef))
    query = db.session.query(DetalleReferenciaScopus, ArticuloReferenciaScopus).filter(DetalleReferenciaScopus.id_articleRef.notin_(subquery)).filter((ArticuloReferenciaScopus.id == DetalleReferenciaScopus.id_articleRef))
    referencias = query.all()
    for referencia in referencias:
        ReferenciasErroneas(referencia.ArticuloReferenciaScopus.id, referencia.ArticuloReferenciaScopus.id_article_pwh, referencia.ArticuloReferenciaScopus.id_article, referencia.ArticuloReferenciaScopus.reference).create()
    return make_response(jsonify({"Referencias erroneas": "referencias"}))