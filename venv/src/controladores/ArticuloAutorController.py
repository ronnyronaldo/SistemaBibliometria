from modelos.ArticuloAutor import ArticuloAutor
from modelos.Articulo import Articulo
from modelos.Autor import Autor
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from controladores.BaseDatosDigitalController import validarBaseDatosDigitalPorNombre 
from controladores.ArticuloController import obtenerIdArticuloIngresarAutor
from controladores.AutorController import buscaAutorPorId

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
    articuloAutorRespuesta = (db.session.query(ArticuloAutor, Autor)
        .with_entities(ArticuloAutor.id_articulo_autor, ArticuloAutor.orden_autor, Autor.nombre)
        .join(Autor, ArticuloAutor.id_autor == Autor.id_autor)).all()
    articuloAutores = []
    for articuloAutor in articuloAutorRespuesta:
        articuloAutores.append(dict(articuloAutor)) # Serializo cada fila
    return make_response(jsonify(articuloAutores))

def eliminarArticuloAutor(id_articulo_autor):
    articuloAutor = ArticuloAutor.query.get(id_articulo_autor)
    ArticuloAutor.delete(articuloAutor)
    return make_response(jsonify({"respuesta": {"valor":"Articulo eliminado correctamente del autor seleccionado.", "error":"False"}}))

def insertarAutor(nuevosAutores):
    mensajesRespuesta = []
    for nuevoAutor in nuevosAutores:
        id_autor = nuevoAutor['autor_identificación'][1:]
        nombre_autor = nuevoAutor['nombres']
        resultado_base_datos_digital = validarBaseDatosDigitalPorNombre(nuevoAutor['nombre'])
        base_datos_digital = resultado_base_datos_digital.json['base_datos_digital']
        numeroBaseDatosDigital = len(base_datos_digital)
        if numeroBaseDatosDigital == 1:
            id_base_datos_digital = base_datos_digital[0]['id_base_datos_digital']
            articulo = obtenerIdArticuloIngresarAutor(nuevoAutor['titulo'], nuevoAutor['anio_publicacion'], id_base_datos_digital)
            numeroArticulo = len(articulo)
            if numeroArticulo == 1:
                id_articulo = articulo[0]['id_articulo']
                get_articulo_autor = ArticuloAutor.query.filter((ArticuloAutor.id_articulo == id_articulo) & (ArticuloAutor.id_autor == id_autor) & (ArticuloAutor.orden_autor == nuevoAutor['orden_autor']))
                articulo_autor_schema = ArticuloAutorSchema(many=True)
                articulo_autor = articulo_autor_schema.dump(get_articulo_autor)
                numeroArticuloAutor = len(articulo_autor)
                if numeroArticuloAutor == 0:
                    resultado_autor = buscaAutorPorId(id_autor)
                    autores = resultado_autor.json['autor']
                    numero_autores = len(autores)
                    if numero_autores == 1:
                        ArticuloAutor(id_articulo, id_autor, nuevoAutor['orden_autor']).create()
                        mensaje = {
                            "error": "True",
                            "mensaje": "Articulo del autor ingresado correctamente."
                        }
                        mensajesRespuesta.append(mensaje)
                    else:
                        try:
                            Autor(id_autor, nombre_autor).create() # Ingreso primero el autor
                            ArticuloAutor(id_articulo, id_autor, nuevoAutor['orden_autor']).create()
                            mensaje = {
                                "error": "True",
                                "mensaje": "Articulo del autor ingresado correctamente."
                            }
                            mensajesRespuesta.append(mensaje)
                        except:
                            mensaje = {
                                "error": "True",
                                "mensaje": "Hubo un problema al registrar el autor" + "("+id_autor +","+ nombre_autor+")"
                            }
                            mensajesRespuesta.append(mensaje)
                            pass
                else:
                    mensaje = {
                        "error": "True",
                        "mensaje": "El autor correspondiente a la publicacion ya esta ingresado."
                    }
                    mensajesRespuesta.append(mensaje)
            else:
                mensaje = {
                    "error": "True",
                    "mensaje": "No se ha encontrado la publicacion del autor a ingresar."
                }
                mensajesRespuesta.append(mensaje)
        else:
            mensaje = {
                "error": "True",
                "mensaje": "No se ha encontrado la base de datos digital correspondiente a la publicacion del autor a ingresar."
            }
            mensajesRespuesta.append(mensaje)
           
    return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"False"}}))
    

