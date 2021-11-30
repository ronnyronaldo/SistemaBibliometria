from modelos.SJR import SJR
from controladores.CategoriasSJRController import insertar, buscarCategoriaPorNombre
from controladores.CategoriaJournalSJRController import insertarCategoriaJournalSJR
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

# Coincidencia con los nombres de los medios de publicacion
def matchMediosPublicacionSJR(nombre):
    get_medio_publicacion_sjr = SJR.query.filter(SJR.titulo.match(nombre))
    medio_publicacion_sjr_schema = SJRSchema(many=True)
    medios_publicacion_sjr = medio_publicacion_sjr_schema.dump(get_medio_publicacion_sjr)
    return make_response(jsonify({"mediosPublicacionSJR": medios_publicacion_sjr}))

def listaSJR():
    get_sjr = SJR.query.all()
    sjr_schema = SJRSchema(many=True)
    sjr = sjr_schema.dump(get_sjr)
    return make_response(jsonify({"sjr": sjr}))

def listaSJRPorId(id_sjr):
    get_sjr = SJR.query.filter(SJR.id_sjr == id_sjr)
    sjr_schema = SJRSchema(many=True)
    sjr = sjr_schema.dump(get_sjr)
    return sjr

# Coincidencia con los nombres de los medios de publicacion SJR
def matchSJR(nombre):
    get_sjr = SJR.query.filter(SJR.titulo.match(nombre))
    sjr_schema = SJRSchema(many=True)
    sjr = sjr_schema .dump(get_sjr)
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
            SJR(Rank, Sourceid, Title, Type, Issn, valorSJR, Quartil).create()
            journal = buscarJournalSJR(Rank, Sourceid, Title, Type, Issn, Quartil)
            id_journal = journal[0]['id_sjr']
            for categoria in categoriasList: 
                nombreCategoria = categoria.lstrip()
                categoria = buscarCategoriaPorNombre(nombreCategoria)
                id_categoria = categoria[0]['id_categoria']
                #insertar(nombreCategoria) // Cuando es nuevo ingreso se le ingresan las categorias
                insertarCategoriaJournalSJR(id_categoria, id_journal) #Relacionamos al journal con la categoria
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

def buscarJournalSJR(Rank, Sourceid, Title, Type, Issn, Quartil):
    get_journal_sjr = SJR.query.filter((SJR.rank == Rank) & (SJR.id_recurso == Sourceid)&(SJR.titulo == Title)&(SJR.tipo == Type)&(SJR.isnn == Issn)&(SJR.quartil == Quartil))
    journal_sjr_schema = SJRSchema(many=True)
    journal_sjr = journal_sjr_schema.dump(get_journal_sjr)
    return journal_sjr



