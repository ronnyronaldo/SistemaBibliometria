from modelos.Autor import Autor
from modelos.Articulo import Articulo
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from controladores.BaseDatosDigitalController import validarBaseDatosDigitalPorNombre 
from controladores.ArticuloController import obtenerIdArticuloIngresarAutor

db = SQLAlchemy()

class AutorSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Autor
        sqla_session = db.session
    id_autor = fields.Number(dump_only=True)
    id_articulo = fields.Number(required=True)
    identificacion = fields.String(required=True)
    orden_autor = fields.Number(required=True)
    nombre = fields.String(required=True)

def listaAutores():
    autoresRespuesta = (db.session.query(Autor, Articulo)
        .with_entities(Articulo.titulo, Autor.identificacion, Autor.nombre, Autor.id_autor)
        .join(Articulo, Articulo.id_articulo == Autor.id_articulo)).all()
    autores = []
    for autor in autoresRespuesta:
        autores.append(dict(autor)) # Serializo cada fila
    return make_response(jsonify({"autor": autores}))

def eliminarAutores(id_autor):
    autor = Autor.query.get(id_autor)
    Autor.delete(autor)
    return make_response(jsonify({"respuesta": {"valor":"Autor eliminado correctamente.", "error":"False"}}))

def insertarAutor(nuevosAutores):
    for nuevoAutor in nuevosAutores:
        resultado_base_datos_digital = validarBaseDatosDigitalPorNombre(nuevoAutor['nombre'])
        base_datos_digital = resultado_base_datos_digital.json['base_datos_digital']
        numeroBaseDatosDigital = len(base_datos_digital)
        if numeroBaseDatosDigital == 1:
            id_base_datos_digital = base_datos_digital[0]['id_base_datos_digital']
            articulo = obtenerIdArticuloIngresarAutor(nuevoAutor['titulo'], nuevoAutor['anio_publicacion'], id_base_datos_digital)
            numeroArticulo = len(articulo)
            if numeroArticulo == 1:
                id_articulo = articulo[0]['id_articulo']
                get_autor = Autor.query.filter((Autor.id_articulo == id_articulo) & (Autor.identificacion == nuevoAutor['autor_identificación']) & (Autor.orden_autor == nuevoAutor['orden_autor']) & (Autor.nombre == nuevoAutor['nombres']))
                autor_schema = AutorSchema(many=True)
                autores = autor_schema.dump(get_autor)
                numeroAutores = len(autores)
                if numeroAutores == 0:
                    Autor(id_articulo, nuevoAutor['autor_identificación'], nuevoAutor['orden_autor'], nuevoAutor['nombres']).create()
                    print("Autor ingresado correctamente.")
                    #return make_response(jsonify({"respuesta": {"valor":"Autor ingresado correctamente.", "error":"False"}}))
                else:
                    print("El autor correspondiente a la publicacion ya esta ingresado.")
                    #return make_response(jsonify({"respuesta": {"valor":"El autor correspondiente a la publicacion ya esta ingresado.", "error":"True"}}))
            else:
                print("No se ha encontrado la publicacion del autor a ingresar.")
                #return make_response(jsonify({"respuesta": {"valor":"No se ha encontrado la publicacion del autor a ingresar.", "error":"True"}}))
        else:
            #return make_response(jsonify({"respuesta": {"valor":"No se ha encontrado la base de datos digital correspondiente a la publicacion del autor a ingresar.", "error":"True"}}))
            print("No se ha encontrado la base de datos digital correspondiente a la publicacion del autor a ingresar.")
    return make_response(jsonify({"respuesta": {"valor":"Ingresado autores correctamente.", "error":"False"}}))
    

