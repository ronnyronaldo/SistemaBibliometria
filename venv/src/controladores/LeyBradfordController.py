from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from sqlalchemy import func
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from modelos.DetalleReferencia import DetalleReferencia 
from modelos.MedioPublicacion import MedioPublicacion 
from modelos.MedioPublicacionPublicacion import MedioPublicacionPublicacion
from modelos.MedioPublicacionCitacion import MedioPublicacionCitacion
from modelos.SJR import SJR
from modelos.Articulo import Articulo 
from modelos.Referencia import Referencia
from controladores.ParametrosController import buscarParametroPorCodigoParametro 

db = SQLAlchemy()

def listarDatosLeyBradford():
    pesoPublicacion = 0
    pesoCitacion = 0
    pesoSJR = 0
    try:
        pesoPublicacion = buscarParametroPorCodigoParametro('1').json['parametro'][0]['valor']
        pesoCitacion = buscarParametroPorCodigoParametro('2').json['parametro'][0]['valor']
        pesoSJR = buscarParametroPorCodigoParametro('5').json['parametro'][0]['valor']
    except:
        return make_response(jsonify({"respuesta": {"valor":"Error al recuperar los pesos.", "error":"True"}}))

    datosLeyBradfordRespuesta = (db.session.query(MedioPublicacionPublicacion, MedioPublicacionCitacion, SJR)
        .with_entities(MedioPublicacionPublicacion.nombre, MedioPublicacionPublicacion.numero_publicaciones, MedioPublicacionCitacion.numero_citas, SJR.sjr)
        .join(MedioPublicacionCitacion, MedioPublicacionPublicacion.nombre == MedioPublicacionCitacion.nombre)
        .join(SJR, MedioPublicacionPublicacion.nombre == SJR.titulo)).all()
    datos = []
    for dato in datosLeyBradfordRespuesta:
        valor = {
            'nombre' : dato['nombre'],
            'numero_publicaciones': dato['numero_publicaciones'],
            'numero_citas': dato['numero_citas'],
            'sjr': dato['sjr'],
            'pesoPublicacion': pesoPublicacion,
            'pesoCitacion': pesoCitacion,
            'pesoSJR': pesoSJR
        }
        datos.append(dict(valor))
    return make_response(jsonify({"respuesta": {"valor":"Datos procesados exitosamente.", "error":"False"}, "datos": datos}))

# Medios de Publicacion de los autores de la Universidad de Cuenca
def numeroMediosPublicacionPropiasPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta))
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionPropias():
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionPropiasAreaFrascati(id_area_frascati):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .filter(Articulo.id_area_frascati == id_area_frascati)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionPropiasAreaUnesco(id_area_unesco):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .filter(Articulo.id_area_unesco == id_area_unesco)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionPropiasAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta) & (Articulo.id_area_frascati == id_area_frascati))
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))


def numeroMediosPublicacionPropiasAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_, Articulo.id_articulo, MedioPublicacion.nombre)
    .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
    .filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta) & (Articulo.id_area_unesco == id_area_unesco))
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"medioPublicacion": detalleReferencia[3], "contador": detalleReferencia[1], "id_articulo": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

# Medios de Publicacion de las Referencias
def numeroMediosPublicacionReferenicasPorAnio(anio_publicacion_desde, anio_publicacion_hasta):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_, DetalleReferencia.id_referencia).filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionReferenicas():
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_, DetalleReferencia.id_referencia).filter((Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

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

def numeroMediosPublicacionReferenicasAreaFrascatiPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_frascati):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_ ,DetalleReferencia.id_referencia).filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta) & (Articulo.id_area_frascati == id_area_frascati) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))

def numeroMediosPublicacionReferenicasAreaUnescoPorAnio(anio_publicacion_desde, anio_publicacion_hasta, id_area_unesco):
    count_ = func.count('*')
    referenciaRespuesta = (db.session.query(DetalleReferencia.venue, count_,DetalleReferencia.id_referencia).filter((Articulo.anio_publicacion >= anio_publicacion_desde) & (Articulo.anio_publicacion <= anio_publicacion_hasta) & (Articulo.id_area_unesco == id_area_unesco) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia))
    .group_by(DetalleReferencia.venue)
    .order_by(count_.desc())).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        referencia = {"venue": detalleReferencia[0], "contador": detalleReferencia[1], "id_referencia": detalleReferencia[2]}
        detalleReferencias.append(dict(referencia)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detalleReferencias}))
