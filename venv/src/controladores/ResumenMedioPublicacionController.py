from modelos.ResumenMediosPublicacion import ResumenMediosPublicacion
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func

db = SQLAlchemy()

class ResumenMedioPublicacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ResumenMediosPublicacion
        sqla_session = db.session
    id_resumen = fields.Number(dump_only=True)
    id_medio_publicacion = fields.String(required=True)
    id_medio_citacion = fields.String(required=True)
    id_medio_busqueda = fields.String(required=True)
    id_medio_sjr = fields.String(required=True)

def eliminarResumenMediosPublicacion():
    try:
        num_rows_deleted = db.session.query(ResumenMediosPublicacion).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))












