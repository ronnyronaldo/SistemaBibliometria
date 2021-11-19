from modelos.Journal import Journal
from modelos.BaseDatosDigitalJournal import BaseDatosDigitalJournal
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from controladores.BaseDatosDigitalJournalController import existeRelacion

db = SQLAlchemy()

class JournalSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Journal
        sqla_session = db.session
    id_journal = fields.Number(dump_only=True)
    titulo = fields.String(required=True)



def listaJournal():
    get_journal = Journal.query.all()
    journal_schema = JournalSchema(many=True)
    journal = journal_schema.dump(get_journal)
    return make_response(jsonify({"journal": journal}))

def insertarJournalScienceDirect(registrosJournal):
    mensajesRespuesta = []
    journals = registrosJournal['nuevasJournal']
    idBaseDatosDigital = registrosJournal['idBaseDatosDigital']
    id_journal = 0
    try: 
        for i in range(len(journals)):
            if(((i % 2) == 0) and i>0):
                nombreJournal = journals[i]['Title']
                journalRespuesta = encontrarPorNombre(nombreJournal)
                numeroJournal = len(journalRespuesta)
                if(numeroJournal == 0):
                    Journal(nombreJournal).create()
                    journalRespuesta = encontrarPorNombre(nombreJournal)
                    id_journal = journalRespuesta[0]['id_journal']
                else:
                    journalRespuesta = encontrarPorNombre(nombreJournal)
                    id_journal = journalRespuesta[0]['id_journal']

                bd_journal = existeRelacion(idBaseDatosDigital, id_journal)
                numero_bd_journal = len(bd_journal)
                if(numero_bd_journal == 0):
                    BaseDatosDigitalJournal(idBaseDatosDigital,id_journal).create()
                else:
                    mensaje = {
                        "error": "True",
                        "mensaje": "El journal "+ nombreJournal + " ya está asignada a la base de datos seleccionada"
                    }
                    mensajesRespuesta.append(mensaje)
    except Exception as e:   
        return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"True"}}))
    return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"False"}}))

def extraerDatosString(registroSJR, campo):
    try:
        return registroSJR[campo]
    except:
        return ""

def encontrarPorNombre(titulo):
    get_journal = Journal.query.filter(Journal.titulo == titulo)
    journal_schema = JournalSchema(many=True)
    journal = journal_schema.dump(get_journal)
    return journal

def extraerDatosNumber(registroSJR, campo):
    try:
        return registroSJR[campo]
    except:
        return 0




