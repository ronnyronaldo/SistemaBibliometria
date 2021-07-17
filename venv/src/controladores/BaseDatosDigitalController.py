from modelos.BaseDatosDigital import BaseDatosDigital
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class BaseDatosDigitalSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = BaseDatosDigital
        sqla_session = db.session
    id_base_datos_digital = fields.Number(dump_only=True)
    nombre_base_datos_digital = fields.String(required=True)
    proveedor = fields.String(required=True)
    costo_actual = fields.Number(required=True)
    suscripcion_descripcion = fields.String(required=True)
    area_servicio = fields.String(required=True)
    esUtilizadaEstudio = fields.String(required=True)

def listarBaseDatosDigital():
    get_base_datos_digital = BaseDatosDigital.query.all()
    base_datos_digital_schema = BaseDatosDigitalSchema(many=True)
    base_datos_digital = base_datos_digital_schema.dump(get_base_datos_digital)
    return make_response(jsonify({"base_datos_digital": base_datos_digital}))

def buscarBaseDatosDigitalPorId(id_base_datos_digital):
    get_base_datos_digital = BaseDatosDigital.query.filter(BaseDatosDigital.id_base_datos_digital == id_base_datos_digital)
    base_datos_digital_schema = BaseDatosDigitalSchema(many=True)
    base_datos_digital = base_datos_digital_schema.dump(get_base_datos_digital)
    return make_response(jsonify({"base_datos_digital": base_datos_digital}))

def validarBaseDatosDigitalPorNombre(nombre_base_datos_digital):
    get_base_datos_digital = BaseDatosDigital.query.filter((BaseDatosDigital.nombre_base_datos_digital == nombre_base_datos_digital) & (BaseDatosDigital.esUtilizadaEstudio == 1))
    base_datos_digital_schema = BaseDatosDigitalSchema(many=True)
    base_datos_digital = base_datos_digital_schema.dump(get_base_datos_digital)
    return make_response(jsonify({"base_datos_digital": base_datos_digital}))

def eliminarBaseDatosDigital(id_base_datos_digital):
    baseDatosDigital = BaseDatosDigital.query.get(id_base_datos_digital)
    BaseDatosDigital.delete(baseDatosDigital)
    return make_response(jsonify({"respuesta": {"valor":"Base de Datos Digital eliminada correctamente.", "error":"False"}}))

def insertarBaseDatosDigital(nuevoBaseDatosDigital):
    print(nuevoBaseDatosDigital['proveedor'])
    get_base_datos_digital = BaseDatosDigital.query.filter(BaseDatosDigital.nombre_base_datos_digital == nuevoBaseDatosDigital['nombre_base_datos_digital'])
    base_datos_digital_schema = BaseDatosDigitalSchema(many=True)
    base_datos_digital = base_datos_digital_schema.dump(get_base_datos_digital)
    numeroBaseDatosDigital = len(base_datos_digital)
    if numeroBaseDatosDigital == 0:
        BaseDatosDigital(nuevoBaseDatosDigital['nombre_base_datos_digital'],
                        nuevoBaseDatosDigital['proveedor'],
                        nuevoBaseDatosDigital['costo_actual'],
                        nuevoBaseDatosDigital['suscripcion_descripcion'],
                        nuevoBaseDatosDigital['area_servicio'],
                        nuevoBaseDatosDigital['esUtilizadaEstudio']).create()
        return make_response(jsonify({"respuesta": {"valor":"Base de Datos Digital ingresada correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La Base de Datos Digital ya esta registrada", "error":"True"}}))




