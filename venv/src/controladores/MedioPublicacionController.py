from modelos.MedioPublicacion import MedioPublicacion
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class MedioPublicacionSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = MedioPublicacion
        sqla_session = db.session
    id_medio_publicacion = fields.Number(dump_only=True)
    nombre = fields.String(required=True)

def listaMedioPublicacion():
    get_medio_publicacion = MedioPublicacion.query.all()
    medio_publicacion_schema = MedioPublicacionSchema(many=True)
    medios_publicacion = medio_publicacion_schema.dump(get_medio_publicacion)
    return make_response(jsonify({"mediosPublicacion": medios_publicacion}))

def verificaMedioPublicacionPorNombre(nombre):
    get_medio_publicacion = MedioPublicacion.query.filter(MedioPublicacion.nombre == nombre)
    medio_publicacion_schema = MedioPublicacionSchema(many=True)
    medios_publicacion = medio_publicacion_schema.dump(get_medio_publicacion)
    return make_response(jsonify({"mediosPublicacion": medios_publicacion}))

def buscaMedioPublicacionPorId(id_medio_publicacion):
    get_medio_publicacion = MedioPublicacion.query.filter(MedioPublicacion.id_medio_publicacion == id_medio_publicacion)
    medio_publicacion_schema = MedioPublicacionSchema(many=True)
    medios_publicacion = medio_publicacion_schema.dump(get_medio_publicacion)
    return make_response(jsonify({"mediosPublicacion": medios_publicacion}))

def insertarMedioPublicacion(nuevoMedioPublicacion):
    get_medio_publicacion = MedioPublicacion.query.filter(MedioPublicacion.nombre == nuevoMedioPublicacion['nombre'])
    medio_publicacion_schema = MedioPublicacionSchema(many=True)
    medios_publicacion = medio_publicacion_schema.dump(get_medio_publicacion)
    numeroMedioPublicacion = len(medios_publicacion)
    if numeroMedioPublicacion == 0:
        MedioPublicacion(nuevoMedioPublicacion['nombre']).create()
        return make_response(jsonify({"respuesta": {"valor":"Medio de Publicación ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"El Medio de Publicación ya esta registrado", "error":"True"}}))

def eliminarMedioPublicacion(id_medio_publicacion):
    try:
        medioPublicacion = MedioPublicacion.query.get(id_medio_publicacion)
        MedioPublicacion.delete(medioPublicacion)
        return make_response(jsonify({"respuesta": {"valor":"Medio Publicación eliminada correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar el medio de publicacion ya que hay datos relacionados con la misma.", "error":"True"}}))

def actualizarMedioPublicacion(medioPublicacion):
    medio_publicacion = MedioPublicacion.query.get_or_404(medioPublicacion['id_medio_publicacion'])
    medio_publicacion.nombre = medioPublicacion['nombre']
    MedioPublicacion.create(medio_publicacion)
    return make_response(jsonify({"respuesta": {"valor":"Medio Publicacion actualizado correctamente.", "error":"False"}}))



