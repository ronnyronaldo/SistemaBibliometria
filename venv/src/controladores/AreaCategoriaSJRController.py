from modelos.AreaCategoriaSJR import AreaCategoriaSJR
from modelos.AreaSJR import AreaSJR
from modelos.CategoriasSJR import CategoriasSJR
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AreaCategoriaSJRSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = AreaCategoriaSJR
        sqla_session = db.session
    id_area_categoria_sjr = fields.Number(dump_only=True)
    id_area_sjr = fields.Number(required=True)
    id_categoria_sjr = fields.Number(required=True)


def listaAreaCategoriaSJR(id_area):
    areaCategoriaRespuesta = (db.session.query(AreaCategoriaSJR, AreaSJR, CategoriasSJR).filter(AreaCategoriaSJR.id_area_sjr == id_area)
        .with_entities(AreaCategoriaSJR.id_area_categoria_sjr, AreaCategoriaSJR.id_area_sjr, AreaCategoriaSJR.id_categoria_sjr, AreaSJR.nombre.label('nombreArea'), CategoriasSJR.nombre.label('nombreCategoria'))
        .join(AreaSJR, AreaCategoriaSJR.id_area_sjr == AreaSJR.id_area_sjr)
        .join(CategoriasSJR, AreaCategoriaSJR.id_categoria_sjr == CategoriasSJR.id_categoria)).all()

    datos = []
    for dato in areaCategoriaRespuesta:
        datos.append(dict(dato)) # Serializo cada fila
    return make_response(jsonify({"datos": datos}))

def insertarAreaCategoriaSJR(nuevoAreaCategoriaSJR):
    print(nuevoAreaCategoriaSJR['id_area_sjr'])
    get_area_categoria_sjr = AreaCategoriaSJR.query.filter((AreaCategoriaSJR.id_area_sjr == int(nuevoAreaCategoriaSJR['id_area_sjr'])) & (AreaCategoriaSJR.id_categoria_sjr == int(nuevoAreaCategoriaSJR['id_categoria_sjr'])))
    area_categoria_sjr_schema = AreaCategoriaSJRSchema(many=True)
    area_categoria_sjr = area_categoria_sjr_schema.dump(get_area_categoria_sjr )
    numeroAreaCategoriaSJR = len(area_categoria_sjr)
    if numeroAreaCategoriaSJR  == 0:
        AreaCategoriaSJR(int(nuevoAreaCategoriaSJR['id_area_sjr']), int(nuevoAreaCategoriaSJR['id_categoria_sjr'])).create()
        return make_response(jsonify({"respuesta": {"valor":"Asignado la categoría al área correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La categoría ya esta registrado al área seleccionado", "error":"True"}}))

def eliminarAreaCategoriaSJR(id_area_categoria_sjr):
    try:
        areaCategoriaSJR = AreaCategoriaSJR.query.get(id_area_categoria_sjr)
        AreaCategoriaSJR.delete(areaCategoriaSJR)
        return make_response(jsonify({"respuesta": {"valor":"Eliminada la relación entre categoría y el área correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar la relación entre categoría y el área.", "error":"True"}}))


   
