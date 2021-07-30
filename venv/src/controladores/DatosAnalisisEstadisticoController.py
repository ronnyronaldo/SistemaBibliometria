from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from sqlalchemy import func
from modelos.Articulo import Articulo 
from controladores.AreaFrascatiController import buscarAreaFrascatiPorId
from controladores.AreaUnescoController import buscarAreaUnescoPorId
from controladores.MedioPublicacionController import buscaMedioPublicacionPorId

db = SQLAlchemy()

def numeroPublicacionesAreaUnesco():
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_area_unesco, count_)
    .group_by(Articulo.id_area_unesco)
    .order_by(count_.desc())).all()
    detallePublicacionesAreaUnesco = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            areaUnescoRespuesta = buscarAreaUnescoPorId(articulo[0]).json['area_unesco']
            nombre_areaUnesco = areaUnescoRespuesta[0]['descripcion_unesco']
            publicacionAreaUnesco = {"nombre": nombre_areaUnesco, "id_area_unesco": articulo[0], "contador": articulo[1]}
            detallePublicacionesAreaUnesco.append(dict(publicacionAreaUnesco)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesAreaUnesco": detallePublicacionesAreaUnesco}))

def numeroPublicacionesAreaUnescoPorAnioPublicacion(anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_area_unesco, count_).filter(Articulo.anio_publicacion == anio_publicacion)
    .group_by(Articulo.id_area_unesco)
    .order_by(count_.desc())).all()
    detallePublicacionesAreaUnesco = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            areaUnescoRespuesta = buscarAreaUnescoPorId(articulo[0]).json['area_unesco']
            nombre_areaUnesco = areaUnescoRespuesta[0]['descripcion_unesco']
            publicacionAreaUnesco = {"nombre": nombre_areaUnesco, "id_area_unesco": articulo[0], "contador": articulo[1]}
            detallePublicacionesAreaUnesco.append(dict(publicacionAreaUnesco)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesAreaUnesco": detallePublicacionesAreaUnesco}))

def numeroPublicacionesAreaFrascati():
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_area_frascati, count_)
    .group_by(Articulo.id_area_frascati)
    .order_by(count_.desc())).all()
    detallePublicacionesAreaFrascati = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            areaFrascatiRespuesta = buscarAreaFrascatiPorId(articulo[0]).json['area_frascati']
            nombre_areaFrascati = areaFrascatiRespuesta[0]['descripcion']
            publicacionAreaFrascati = {"nombre": nombre_areaFrascati, "id_area_frascati": articulo[0], "contador": articulo[1]}
            detallePublicacionesAreaFrascati.append(dict(publicacionAreaFrascati)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesAreaFrascati": detallePublicacionesAreaFrascati}))

def numeroPublicacionesAreaFrascatiPorAnioPublicacion(anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_area_frascati, count_).filter(Articulo.anio_publicacion == anio_publicacion)
    .group_by(Articulo.id_area_frascati)
    .order_by(count_.desc())).all()
    detallePublicacionesAreaFrascati = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            areaFrascatiRespuesta = buscarAreaFrascatiPorId(articulo[0]).json['area_frascati']
            nombre_areaFrascati = areaFrascatiRespuesta[0]['descripcion']
            publicacionAreaFrascati = {"nombre": nombre_areaFrascati, "id_area_frascati": articulo[0], "contador": articulo[1]}
            detallePublicacionesAreaFrascati.append(dict(publicacionAreaFrascati)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesAreaFrascati": detallePublicacionesAreaFrascati}))

def numeroPublicacionesMediosPublicacion():
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detallePublicacionesMedioPublicacion = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            medioPublicacionRespuesta = buscaMedioPublicacionPorId(articulo[0]).json['mediosPublicacion']
            nombre_medio_publicacion = medioPublicacionRespuesta[0]['nombre']
            publicacionMedioPublicacion = {"nombre": nombre_medio_publicacion, "id_medio_publicacion": articulo[0], "contador": articulo[1]}
            detallePublicacionesMedioPublicacion.append(dict(publicacionMedioPublicacion)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detallePublicacionesMedioPublicacion}))

def numeroPublicacionesMediosPublicacionPorAreaUnesco(id_area_unesco):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_).filter(Articulo.id_area_unesco == id_area_unesco)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detallePublicacionesMedioPublicacion = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            medioPublicacionRespuesta = buscaMedioPublicacionPorId(articulo[0]).json['mediosPublicacion']
            nombre_medio_publicacion = medioPublicacionRespuesta[0]['nombre']
            publicacionMedioPublicacion = {"nombre": nombre_medio_publicacion, "id_medio_publicacion": articulo[0], "contador": articulo[1]}
            detallePublicacionesMedioPublicacion.append(dict(publicacionMedioPublicacion)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detallePublicacionesMedioPublicacion}))

def numeroPublicacionesMediosPublicacionPorAreaFrascati(id_area_frascati):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_).filter(Articulo.id_area_frascati == id_area_frascati)
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detallePublicacionesMedioPublicacion = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            medioPublicacionRespuesta = buscaMedioPublicacionPorId(articulo[0]).json['mediosPublicacion']
            nombre_medio_publicacion = medioPublicacionRespuesta[0]['nombre']
            publicacionMedioPublicacion = {"nombre": nombre_medio_publicacion, "id_medio_publicacion": articulo[0], "contador": articulo[1]}
            detallePublicacionesMedioPublicacion.append(dict(publicacionMedioPublicacion)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detallePublicacionesMedioPublicacion}))

def numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_).filter((Articulo.id_area_unesco == id_area_unesco) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detallePublicacionesMedioPublicacion = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            medioPublicacionRespuesta = buscaMedioPublicacionPorId(articulo[0]).json['mediosPublicacion']
            nombre_medio_publicacion = medioPublicacionRespuesta[0]['nombre']
            publicacionMedioPublicacion = {"nombre": nombre_medio_publicacion, "id_medio_publicacion": articulo[0], "contador": articulo[1]}
            detallePublicacionesMedioPublicacion.append(dict(publicacionMedioPublicacion)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detallePublicacionesMedioPublicacion}))

def numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.id_medio_publicacion, count_).filter((Articulo.id_area_frascati == id_area_frascati) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.id_medio_publicacion)
    .order_by(count_.desc())).all()
    detallePublicacionesMedioPublicacion = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            medioPublicacionRespuesta = buscaMedioPublicacionPorId(articulo[0]).json['mediosPublicacion']
            nombre_medio_publicacion = medioPublicacionRespuesta[0]['nombre']
            publicacionMedioPublicacion = {"nombre": nombre_medio_publicacion, "id_medio_publicacion": articulo[0], "contador": articulo[1]}
            detallePublicacionesMedioPublicacion.append(dict(publicacionMedioPublicacion)) # Serializo cada fila
    return make_response(jsonify({"numeroMediosPublicacion": detallePublicacionesMedioPublicacion}))

def numeroPublicacionesQuartil():
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.cuartil, count_)
    .group_by(Articulo.cuartil)
    .order_by(count_.desc())).all()

    detallePublicacionesCuartil = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionCuartil = {"cuartil": articulo[0], "contador": articulo[1]}
            detallePublicacionesCuartil.append(dict(publicacionCuartil)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesCuartil": detallePublicacionesCuartil}))

def numeroPublicacionesQuartilPorAreaUnesco(id_area_unesco):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.cuartil, count_).filter(Articulo.id_area_unesco == id_area_unesco)
    .group_by(Articulo.cuartil)
    .order_by(count_.desc())).all()
    
    detallePublicacionesCuartil = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionCuartil = {"cuartil": articulo[0], "contador": articulo[1]}
            detallePublicacionesCuartil.append(dict(publicacionCuartil)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesCuartil": detallePublicacionesCuartil}))

def numeroPublicacionesQuartilPorAreaFrascati(id_area_frascati):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.cuartil, count_).filter(Articulo.id_area_frascati == id_area_frascati)
    .group_by(Articulo.cuartil)
    .order_by(count_.desc())).all()
    
    detallePublicacionesCuartil = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionCuartil = {"cuartil": articulo[0], "contador": articulo[1]}
            detallePublicacionesCuartil.append(dict(publicacionCuartil)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesCuartil": detallePublicacionesCuartil}))

def numeroPublicacionesQuartilPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.cuartil, count_).filter((Articulo.id_area_unesco == id_area_unesco) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.cuartil)
    .order_by(count_.desc())).all()
    
    detallePublicacionesCuartil = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionCuartil = {"cuartil": articulo[0], "contador": articulo[1]}
            detallePublicacionesCuartil.append(dict(publicacionCuartil)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesCuartil": detallePublicacionesCuartil}))

def numeroPublicacionesQuartilPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.cuartil, count_).filter((Articulo.id_area_frascati == id_area_frascati) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.cuartil)
    .order_by(count_.desc())).all()
    
    detallePublicacionesCuartil = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionCuartil = {"cuartil": articulo[0], "contador": articulo[1]}
            detallePublicacionesCuartil.append(dict(publicacionCuartil)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesCuartil": detallePublicacionesCuartil}))

def numeroPublicacionesFactorImpacto():
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.factor_impacto, count_)
    .group_by(Articulo.factor_impacto)
    .order_by(count_.desc())).all()

    detallePublicacionesFactorImpacto = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionFactorImpacto = {"factor_impacto": articulo[0], "contador": articulo[1]}
            detallePublicacionesFactorImpacto.append(dict(publicacionFactorImpacto)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesFactorImpacto": detallePublicacionesFactorImpacto}))

def numeroPublicacionesFactorImpactoPorAreaUnesco(id_area_unesco):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.factor_impacto, count_).filter(Articulo.id_area_unesco == id_area_unesco)
    .group_by(Articulo.factor_impacto)
    .order_by(count_.desc())).all()

    detallePublicacionesFactorImpacto = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionFactorImpacto = {"factor_impacto": articulo[0], "contador": articulo[1]}
            detallePublicacionesFactorImpacto.append(dict(publicacionFactorImpacto)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesFactorImpacto": detallePublicacionesFactorImpacto}))

def numeroPublicacionesFactorImpactoPorAreaUnescoPorAnio(id_area_unesco, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.factor_impacto, count_).filter((Articulo.id_area_unesco == id_area_unesco) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.factor_impacto)
    .order_by(count_.desc())).all()

    detallePublicacionesFactorImpacto = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionFactorImpacto = {"factor_impacto": articulo[0], "contador": articulo[1]}
            detallePublicacionesFactorImpacto.append(dict(publicacionFactorImpacto)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesFactorImpacto": detallePublicacionesFactorImpacto}))

def numeroPublicacionesFactorImpactoPorAreaFrascati(id_area_frascati):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.factor_impacto, count_).filter(Articulo.id_area_frascati == id_area_frascati)
    .group_by(Articulo.factor_impacto)
    .order_by(count_.desc())).all()

    detallePublicacionesFactorImpacto = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionFactorImpacto = {"factor_impacto": articulo[0], "contador": articulo[1]}
            detallePublicacionesFactorImpacto.append(dict(publicacionFactorImpacto)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesFactorImpacto": detallePublicacionesFactorImpacto}))

def numeroPublicacionesFactorImpactoPorAreaFrascatiPorAnio(id_area_frascati, anio_publicacion):
    count_ = func.count('*')
    articuloRespuesta = (db.session.query(Articulo.factor_impacto, count_).filter((Articulo.id_area_frascati == id_area_frascati) & (Articulo.anio_publicacion == anio_publicacion))
    .group_by(Articulo.factor_impacto)
    .order_by(count_.desc())).all()

    detallePublicacionesFactorImpacto = []
    if len(articuloRespuesta) != 0:
        for articulo in articuloRespuesta:
            publicacionFactorImpacto = {"factor_impacto": articulo[0], "contador": articulo[1]}
            detallePublicacionesFactorImpacto.append(dict(publicacionFactorImpacto)) # Serializo cada fila
    return make_response(jsonify({"numeroPublicacionesFactorImpacto": detallePublicacionesFactorImpacto}))






