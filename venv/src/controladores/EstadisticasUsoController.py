from modelos.EstadisticasUso import EstadisticasUso
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class EstadisticasUsoSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = EstadisticasUso
        sqla_session = db.session
    id_estadisticas_uso = fields.Number(dump_only=True)
    id_base_datos_digital = fields.Number(required=True)
    año = fields.Number(required=True)
    mes = fields.String(required=True)
    numero_busquedas = fields.Number(required=True)

def listarEstadisticasUso():
    get_estadisticas_uso = EstadisticasUso.query.all()
    estadisticas_uso_schema = EstadisticasUsoSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    return make_response(jsonify({"estadisticas_uso": estadisticas_uso}))

def buscarEstadisticasUsoPorId(id_base_datos_digital):
    get_estadisticas_uso = EstadisticasUso.query.filter(EstadisticasUso.id_base_datos_digital == id_base_datos_digital)
    estadisticas_uso_schema = EstadisticasUsoSchema(many=True)
    estadisticas_uso = estadisticas_uso_schema.dump(get_estadisticas_uso)
    return make_response(jsonify({"estadisticas_uso": estadisticas_uso}))
