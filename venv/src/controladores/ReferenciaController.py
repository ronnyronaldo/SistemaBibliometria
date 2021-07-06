from modelos.Articulo import Articulo
from modelos.Referencia import Referencia
from modelos.DetalleReferencia import DetalleReferencia
from controladores.BaseDatosDigitalController import validarBaseDatosDigitalPorNombre
from controladores.ArticuloController import buscarArticuloPorId
from controladores.ArticuloScopusController import buscarArticuloParaExtraerReferencias
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields

db = SQLAlchemy()

class ReferenciaSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = Referencia
        sqla_session = db.session
    id_referencia = fields.Number(dump_only=True)
    id_articulo = fields.Number(required=True)
    referencia = fields.String(required=True)

def listaReferenciasPorIdArticulo(id_articulo):
    get_referencias = Referencia.query.filter(Referencia.id_articulo == id_articulo)
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    return make_response(jsonify({"referencias": referencias}))

def listaReferenciasNoEncontradasPorIdArticulo(id_articulo):
    subquery = (db.session.query(Referencia, DetalleReferencia).with_entities(Referencia.id_referencia).filter((Referencia.id_articulo == id_articulo) & (Referencia.id_referencia == DetalleReferencia.id_referencia)))
    get_referencias = Referencia.query.filter(Referencia.id_articulo == id_articulo).filter(Referencia.id_referencia.notin_(subquery))
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    return make_response(jsonify({"referencias": referencias}))

def insertarReferenciaManual(nuevaReferencia):
    get_referencia = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']) & (Referencia.referencia == nuevaReferencia['referencia']))
    referencia_schema = ReferenciaSchema(many=True)
    referencia = referencia_schema.dump(get_referencia)
    numeroReferencias = len(referencia)
    if numeroReferencias == 0:
        Referencia(nuevaReferencia['id_articulo'], nuevaReferencia['referencia']).create()
        return make_response(jsonify({"respuesta": {"valor":"Referencia ingresada correctamente.", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La referencia ya esta ingresada.", "error":"True"}}))

def insertarReferenciaAutomatico(nuevaReferencia):
    resultado = validarBaseDatosDigitalPorNombre(nuevaReferencia['nombre_base_datos_digital'])
    nombre_base_datos_digital = (resultado.json['base_datos_digital'][0]['nombre_base_datos_digital'])
    if nombre_base_datos_digital == 'SCOPUS':
        respuestaArticulo = buscarArticuloPorId(nuevaReferencia['id_articulo'])
        respuestaArticuloScopus = buscarArticuloParaExtraerReferencias(respuestaArticulo.json['articulo'][0]['titulo'], respuestaArticulo.json['articulo'][0]['titulo_alternativo'], respuestaArticulo.json['articulo'][0]['anio_publicacion'])
        articulo_scopus = respuestaArticuloScopus.json['articulo_scopus'][0]
        id_article = articulo_scopus['id_article']
        referencesString = articulo_scopus['References']
        referencesList = []
        if not referencesString == None: 
            referencesList = referencesString.split(';')
            for reference in referencesList:
                get_referencia = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']) & (Referencia.referencia == reference))
                referencia_schema = ReferenciaSchema(many=True)
                referencia = referencia_schema.dump(get_referencia)
                numeroReferencias = len(referencia)
                if numeroReferencias == 0:
                    Referencia(nuevaReferencia['id_articulo'], reference).create()
                else:
                    return make_response(jsonify({"respuesta": {"valor":"Ya existen referencias ingresadas previamente.", "error":"True"}}))
            return make_response(jsonify({"respuesta": {"valor":"Referencias ingresadas correctamente.", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"No existen datos de referencias para cargar.", "error":"True"}}))
    
def eliminarReferencia(id_referencia):
    referencia = Referencia.query.get(id_referencia)
    Referencia.delete(referencia)
    return make_response(jsonify({"respuesta": {"valor":"Referencia eliminada correctamente.", "error":"False"}}))

def obtenerDetalleReferenciaIndividual(referenciaBuscar):
    id_referencia = referenciaBuscar['id_referencia']
    referenciaString = referenciaBuscar['referencia']
    
    get_referencias = Referencia.query.filter(Referencia.id_referencia == id_referencia)
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    id_articulo = referencias[0]['id_articulo']
    respuestaArticulo = buscarArticuloPorId(id_articulo)
    print(respuestaArticulo.json['articulo'][0]['titulo'])
    print(id_referencia)
    print(referenciaString)
    return make_response(jsonify({"respuesta": {"valor":"Referencia buscada correctamente.", "error":"False"}}))
   
