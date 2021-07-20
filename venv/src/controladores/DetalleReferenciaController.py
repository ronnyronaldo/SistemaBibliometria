from modelos.DetalleReferencia import DetalleReferencia 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class DetalleReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = DetalleReferencia
        sqla_session = db.session
    id_detalle_referencia = fields.Number(dump_only=True)
    id_referencia = fields.Number(dump_only=True)
    container_type = fields.String(required=True)
    source = fields.String(required=True)
    filled = fields.String(required=True)
    gsrank = fields.String(required=True)
    pub_url =  fields.String(required=True)
    author_id =  fields.String(required=True)
    num_citations = fields.Number(dump_only=True)
    url_scholarbib = fields.String(required=True)
    url_add_sclib = fields.String(required=True)
    citedby_url = fields.String(required=True)
    url_related_articles = fields.String(required=True)
    title = fields.String(required=True)
    author = fields.String(required=True)
    pub_year = fields.Number(dump_only=True)
    venue = fields.String(required=True)
    abstract = fields.String(required=True)

def listaDetalleReferencia():
    get_detalle_referencia = DetalleReferencia.query.all()
    detalle_referencia_schema = DetalleReferenciaSchema(many=True)
    detalles_referencia = detalle_referencia_schema.dump(get_detalle_referencia)
    return make_response(jsonify(detalles_referencia))

