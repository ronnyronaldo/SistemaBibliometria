from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from sqlalchemy import func
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from modelos.DetalleReferencia import DetalleReferencia 
from modelos.Articulo import Articulo 
from modelos.Referencia import Referencia 

db = SQLAlchemy()

def numeroMediosPublicacionReferenicasAreaFrascati(id_area_frascati):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_, DetalleReferencia.id_referencia).filter((Articulo.id_area_frascati == id_area_frascati) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionReferenicasAreaUnesco(id_area_unesco):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_, DetalleReferencia.id_referencia).filter((Articulo.id_area_unesco == id_area_unesco) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionReferenicasAreaFrascatiPorAnio(anio_publicacion, id_area_frascati):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_ ,DetalleReferencia.id_referencia).filter((Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_area_frascati == id_area_frascati) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionReferenicasAreaUnescoPorAnio(anio_publicacion, id_area_unesco):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_,DetalleReferencia.id_referencia).filter((Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_area_unesco == id_area_unesco) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))
