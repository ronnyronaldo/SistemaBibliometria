from modelos.SJR import SJR
from controladores.CategoriasSJRController import insertar
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class SJRSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = SJR
        sqla_session = db.session
    id_sjr = fields.Number(dump_only=True)
    rank = fields.Number(required=True)
    id_recurso = fields.String(required=True)
    titulo = fields.String(required=True)
    tipo = fields.String(required=True)
    isnn = fields.String(required=True)
    sjr = fields.Number(required=True)
    quartil = fields.String(required=True)


def listaSJR():
    get_sjr = SJR.query.all()
    sjr_schema = SJRSchema(many=True)
    sjr = sjr_schema.dump(get_sjr)
    return make_response(jsonify({"sjr": sjr}))

def insertarSJR(registrosNuevosSJR):
    eliminarDatosSJR()
    registrosSJR = registrosNuevosSJR['nuevasSJR']
    try: 
        for registro in registrosSJR:
            Rank = extraerDatosNumber(registro, 'Rank')
            Sourceid = extraerDatosString(registro, 'Sourceid')
            Title = extraerDatosString(registro, 'Title')
            Type = extraerDatosString(registro, 'Type')
            Issn = extraerDatosString(registro, 'Issn')
            valorSJR = extraerDatosNumber(registro, 'SJR')
            Quartil = extraerDatosString(registro, 'SJR Best Quartile')  
            Categorias =  extraerDatosString(registro, 'Categories')    
            categoriasList = Categorias.split(';')
            for categoria in categoriasList:
                nombreCategoria = categoria.lstrip()
                insertar(nombreCategoria)
            SJR(Rank, Sourceid, Title, Type, Issn, valorSJR, Quartil).create()
    except Exception as e:   
        return make_response(jsonify({"error":"True"}))
    return make_response(jsonify({"error":"False"}))

def extraerDatosString(registroSJR, campo):
    try:
        return registroSJR[campo]
    except:
        return ""

def extraerDatosNumber(registroSJR, campo):
    try:
        return registroSJR[campo]
    except:
        return 0

def eliminarDatosSJR():
    try:
        num_rows_deleted = db.session.query(SJR).delete()
        db.session.commit()
    except:
        db.session.rollback()
    return make_response(jsonify({"error": "False"}))


