from modelos.Referencia import Referencia
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Referencia
        sqla_session = db.session
    id_referencia = fields.Number(dump_only=True)
    id_articulo = fields.Number(required=True)
    referencia = fields.String(required=True)

def listaReferenciasPorIdArticulo(id_articulo):
    get_referencias = Referencia.query.filter(Referencia.id_articulo == id_articulo)
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    db.session.remove()
    return make_response(jsonify({"referencias": referencias}))
