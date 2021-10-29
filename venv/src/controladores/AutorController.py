from modelos.Autor import Autor
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class AutorSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Autor
        sqla_session = db.session
    id_autor = fields.String(required=True)
    nombre = fields.String(required=True)

def listaAutores():
    get_autor = Autor.query.all()
    autor_schema = AutorSchema(many=True)
    autor = autor_schema.dump(get_autor)
    return make_response(jsonify({"autor": autor}))

def buscaAutorPorId(id_autor):
    get_autor = Autor.query.filter(Autor.id_autor == id_autor)
    autor_schema = AutorSchema(many=True)
    autor = autor_schema.dump(get_autor)
    return make_response(jsonify({"autor": autor}))

def actualizarAutor(autorActualizar):
    autor = Autor.query.get_or_404(autorActualizar['id_autor'])
    autor.id_autor = autorActualizar['id_autor']
    autor.nombre = autorActualizar['nombre']
    Autor.create(autor)
    return make_response(jsonify({"respuesta": {"valor":"Autor actualizado correctamente.", "error":"False"}}))

