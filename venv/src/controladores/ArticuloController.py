from modelos.Articulo import Articulo
from modelos.BaseDatosDigital import BaseDatosDigital
from modelos.MedioPublicacion import MedioPublicacion
from modelos.AreaFrascati import AreaFrascati
from modelos.AreaUnesco import AreaUnesco 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ArticuloSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Articulo
        sqla_session = db.session
    id_articulo = fields.Number(dump_only=True)
    id_base_datos_digital = fields.Number(required=True)
    id_area_unesco = fields.Number(required=True)
    id_area_frascati = fields.Number(required=True)
    id_medio_publicacion = fields.Number(required=True)
    url_dspace = fields.String(required=True)
    titulo = fields.String(required=True)
    titulo_alternativo = fields.String(required=True)
    palabras_clave = fields.String(required=True)
    abstract = fields.String(required=True)
    resumen = fields.String(required=True)
    nombre_area_frascati_amplio = fields.String(required=True)
    nombre_area_unesco_amplio = fields.String(required=True)
    tipo_publicacion = fields.String(required=True)
    anio_publicacion = fields.Number(required=True)
    link_revista = fields.String(required=True)
    doi = fields.String(required=True)
    estado_publicacion = fields.String(required=True)
    enlace_documento = fields.String(required=True)
    factor_impacto = fields.String(required=True)
    cuartil = fields.String(required=True)
    autor_identificación = fields.String(required=True)
    orden_autor = fields.Number(required=True)
    nombres = fields.String(required=True)
    nombre_afiliacion = fields.String(required=True)
    nombre_medio_publicacion = fields.String(required=True)
    nombre_area_frascati_especifico = fields.String(required=True)
    nombre_area_unesco_especifico = fields.String(required=True)

def buscarArticuloPorId(id_articulo):
    get_articulo = Articulo.query.filter(Articulo.id_articulo == id_articulo)
    articulo_schema = ArticuloSchema(many=True)
    articulo = articulo_schema.dump(get_articulo)
    return make_response(jsonify({"articulo": articulo}))

def obtenerIdArticuloIngresarAutor(titulo, titulo_alternatiivo, anio_publicacion, id_base_datos_digital):
    get_articulo = Articulo.query.filter((Articulo.titulo == titulo) & (Articulo.titulo_alternativo == titulo_alternatiivo) & (Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_base_datos_digital == id_base_datos_digital))
    articulo_schema = ArticuloSchema(many=True)
    articulo = articulo_schema.dump(get_articulo)
    return articulo

def insertarArticulo(nuevoArticulo):
    print(nuevoArticulo['titulo_alternativo'])
    get_articulo = Articulo.query.filter((Articulo.id_base_datos_digital == nuevoArticulo['id_base_datos_digital']) & (Articulo.titulo == nuevoArticulo['titulo']) & (Articulo.anio_publicacion == nuevoArticulo['anio_publicacion']))
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    numeroArticulos = len(articulos)
    if numeroArticulos == 0:
        Articulo(nuevoArticulo['id_base_datos_digital'],
        nuevoArticulo['id_area_unesco'],
        nuevoArticulo['id_area_frascati'],
        nuevoArticulo['id_medio_publicacion'],
        nuevoArticulo['url_dspace'],
        nuevoArticulo['titulo'],
        nuevoArticulo['titulo_alternativo'],
        nuevoArticulo['palabras_clave'],
        nuevoArticulo['abstract'],
        nuevoArticulo['resumen'],
        nuevoArticulo['nombre_area_frascati_amplio'],
        nuevoArticulo['nombre_area_unesco_amplio'],
        nuevoArticulo['tipo_publicacion'],
        nuevoArticulo['anio_publicacion'],
        nuevoArticulo['link_revista'],
        nuevoArticulo['doi'],
        nuevoArticulo['estado_publicacion'],
        nuevoArticulo['enlace_documento'],
        nuevoArticulo['factor_impacto'],
        nuevoArticulo['cuartil'],
        nuevoArticulo['autor_identificación'],
        nuevoArticulo['orden_autor'],
        nuevoArticulo['nombres'],
        nuevoArticulo['nombre_afiliacion'],
        nuevoArticulo['nombre_medio_publicacion'],
        nuevoArticulo['nombre_area_frascati_especifico'],
        nuevoArticulo['nombre_area_unesco_especifico'],
        ).create()
        return make_response(jsonify({"respuesta": {"valor":"Artículo ingresado correctamente", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"El artículo ya esta registrado", "error":"True"}}))

def listaArticulos():
    articulosRespuesta = (db.session.query(Articulo, BaseDatosDigital, MedioPublicacion, AreaFrascati, AreaUnesco)
        .with_entities(Articulo.id_articulo, Articulo.nombres, Articulo.orden_autor, Articulo.titulo, Articulo.anio_publicacion, Articulo.doi, BaseDatosDigital.nombre_base_datos_digital, Articulo.tipo_publicacion, Articulo.url_dspace, MedioPublicacion.nombre, AreaUnesco.descripcion_unesco, AreaFrascati.descripcion)
        .join(BaseDatosDigital, Articulo.id_base_datos_digital == BaseDatosDigital.id_base_datos_digital)
        .join(MedioPublicacion, Articulo.id_medio_publicacion == MedioPublicacion.id_medio_publicacion)
        .join(AreaFrascati, Articulo.id_area_frascati == AreaFrascati.id_area_frascati )
        .join(AreaUnesco, Articulo.id_area_unesco == AreaUnesco.id_area_unesco)).all()
    #db.session.close()
    #db.session.remove()
    articulos = []
    for articulo in articulosRespuesta:
        articulos.append(dict(articulo)) # Serializo cada fila
    return make_response(jsonify({"articulos": articulos}))

def listaArticulosMineria():
    articulosRespuesta = (db.session.query(Articulo).with_entities(Articulo.id_area_frascati, Articulo.id_area_unesco)).all()
    articulos = []
    for articulo in articulosRespuesta:
        articulos.append(dict(articulo)) # Serializo cada fila
    return make_response(jsonify(articulos))

def listaArticulosMineriaAnios():
    articulosRespuesta = (db.session.query(Articulo).with_entities(Articulo.anio_publicacion, Articulo.titulo)).all()
    articulos = []
    for articulo in articulosRespuesta:
        articulos.append(dict(articulo)) # Serializo cada fila
    return make_response(jsonify(articulos))

def asignarMedioPublicacion():
    articulosRespuesta = (db.session.query(Articulo, MedioPublicacion)
        .with_entities(Articulo.id_articulo, Articulo.nombre_medio_publicacion, MedioPublicacion.nombre, MedioPublicacion.id_medio_publicacion)
        .join(MedioPublicacion, Articulo.nombre_medio_publicacion == MedioPublicacion.nombre)).all()
    
    for articulo in articulosRespuesta:
        #print(articulo.id_articulo)
        #print(articulo.id_medio_publicacion)
        articuloRespuesta = Articulo.query.get_or_404(articulo.id_articulo)
        #articuloEncontrado = Articulo.query.filter(Articulo.id_articulo == articulo.id_articulo).all()
        articuloRespuesta.id_medio_publicacion = articulo.id_medio_publicacion
        Articulo.create(articuloRespuesta)
    db.session.remove()
        #print(articuloRespuesta.id_medio_publicacion)
    return make_response(jsonify({"articulos": ""}))

def eliminarArticulo(id_articulo):
    articulo = Articulo.query.get(id_articulo)
    Articulo.delete(articulo)
    return make_response(jsonify({"respuesta": {"valor":"Publicación eliminada correctamente.", "error":"False"}}))
