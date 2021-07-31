from modelos.DetalleReferencia import DetalleReferencia 
from modelos.Articulo import Articulo 
from modelos.Referencia import Referencia 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from sqlalchemy.orm.attributes import flag_modified
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class DetalleReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = DetalleReferencia
        sqla_session = db.session
    id_detalle_referencia = fields.Number(dump_only=True)
    id_referencia = fields.Number(dump_only=True)
    container_type = fields.String(required=True)
    source = fields.String(required=True)
    filled = fields.String(required=True)
    gsrank = fields.String(required=True)
    pub_url =  fields.String(required=True)
    author_id =  fields.String(required=True)
    num_citations = fields.Number(dump_only=True)
    url_scholarbib = fields.String(required=True)
    url_add_sclib = fields.String(required=True)
    citedby_url = fields.String(required=True)
    url_related_articles = fields.String(required=True)
    title = fields.String(required=True)
    author = fields.String(required=True)
    pub_year = fields.Number(dump_only=True)
    venue = fields.String(required=True)
    abstract = fields.String(required=True)

def listaDetalleReferencia():
    get_detalle_referencia = DetalleReferencia.query.all()
    detalle_referencia_schema = DetalleReferenciaSchema(many=True)
    detalles_referencia = detalle_referencia_schema.dump(get_detalle_referencia)
    return make_response(jsonify(detalles_referencia))

def listaDetalleReferenciaPorIdArticulo(id_articulo):
    print(id_articulo)
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter(Articulo.id_articulo == id_articulo)
    .with_entities(DetalleReferencia.title, DetalleReferencia.author, DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    print(len(detalleReferencias))
    return make_response(jsonify({"detalleReferencia": detalleReferencias}))

def listaDetalleReferenciaPorId(id_referencia):
    get_detalle_referencia = DetalleReferencia.query.filter(DetalleReferencia.id_referencia == id_referencia)
    detalle_referencia_schema = DetalleReferenciaSchema(many=True)
    detalles_referencia = detalle_referencia_schema.dump(get_detalle_referencia)
    return make_response(jsonify({"detalleReferencia": detalles_referencia}))

def numeroDetalleReferenciaIngresadas():
    get_detalle_referencia = DetalleReferencia.query.all()
    detalle_referencia_schema = DetalleReferenciaSchema(many=True)
    detalles_referencia = detalle_referencia_schema.dump(get_detalle_referencia)
    numeroDetalleReferenciaIngresadas = len(detalles_referencia)
    return make_response(jsonify({"numeroDetalleReferenciaIngresadas" : numeroDetalleReferenciaIngresadas}))

def listaDetalleReferenciaPorAnio(anio_publicacion):

    """get_detalle_referencia = DetalleReferencia.query.filter((Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_articulo == Referencia.id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalle_referencia_schema = DetalleReferenciaSchema(many=True)
    detalles_referencia = detalle_referencia_schema.dump(get_detalle_referencia)
    print(len(detalles_referencia))"""
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter(Articulo.anio_publicacion == anio_publicacion)
    .with_entities(DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    print(len(detalleReferencias))
    return make_response(jsonify(detalleReferencias))

def listaDetalleReferenciaPorAreaFrascati(id_area_frascati):
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter(Articulo.id_area_frascati == id_area_frascati)
    .with_entities(DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, DetalleReferencia.title, DetalleReferencia.author, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia, Referencia.referencia, DetalleReferencia.id_detalle_referencia, DetalleReferencia.pub_url)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    return make_response(jsonify(detalleReferencias))

def listaDetalleReferenciaPorAreaUnesco(id_area_unesco):
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter(Articulo.id_area_unesco == id_area_unesco)
    .with_entities(DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, DetalleReferencia.title, DetalleReferencia.author, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia, Referencia.referencia, DetalleReferencia.id_detalle_referencia, DetalleReferencia.pub_url)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    return make_response(jsonify(detalleReferencias))

def listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati):
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter((Articulo.id_area_frascati == id_area_frascati) & (Articulo.anio_publicacion == anio_publicacion))
    .with_entities(DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, DetalleReferencia.title, DetalleReferencia.author, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia, Referencia.referencia, DetalleReferencia.id_detalle_referencia,  DetalleReferencia.pub_url)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    return make_response(jsonify(detalleReferencias))

def listaDetalleReferenciaPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco):
    referenciaRespuesta = (db.session.query(Articulo, Referencia, DetalleReferencia).filter((Articulo.id_area_unesco == id_area_unesco) & (Articulo.anio_publicacion == anio_publicacion))
    .with_entities(DetalleReferencia.venue, DetalleReferencia.num_citations, DetalleReferencia.pub_year, DetalleReferencia.title, DetalleReferencia.author, Articulo.anio_publicacion, Articulo.id_area_frascati, Articulo.id_area_unesco, DetalleReferencia.id_referencia,  Referencia.referencia, DetalleReferencia.id_detalle_referencia,  DetalleReferencia.pub_url)
    .join(Referencia, Articulo.id_articulo == Referencia.id_articulo)
    .join(DetalleReferencia, Referencia.id_referencia == DetalleReferencia.id_referencia)).all()
    detalleReferencias = []
    for detalleReferencia in referenciaRespuesta:
        detalleReferencias.append(dict(detalleReferencia)) # Serializo cada fila
    return make_response(jsonify(detalleReferencias))

def actualizarDetalleReferencia(detalle):
    detalleReferencia = DetalleReferencia.query.get_or_404(detalle['id_detalle_referencia'])
    detalleReferencia.venue = detalle['medio_publicacion']
    DetalleReferencia.create(detalleReferencia)
    return make_response(jsonify({"respuesta": {"valor":"Detalle referencia actualizada correctamente.", "error":"False"}}))



