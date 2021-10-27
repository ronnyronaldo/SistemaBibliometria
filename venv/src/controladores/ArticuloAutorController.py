from modelos.ArticuloAutor import ArticuloAutor
from modelos.Articulo import Articulo
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from controladores.BaseDatosDigitalController import validarBaseDatosDigitalPorNombre 
from controladores.ArticuloController import obtenerIdArticuloIngresarAutor

db = SQLAlchemy()

class ArticuloAutorSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ArticuloAutor
        sqla_session = db.session
    id_articulo_autor = fields.Number(dump_only=True)
    id_articulo = fields.Number(required=True)
    id_autor = fields.String(required=True)
    orden_autor = fields.Number(required=True)

def listaArticulosPorIdAutor(id_autor):
    autoresRespuesta = (db.session.query(ArticuloAutor, Articulo).filter(ArticuloAutor.id_autor == id_autor)
        .with_entities(Articulo.titulo, ArticuloAutor.id_autor, ArticuloAutor.id_articulo_autor, Articulo.enlace_documento, Articulo.url_dspace)
        .join(Articulo, Articulo.id_articulo == ArticuloAutor.id_articulo)).all()
    autores = []
    for autor in autoresRespuesta:
        autores.append(dict(autor)) # Serializo cada fila
    return make_response(jsonify({"publicaciones": autores}))

# Listar autores para grafico en dashborad
def listaAutoresNumPub():
    get_articulo = Autor.query.all()
    autor_schema = AutorSchema(many=True)
    articulos = autor_schema.dump(get_articulo)
    return make_response(jsonify(articulos))


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
    

