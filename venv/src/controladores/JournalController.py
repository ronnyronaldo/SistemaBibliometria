from modelos.Journal import Journal
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class JournalSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Journal
        sqla_session = db.session
    id_journal = fields.Number(dump_only=True)
    titulo = fields.String(required=True)
    id_base_datos_digital = fields.Number(required=True)



def listaJournal():
    get_journal = Journal.query.all()
    journal_schema = JournalSchema(many=True)
    journal = journal_schema.dump(get_journal)
    return make_response(jsonify({"journal": journal}))

def insertarJournal(registrosJournal):
    registrosJournal = registrosJournal['nuevasJournal']
    try: 
        for registro in registrosJournal:
           print(registro)
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




