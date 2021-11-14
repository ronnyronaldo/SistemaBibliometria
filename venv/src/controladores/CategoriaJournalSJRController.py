from modelos.CategoriaJournalSJR import CategoriaJournalSJR
from modelos.SJR import SJR
from modelos.CategoriasSJR import CategoriasSJR
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class CategoriaJournalSJRSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = CategoriaJournalSJR
        sqla_session = db.session
    id_categoria_journal_sjr = fields.Number(dump_only=True)
    id_categoria_sjr = fields.Number(required=True)
    id_journal_sjr = fields.Number(required=True)

def insertarCategoriaJournalSJR(id_categoria_sjr, id_journal_sjr):
    get_categoria_journal_sjr = CategoriaJournalSJR.query.filter((CategoriaJournalSJR.id_categoria_sjr == int(id_categoria_sjr)) & (CategoriaJournalSJR.id_journal_sjr == int(id_journal_sjr)))
    categoria_journal_sjr_schema = CategoriaJournalSJRSchema(many=True)
    categoria_journal_sjr = categoria_journal_sjr_schema.dump(get_categoria_journal_sjr)
    numeroCategoriaJournalSJR = len(categoria_journal_sjr)
    if numeroCategoriaJournalSJR  == 0:
        CategoriaJournalSJR(int(id_categoria_sjr), int(id_journal_sjr)).create()



   
