from sqlalchemy import func
from modelos.Parametro import Parametro
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()


class ParametroSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Parametro
        sqla_session = db.session
    id_parametro = fields.Number(dump_only=True)
    nombre = fields.String(required=True)
    valor = fields.Number(required=True)


def listarParametros():
    get_parametro = Parametro.query.all()
    parametro_schema = ParametroSchema(many=True)
    parametros = parametro_schema.dump(get_parametro)
    return make_response(jsonify(parametros))


def eliminarParametros(id_parametro):
    try:
        parametro = Parametro.query.get(id_parametro)
        Parametro.delete(parametro)
        return make_response(jsonify({"respuesta": {"valor":"Parametro eliminada correctamente.", "error":"False"}}))
    except:
        return make_response(jsonify({"respuesta": {"valor":"No se puede eliminar el parametro.", "error":"True"}}))

def actualizarParametros(parametro):
    param = Parametro.query.get_or_404(parametro['id_parametro'])
    param.nombre  = parametro['nombre']
    param.valor = parametro['valor']

    Parametro.create(param)
    return make_response(jsonify({"respuesta": {"valor":"Parametro actualizado correctamente.", "error":"False"}}))