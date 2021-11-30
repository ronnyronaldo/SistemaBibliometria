from modelos.MedioPublicacionBusqueda import MedioPublicacionBusqueda
from modelos.EstadisticasJournal import EstadisticasJournal
from modelos.Journal import Journal
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func

db = SQLAlchemy()

class MedioPublicacionBusquedaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = MedioPublicacionBusqueda
        sqla_session = db.session
    id_medio_publicacion = fields.Number(dump_only=True)
    nombre = fields.String(required=True)
    numero_busquedas = fields.Number(required=True)
    estado = fields.String(required=True)

# Coincidencia con los nombres de los medios de publicacion
def matchMediosPublicacionBusqueda(nombre):
    get_medio_publicacion_busqueda = MedioPublicacionBusqueda.query.filter(MedioPublicacionBusqueda.nombre.match(nombre))
    medio_publicacion_busqueda_schema = MedioPublicacionBusquedaSchema(many=True)
    medios_publicacion_busqueda = medio_publicacion_busqueda_schema.dump(get_medio_publicacion_busqueda)
    return make_response(jsonify({"mediosPublicacionBusqueda": medios_publicacion_busqueda}))

def listaMedioPublicacionBusqueda():
    #conteoMediosPublicacionPublicacion()
    get_medio_publicacion_busqueda = MedioPublicacionBusqueda.query.all()
    medio_publicacion_busqueda_schema = MedioPublicacionBusquedaSchema(many=True)
    medios_publicacion_busqueda = medio_publicacion_busqueda_schema.dump(get_medio_publicacion_busqueda)
    return make_response(jsonify({"mediosPublicacionBusqueda": medios_publicacion_busqueda}))

def listaMedioPublicacionBusquedaPorId(id_medio_publicacion):
    get_medio_publicacion_busqueda = MedioPublicacionBusqueda.query.filter(MedioPublicacionBusqueda.id_medio_publicacion == id_medio_publicacion)
    medio_publicacion_busqueda_schema = MedioPublicacionBusquedaSchema(many=True)
    medios_publicacion_busqueda = medio_publicacion_busqueda_schema.dump(get_medio_publicacion_busqueda)
    return medios_publicacion_busqueda

def eliminarMediosPublicacionBusqueda():
    try:
        num_rows_deleted = db.session.query(MedioPublicacionBusqueda).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))

def conteoMediosPublicacionBusqueda():
    # Eliminamos todos los medios de publicación publicación para cargar de nuevo en el caso de que haya habido cambios
    eliminarMediosPublicacionBusqueda()

    # Cargo los datos de los medios de publicación busqueda
    referenciaRespuesta = (db.session.query(EstadisticasJournal.id_journal, func.sum(EstadisticasJournal.numero_busquedas), Journal.titulo)
    .join(Journal, EstadisticasJournal.id_journal == Journal.id_journal)
    .group_by(EstadisticasJournal.id_journal)
    .order_by(func.sum(EstadisticasJournal.numero_busquedas).desc())).all()
    for detalleReferencia in referenciaRespuesta:
        MedioPublicacionBusqueda(detalleReferencia[2], detalleReferencia[1], 0).create()
    return make_response(jsonify({"error": "False"}))



def conteoMediosPublicacionBusquedaPorAnio(anio_desde, anio_hasta):
    # Eliminamos todos los medios de publicación busqueda para cargar de nuevo en el caso de que haya habido cambios
    eliminarMediosPublicacionBusqueda()

    # Cargo los datos de los medios de publicación busqueda
    referenciaRespuesta = (db.session.query(EstadisticasJournal.id_journal, func.sum(EstadisticasJournal.numero_busquedas), Journal.titulo)
    .join(Journal, EstadisticasJournal.id_journal == Journal.id_journal)
    .filter((EstadisticasJournal.año >= anio_desde) & (EstadisticasJournal.año <= anio_hasta))
    .group_by(EstadisticasJournal.id_journal)
    .order_by(func.sum(EstadisticasJournal.numero_busquedas).desc())).all()
    for detalleReferencia in referenciaRespuesta:
        MedioPublicacionBusqueda(detalleReferencia[2], detalleReferencia[1], 0).create()
    return make_response(jsonify({"error": "False"}))

def actualizarMedioPublicacionBusqueda(idMedioPublicacion, estado):
    medioPublicacion = MedioPublicacionBusqueda.query.get_or_404(idMedioPublicacion)
    medioPublicacion.estado  = estado
    MedioPublicacionBusqueda.create(medioPublicacion)

def listaMedioPublicacionBusquedaEstado():
    get_medio_publicacion_busqueda = MedioPublicacionBusqueda.query.filter(MedioPublicacionBusqueda.estado == '0')
    medio_publicacion_busqueda_schema = MedioPublicacionBusquedaSchema(many=True)
    medios_publicacion_busqueda = medio_publicacion_busqueda_schema.dump(get_medio_publicacion_busqueda)
    return make_response(jsonify({"mediosPublicacionBusqueda": medios_publicacion_busqueda}))












