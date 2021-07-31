from modelos.Articulo import Articulo
from modelos.Referencia import Referencia
from modelos.BaseDatosDigital import BaseDatosDigital
from modelos.MedioPublicacion import MedioPublicacion
from modelos.AreaFrascati import AreaFrascati
from modelos.AreaUnesco import AreaUnesco 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from controladores.AreaFrascatiController import buscarAreaFrascatiPorId, validarAreaFrascatiPorNombre
from controladores.AreaUnescoController import buscarAreaUnescoPorId, validarAreaUnescoPorNombre
from controladores.MedioPublicacionController import buscaMedioPublicacionPorId, verificaMedioPublicacionPorNombre
from controladores.BaseDatosDigitalController import  validarBaseDatosDigitalPorNombre

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

def obtenerIdArticuloIngresarAutor(titulo, anio_publicacion, id_base_datos_digital):
    get_articulo = Articulo.query.filter((Articulo.titulo == titulo) & (Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_base_datos_digital == id_base_datos_digital))
    articulo_schema = ArticuloSchema(many=True)
    articulo = articulo_schema.dump(get_articulo)
    return articulo

def insertarArticulo(nuevosArticulos):
    articulos = nuevosArticulos['nuevasPublicaciones']
    mensajesRespuesta = []
    for articulo in articulos:
        resultado_base_datos_digital = validarBaseDatosDigitalPorNombre(articulo['nombre']).json['base_datos_digital']
        resultado_area_frascati = validarAreaFrascatiPorNombre(articulo['nombre_area_frascati_especifico']).json['area_frascati']
        resultado_area_unesco = validarAreaUnescoPorNombre(articulo['nombre_area_unesco_especifico']).json['area_unesco']
        resultado_medio_publicacion = verificaMedioPublicacionPorNombre(articulo['nombre_medio_publicacion']).json['mediosPublicacion']
    
        if len(resultado_base_datos_digital) == 1:
            id_base_datos_digital = resultado_base_datos_digital[0]['id_base_datos_digital']
            if len(resultado_area_frascati) == 1:
                id_area_frascati = resultado_area_frascati[0]['id_area_frascati']
                if len(resultado_area_unesco) == 1:
                    id_area_unesco = resultado_area_unesco[0]['id_area_unesco']
                    if len(resultado_medio_publicacion) == 1:
                        id_medio_publicacion = resultado_medio_publicacion[0]['id_medio_publicacion']
                        get_articulo = Articulo.query.filter((Articulo.id_base_datos_digital == id_base_datos_digital) & (Articulo.titulo == articulo['titulo']) & (Articulo.anio_publicacion == articulo['anio_publicacion']))
                        articulo_schema = ArticuloSchema(many=True)
                        articulos = articulo_schema.dump(get_articulo)
                        numeroArticulos = len(articulos)
                        if numeroArticulos == 0:
                            url_dspace = extraerDatos(articulo, 'url_dspace')
                            titulo = extraerDatos(articulo, 'titulo')
                            titulo_alternativo = extraerDatos(articulo,'titulo_alternativo')
                            palabras_clave = extraerDatos(articulo, 'palabras_clave')
                            abstract = extraerDatos(articulo, 'abstract')
                            resumen = extraerDatos(articulo, 'resumen')
                            nombre_area_frascati_amplio = extraerDatos(articulo, 'nombre_area_frascati_amplio')
                            nombre_area_unesco_amplio = extraerDatos(articulo, 'nombre_area_unesco_amplio')
                            tipo_publicacion = extraerDatos(articulo, 'tipo_publicacion')
                            anio_publicacion = extraerDatos(articulo,'anio_publicacion')
                            link_revista = extraerDatos(articulo, 'link_revista')
                            doi = extraerDatos(articulo, 'doi')
                            estado_publicacion = extraerDatos(articulo, 'estado_publicacion')
                            enlace_documento = extraerDatos(articulo, 'enlace_documento')
                            factor_impacto = extraerDatos(articulo, 'factor_impacto')
                            cuartil = extraerDatos(articulo, 'cuartil')
                            autor_identificacion = extraerDatos(articulo, 'autor_identificación')
                            orden_autor = extraerDatos(articulo, 'orden_autor')
                            nombres = extraerDatos(articulo, 'nombres')
                            nombre_afiliacion = extraerDatos(articulo, 'nombre_afiliacion')
                            nombre_medio_publicacion = extraerDatos(articulo, 'nombre_medio_publicacion')
                            nombre_area_frascati_especifico = extraerDatos(articulo, 'nombre_area_frascati_especifico')
                            nombre_area_unesco_especifico = extraerDatos(articulo, 'nombre_area_unesco_especifico')
                            
                            Articulo(id_base_datos_digital,
                            id_area_unesco,
                            id_area_frascati,
                            id_medio_publicacion,
                            url_dspace,
                            titulo,
                            titulo_alternativo,
                            palabras_clave,
                            abstract,
                            resumen,
                            nombre_area_frascati_amplio,
                            nombre_area_unesco_amplio,
                            tipo_publicacion,
                            anio_publicacion,
                            link_revista,
                            doi,
                            estado_publicacion,
                            enlace_documento,
                            factor_impacto,
                            cuartil,
                            autor_identificacion,
                            orden_autor,
                            nombres,
                            nombre_afiliacion,
                            nombre_medio_publicacion,
                            nombre_area_frascati_especifico,
                            nombre_area_unesco_especifico
                            ).create()
                            
                            mensaje = {
                                "error": "False",
                                "mensaje": 'Artículo ingresado correctamente: '+articulo['titulo']
                            }
                            mensajesRespuesta.append(mensaje)
                        else:
                            mensaje = {
                                "error": "True",
                                "mensaje": 'La publicacion ya esta registrada: '+ articulo['titulo']
                            }
                            mensajesRespuesta.append(mensaje)
                    else:
                        mensaje = {
                            "error": "True",
                            "mensaje": 'No se ha registrado el medio de publicación: '+ articulo['nombre_medio_publicacion']
                        }
                        mensajesRespuesta.append(mensaje)
                else:
                    mensaje = {
                            "error": "True",
                            "mensaje": 'No se ha registrado el área unesco: ' + articulo['nombre_area_unesco_especifico']
                        }
                    mensajesRespuesta.append(mensaje)
            else:
                mensaje = {
                        "error": "True",
                        "mensaje": 'No se ha registrado el área frascati: ' + articulo['nombre_area_frascati_especifico']
                    }
                mensajesRespuesta.append(mensaje)
        else:
            mensaje = {
                    "error": "True",
                    "mensaje": 'No se encuentra registrado la base de datos digital: ' + articulo['nombre']
                }
            mensajesRespuesta.append(mensaje)
    return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"False"}}))

def extraerDatos(articulo, campo):
    try:
        return articulo[campo]
    except:
        return ""

def listaArticulos():
    articulosRespuesta = (db.session.query(Articulo, BaseDatosDigital, MedioPublicacion, AreaFrascati, AreaUnesco)
        .with_entities(Articulo.id_articulo, Articulo.nombres, Articulo.orden_autor, Articulo.titulo, Articulo.anio_publicacion, Articulo.doi, BaseDatosDigital.nombre_base_datos_digital, Articulo.tipo_publicacion, Articulo.url_dspace,Articulo.enlace_documento, MedioPublicacion.nombre, AreaUnesco.descripcion_unesco, AreaFrascati.descripcion, Articulo.cuartil)
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

def numeroArticulosIngresados():
    get_articulo = Articulo.query.all()
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    numeroArticulos = len(articulos)
    return make_response(jsonify({"totalArticulos" : numeroArticulos}))

def numeroArticulosNoTienenReferencias():
    subquery = (db.session.query(Articulo, Referencia).with_entities(Articulo.id_articulo)
        .join(Referencia, Articulo.id_articulo == Referencia.id_articulo))
    query = db.session.query(Articulo).filter(Articulo.id_articulo.notin_(subquery))
    referencias = query.all()
    numeroArticulosNoTienenReferencias = len(referencias)
    return make_response(jsonify({"numeroArticulosNoTienenReferencias": numeroArticulosNoTienenReferencias}))

def listaArticulosMineria():
    get_articulo = Articulo.query.all()
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def listaArticulosMineriaPorAnio(anio_publicacion):
    get_articulo = Articulo.query.filter(Articulo.anio_publicacion == anio_publicacion)
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def listaArticulosMineriaPorAreaFrascati(id_area_frascati):
    get_articulo = Articulo.query.filter(Articulo.id_area_frascati == id_area_frascati)
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def listaArticulosMineriaPorAreaUnesco(id_area_unesco):
    get_articulo = Articulo.query.filter(Articulo.id_area_unesco == id_area_unesco)
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def listaArticulosMineriaPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco):
    get_articulo = Articulo.query.filter((Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_area_unesco == id_area_unesco))
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def listaArticulosMineriaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati):
    get_articulo = Articulo.query.filter((Articulo.anio_publicacion == anio_publicacion) & (Articulo.id_area_frascati == id_area_frascati))
    articulo_schema = ArticuloSchema(many=True)
    articulos = articulo_schema.dump(get_articulo)
    return make_response(jsonify(articulos))

def obtenerDetalleClusterAreasPub(resultadoClusterAreas):
    numero_cluster = resultadoClusterAreas[0]['num_cluster']
    clusters = []
    for i in range(numero_cluster):
        valor = {i: []}
        clusters.append(valor) 
    for registro in resultadoClusterAreas:
        respuestaArticulo = buscarArticuloPorId(registro['id_articulo']).json['articulo'][0]
        respuestaAreaFrascati = buscarAreaFrascatiPorId(respuestaArticulo['id_area_frascati']).json['area_frascati'][0]
        respuestaAreaUnesco = buscarAreaUnescoPorId(respuestaArticulo['id_area_unesco']).json['area_unesco'][0]
        valor = {"areaFrascati": respuestaAreaFrascati['descripcion'], "areaUnesco": respuestaAreaUnesco['descripcion_unesco'], "id_articulo": registro['id_articulo']}
        for i in range(numero_cluster):
            if registro['id_cluster'] == i:
                clusters[i][i].append(valor)
    return make_response(jsonify(clusters))

def obtenerDetalleClusterCuartilAreUne(resultadoClusterAreas):
    numero_cluster = resultadoClusterAreas[0]['num_cluster']
    clusters = []
    for i in range(numero_cluster):
        valor = {i: []}
        clusters.append(valor) 
    for registro in resultadoClusterAreas:
        respuestaArticulo = buscarArticuloPorId(registro['id_articulo']).json['articulo'][0]
        respuestaAreaUnesco = buscarAreaUnescoPorId(respuestaArticulo['id_area_unesco']).json['area_unesco'][0]
        valor = {"cuartil": respuestaArticulo['cuartil'], "areaUnesco": respuestaAreaUnesco['descripcion_unesco'], "id_articulo": registro['id_articulo']}
        for i in range(numero_cluster):
            if registro['id_cluster'] == i:
                clusters[i][i].append(valor)
    return make_response(jsonify(clusters))

def obtenerDetalleClusterMediosPublicacion(resultadoClusterMediosPublicacion):
    numero_cluster = resultadoClusterMediosPublicacion[0]['num_cluster']
    clusters = []
    for i in range(numero_cluster):
        valor = {i: []}
        clusters.append(valor) 
    for registro in resultadoClusterMediosPublicacion:
        respuestaArticulo = buscarArticuloPorId(registro['id_articulo']).json['articulo'][0]
        respuestaMedioPublicacion = buscaMedioPublicacionPorId(respuestaArticulo['id_medio_publicacion']).json['mediosPublicacion'][0]
        valor = {"medioPublicacion": respuestaMedioPublicacion['nombre'], "id_articulo": registro['id_articulo']}
        for i in range(numero_cluster):
            if registro['id_cluster'] == i:
                clusters[i][i].append(valor)
    return make_response(jsonify(clusters))

def obtenerDetalleClusterMediosPublicacionRef(resultadoClusterMediosPublicacionRef):
    numero_cluster = resultadoClusterMediosPublicacionRef[0]['num_cluster']
    clusters = []
    for i in range(numero_cluster):
        valor = {i: []}
        clusters.append(valor) 
    for registro in resultadoClusterMediosPublicacionRef:
        valor = {"id_referencia": registro['id_referencia'], "medioPublicacion": registro['nombre_medio_publicacion']}
        for i in range(numero_cluster):
            if registro['id_cluster'] == i:
                clusters[i][i].append(valor)
    return make_response(jsonify(clusters))

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


def actualizarArticulo(publicacion):
    articulo = Articulo.query.get_or_404(publicacion['id_articulo'])
    articulo.nombres  = publicacion['autor']
    articulo.titulo  = publicacion['titulo']
    articulo.anio_publicacion  = publicacion['anio']
    articulo.tipo_publicacion  = publicacion['tipoPublicacion']
    articulo.cuartil  = publicacion['cuartil']
    Articulo.create(articulo)
    return make_response(jsonify({"respuesta": {"valor":"Publicacion actualizada correctamente.", "error":"False"}}))
