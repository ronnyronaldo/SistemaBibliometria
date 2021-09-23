from modelos.MedioPublicacionPublicacion import MedioPublicacionPublicacion
from modelos.MedioPublicacion import MedioPublicacion
from modelos.Articulo import Articulo
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func

db = SQLAlchemy()

class MedioPublicacionPublicacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = MedioPublicacionPublicacion
        sqla_session = db.session
    id_medio_publicacion = fields.Number(dump_only=True)
    nombre = fields.String(required=True)
    numero_citas = fields.Number(required=True)


def listaMedioPublicacionPublicacion():
    get_medio_publicacion_publicacion = MedioPublicacionPublicacion.query.all()
    medio_publicacion_publicacion_schema = MedioPublicacionPublicacionSchema(many=True)
    medios_publicacion_publicacion = medio_publicacion_publicacion_schema.dump(get_medio_publicacion_publicacion)
    return make_response(jsonify({"mediosPublicacionPublicacion": medios_publicacion_publicacion}))

def conteoMediosPublicacionPublicacion():
    # Eliminamos todos los medios de publicación publicación para cargar de nuevo en el caso de que haya habido cambios
    eliminarMediosPublicacionPublicacion()

    # Cargo los datos de los medios de publicación publicación
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    for detalleReferencia in referenciaRespuesta:
        MedioPublicacionPublicacion(detalleReferencia[3], detalleReferencia[1]).create()
    return make_response(jsonify({"error": "False"}))

def eliminarMediosPublicacionPublicacion():
    try:
        num_rows_deleted = db.session.query(MedioPublicacionPublicacion).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))




