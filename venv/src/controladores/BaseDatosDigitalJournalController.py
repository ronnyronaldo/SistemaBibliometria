from modelos.BaseDatosDigitalJournal import BaseDatosDigitalJournal 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class BaseDatosDigitalJournalSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = BaseDatosDigitalJournal
        sqla_session = db.session

    id_base_datos_digital_journal = fields.Number(dump_only=True)
    id_base_datos_digital = fields.Number(required=True)
    id_journal = fields.Number(required=True)

def existeRelacion(id_base_datos_digital, id_journal):
    get_bd_journal = BaseDatosDigitalJournal.query.filter((BaseDatosDigitalJournal.id_base_datos_digital == id_base_datos_digital) & (BaseDatosDigitalJournal.id_journal == id_journal))
    bd_journal_schema = BaseDatosDigitalJournalSchema(many=True)
    bd_journal = bd_journal_schema.dump(get_bd_journal)
    return bd_journal





