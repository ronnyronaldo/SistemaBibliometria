from modelos.MedioPublicacionCitacion import MedioPublicacionCitacion
from modelos.DetalleReferencia import DetalleReferencia
from modelos.Articulo import Articulo
from modelos.Referencia import Referencia
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func

db = SQLAlchemy()

class MedioPublicacionCitacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = MedioPublicacionCitacion
        sqla_session = db.session
    id_medio_publicacion = fields.Number(dump_only=True)
    nombre = fields.String(required=True)
    numero_citas = fields.Number(required=True)


def listaMedioPublicacionCitacion():
    #conteoMediosPublicacionCitacion()

    get_medio_publicacion_citacion = MedioPublicacionCitacion.query.all()
    medio_publicacion_citacion_schema = MedioPublicacionCitacionSchema(many=True)
    medios_publicacion_citacion = medio_publicacion_citacion_schema.dump(get_medio_publicacion_citacion)
    return make_response(jsonify({"mediosPublicacionCitacion": medios_publicacion_citacion}))

def conteoMediosPublicacionCitacion():
    # Eliminamos todos los medios de publicación citación para cargar de nuevo en el caso de que haya habido cambios
    eliminarMediosPublicacionCitacion()

    # Cargo los datos de los medios de publicación citación
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_, DetalleReferencia.id_referencia).filter((Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()

    for detalleReferencia in referenciaRespuesta:
        MedioPublicacionCitacion(detalleReferencia[0], detalleReferencia[1]).create()
    return make_response(jsonify({"error": "False"}))

def eliminarMediosPublicacionCitacion():
    try:
        num_rows_deleted = db.session.query(MedioPublicacionCitacion).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))




