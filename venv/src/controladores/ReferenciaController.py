from modelos.Articulo import Articulo
from modelos.Referencia import Referencia
from modelos.DetalleReferencia import DetalleReferencia
from controladores.BaseDatosDigitalController import validarBaseDatosDigitalPorNombre
from controladores.ArticuloController import buscarArticuloPorId
from controladores.ArticuloScopusController import buscarArticuloParaExtraerReferencias
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorId
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
from scraper_api import ScraperAPIClient
import pandas as pd
from scholarly import scholarly, ProxyGenerator 

# API basadas en Scopus
from pybliometrics.scopus import AbstractRetrieval

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

def numeroReferenciasIngresadas():
    get_referencias = Referencia.query.all()
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    numeroReferenciasIngresadas = len(referencias)
    return make_response(jsonify({"numeroReferenciasIngresadas": numeroReferenciasIngresadas}))

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
    #print(nuevaReferencia['referencia'])
    if numeroReferencias == 0:
        Referencia(nuevaReferencia['id_articulo'], nuevaReferencia['referencia']).create()
        return make_response(jsonify({"respuesta": {"valor":"Referencia ingresada correctamente.", "error":"False"}}))
    else:
        return make_response(jsonify({"respuesta": {"valor":"La referencia ya esta ingresada.", "error":"True"}}))

def insertarReferenciaAutomatico(nuevaReferencia):
    mensajesRespuesta = []
    resultado = validarBaseDatosDigitalPorNombre(nuevaReferencia['nombre_base_datos_digital'])
    if len(resultado.json['base_datos_digital']) == 1:
        nombre_base_datos_digital = (resultado.json['base_datos_digital'][0]['nombre_base_datos_digital'])
        if nombre_base_datos_digital == 'SCOPUS':
            respuestaArticulo = buscarArticuloPorId(nuevaReferencia['id_articulo'])
            if len(respuestaArticulo.json['articulo']) == 1:
                respuestaArticuloScopus = buscarArticuloParaExtraerReferencias(respuestaArticulo.json['articulo'][0]['titulo'], respuestaArticulo.json['articulo'][0]['titulo_alternativo'], respuestaArticulo.json['articulo'][0]['anio_publicacion'])
                if len(respuestaArticuloScopus.json['articulo_scopus']) == 1:
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
                                return make_response(jsonify({"respuesta": {"mensajes":[{"error": "True", "mensaje": "Ya existen referencias ingresadas previamente"}], "error":"False"}}))
                        mensaje = {
                                "error": "False",
                                "mensaje": 'Referencias ingresada correctamente.'
                            }
                        mensajesRespuesta.append(mensaje)
                else:
                    mensaje = {
                                "error": "True",
                                "mensaje": 'No existen datos de referencias para cargar.'
                        }
                    mensajesRespuesta.append(mensaje)
            else:
                mensaje = {
                            "error": "True",
                            "mensaje": 'No se encuentra registrado el articulo seleccionado.'
                    }
                mensajesRespuesta.append(mensaje)
        else:
            mensaje = {
                        "error": "True",
                        "mensaje": 'No exiten datos de la base de datos digital: '+ nombre_base_datos_digital 
                }
            mensajesRespuesta.append(mensaje)
    else:
        mensaje = {
                "error": "True",
                "mensaje": 'No exiten esta registrada la base de datos digital: '+ nombre_base_datos_digital 
        }
        mensajesRespuesta.append(mensaje)
    return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"False"}}))
    
def eliminarReferencia(id_referencia):
    referencia = Referencia.query.get(id_referencia)
    Referencia.delete(referencia)
    return make_response(jsonify({"respuesta": {"valor":"Referencia eliminada correctamente.", "error":"False"}}))

def eliminarReferenciaPorIdArticulo(id_articulo):
    referencias = listaReferenciasPorIdArticulo(id_articulo)
    listaReferencias = referencias.json['referencias']

    for referencia in listaReferencias:
        referenciaEliminar = Referencia.query.get(referencia['id_referencia'])
        Referencia.delete(referenciaEliminar)

    return make_response(jsonify({"respuesta": {"valor":"Referencias eliminadas correctamente.", "error":"False"}}))

def obtenerDetalleReferenciaIndividual(referenciaBuscar):
    """id_referencia = referenciaBuscar['id_referencia']
    referenciaString = referenciaBuscar['referencia']
    get_referencias = Referencia.query.filter(Referencia.id_referencia == id_referencia)
    referencias_schema = ReferenciaSchema(many=True)
    referencias = referencias_schema.dump(get_referencias)
    id_articulo = referencias[0]['id_articulo']
    respuestaArticulo = buscarArticuloPorId(id_articulo)
    # print(id_referencia)
    pg = ProxyGenerator()
    pg.ScraperAPI('80507573c7f452c1a0bcaa4ff664e804')
    scholarly.use_proxy(pg)
    try:
        search_queryAux = scholarly.search_pubs(referenciaString)
        detalleReferencia = search_queryAux.__next__()
        # Extraer detalle de la referencia
        # print(detalleReferencia)
        container_type = detalleReferencia.get('container_type')
        source = detalleReferencia.get('source')
        filled = detalleReferencia.get('filled')
        gsrank = detalleReferencia.get('gsrank')
        pub_url = detalleReferencia.get('pub_url')
        author_id = detalleReferencia.get('author_id')
        num_citations = detalleReferencia.get('num_citations')
        url_scholarbib = detalleReferencia.get('url_scholarbib')
        url_add_sclib = detalleReferencia.get('url_add_sclib')
        citedby_url = detalleReferencia.get('citedby_url')
        url_related_articles = detalleReferencia.get('url_related_articles')
        title = (detalleReferencia.get('bib')).get('title')
        author = (detalleReferencia.get('bib')).get('author')
        pub_year = (detalleReferencia.get('bib')).get('pub_year')
        venue = (detalleReferencia.get('bib')).get('venue')
        abstract = (detalleReferencia.get('bib')).get('abstract')
        # Extraer detalle de la referencia
        #Transformar a string una lista
        author_id_string = ";".join(author_id)
        author_string =  ";".join(author)
        #Transformar a string una lista
        referenciaSinEspacios = referenciaString.replace(' ','') 
        print(referenciaSinEspacios)
        tituloSinEspacios = title.replace(' ','')  
        print(tituloSinEspacios)
        anioSinEspacios = pub_year.replace(' ','')  
        print(anioSinEspacios)
        print(tituloSinEspacios in referenciaSinEspacios)
        #print( pub_year in referenciaString)
        if (tituloSinEspacios in referenciaSinEspacios) and (anioSinEspacios in referenciaSinEspacios):
            DetalleReferencia(id_referencia, container_type, source, filled, gsrank, pub_url, author_id_string, num_citations, url_scholarbib, url_add_sclib, citedby_url, url_related_articles, title, author_string, pub_year, venue, abstract).create()
            return make_response(jsonify({"respuesta": {"valor":"Referencia encontrada correctamente.", "error":"False"}}))
        else:
            return make_response(jsonify({"respuesta": {"valor":"Referencia no encontrada.", "error":"True"}}))
    except:
        print('Referencia no encontrada')"""
    return make_response(jsonify({"respuesta": {"valor":"Referencia no encontrada.", "error":"True"}}))

def obtenerDetalleReferenciaTotal(articuloBuscar):
    id_articulo = articuloBuscar['id_articulo']
    referenciasNoEncontradas = listaReferenciasNoEncontradasPorIdArticulo(id_articulo)
    referencias = referenciasNoEncontradas.json['referencias']
    print(id_articulo)
    for referencia in referencias:
        id_referencia = referencia['id_referencia']
        referenciaString = referencia['referencia']
        print(referenciaString)
        respuestaDetalleReferencia = listaDetalleReferenciaPorId(id_referencia).json['detalleReferencia']
        numeroDetalleReferencia = len(respuestaDetalleReferencia)
        print(numeroDetalleReferencia)
        if numeroDetalleReferencia == 0:
            pg = ProxyGenerator()
            pg.ScraperAPI('81ded0ad907a5555e982aa011ff2e75b')
            scholarly.use_proxy(pg)
            try:
                search_queryAux = scholarly.search_pubs(referenciaString)
                detalleReferencia = search_queryAux.__next__()
                # Extraer detalle de la referencia
                print(detalleReferencia)
                container_type = detalleReferencia.get('container_type')
                source = detalleReferencia.get('source')
                filled = detalleReferencia.get('filled')
                gsrank = detalleReferencia.get('gsrank')
                pub_url = detalleReferencia.get('pub_url')
                author_id = detalleReferencia.get('author_id')
                num_citations = detalleReferencia.get('num_citations')
                url_scholarbib = detalleReferencia.get('url_scholarbib')
                url_add_sclib = detalleReferencia.get('url_add_sclib')
                citedby_url = detalleReferencia.get('citedby_url')
                url_related_articles = detalleReferencia.get('url_related_articles')
                title = (detalleReferencia.get('bib')).get('title')
                author = (detalleReferencia.get('bib')).get('author')
                pub_year = (detalleReferencia.get('bib')).get('pub_year')
                venue = (detalleReferencia.get('bib')).get('venue')
                abstract = (detalleReferencia.get('bib')).get('abstract')
                # Extraer detalle de la referencia
                #Transformar a string una lista
                author_id_string = ";".join(author_id)
                author_string =  ";".join(author)
                #Transformar a string una lista
                referenciaSinEspacios = referenciaString.replace(' ','') 
                print(referenciaSinEspacios)
                tituloSinEspacios = title.replace(' ','')  
                print(tituloSinEspacios)
                anioSinEspacios = pub_year.replace(' ','')  
                print(anioSinEspacios)
                print(tituloSinEspacios in referenciaSinEspacios)
                #print( pub_year in referenciaString)
                if (tituloSinEspacios in referenciaSinEspacios) and (anioSinEspacios in referenciaSinEspacios):
                    DetalleReferencia(id_referencia, container_type, source, filled, gsrank, pub_url, author_id_string, num_citations, url_scholarbib, url_add_sclib, citedby_url, url_related_articles, title, author_string, pub_year, venue, abstract).create()
            
            except:
                print('Referencia no encontrada')
    return make_response(jsonify({"respuesta": {"valor":"Proceso Búsqueda Terminado.", "error":"False"}}))

def insertarReferenciaAutomaticoScopus(nuevaReferencia):
    mensajesRespuesta = []
    resultado = validarBaseDatosDigitalPorNombre(nuevaReferencia['nombre_base_datos_digital'])
    if len(resultado.json['base_datos_digital']) == 1:
        nombre_base_datos_digital = (resultado.json['base_datos_digital'][0]['nombre_base_datos_digital'])
        #if nombre_base_datos_digital == 'SCOPUS':
        respuestaArticulo = buscarArticuloPorId(nuevaReferencia['id_articulo'])
        if len(respuestaArticulo.json['articulo']) == 1:
            try:
                print("Buscando por doi")
                doi = respuestaArticulo.json['articulo'][0]['doi']
                print(doi)
                ab = AbstractRetrieval(doi, view='FULL')
                refs = ab.references
                df = pd.DataFrame(refs)
                numeroReferenciasAPI = len(df.index)
                if(numeroReferenciasAPI > 0):
                    get_referencia = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']))
                    referencia_schema = ReferenciaSchema(many=True)
                    referencia = referencia_schema.dump(get_referencia)
                    numeroReferencias = len(referencia)

                    if numeroReferencias > 0:
                        eliminarReferenciaPorIdArticulo(nuevaReferencia['id_articulo'])

                    for row in df.itertuples(index=True, name='Pandas'):
                        reference = row.fulltext
                        titulo = row.title
                        autores = row.authors
                        medioPublicacion = row.sourcetitle
                        año = 0
                        if row.publicationyear == None:
                            año = 0
                        else:
                            año = int(row.publicationyear)

                        numerocitaciones = 0
                        if row.citedbycount == None:
                            numerocitaciones = 0
                        else:
                            numerocitaciones = int(row.citedbycount)

                      
                        Referencia(nuevaReferencia['id_articulo'], reference).create() # Ingreso primero la referencia
                        get_referencias = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']) & (Referencia.referencia == reference))
                        referencias_schema = ReferenciaSchema(many=True)
                        referencias = referencias_schema.dump(get_referencias)    
                        id_referencia = referencias[0]['id_referencia'] 
                        DetalleReferencia(id_referencia,                               # Ingreso el Detalle de la Referencia
                        '', 
                        '', 
                        '', 
                        '', 
                        '', 
                        '', 
                        numerocitaciones, 
                        '', 
                        '', 
                        '', 
                        '', 
                        titulo, 
                        autores, 
                        año, 
                        medioPublicacion, 
                        '').create()
                    return make_response(jsonify({"respuesta": {"mensajes":[{"error": "False", "mensaje": "Referencias ingresadas correctamente"}], "error":"False"}}))
            except Exception as e:
                print(e)
                try:
                    print("Buscando por titulo alternativo..")
                    titulo_alternativo = respuestaArticulo.json['articulo'][0]['titulo_alternativo']
                    print(titulo_alternativo)
                    ab = AbstractRetrieval(titulo_alternativo, view='FULL')
                    refs = ab.references
                    df = pd.DataFrame(refs)
                    numeroReferenciasAPI = len(df.itertuples(index=True, name='Pandas'))
                    if(numeroReferenciasAPI > 0):
                        get_referencia = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']))
                        referencia_schema = ReferenciaSchema(many=True)
                        referencia = referencia_schema.dump(get_referencia)
                        numeroReferencias = len(referencia)

                        if numeroReferencias > 0:
                            eliminarReferenciaPorIdArticulo(nuevaReferencia['id_articulo'])

                        for row in df.itertuples(index=True, name='Pandas'):
                            reference = row.fulltext
                            titulo = row.title
                            autores = row.authors
                            medioPublicacion = row.sourcetitle
                            año = int(row.publicationyear)
                            numerocitaciones = 0
                            if row.citedbycount == None:
                                numerocitaciones = 0
                            else:
                                numerocitaciones = int(row.citedbycount)

                        
                            Referencia(nuevaReferencia['id_articulo'], reference).create() # Ingreso primero la referencia
                            get_referencias = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']) & (Referencia.referencia == reference))
                            referencias_schema = ReferenciaSchema(many=True)
                            referencias = referencias_schema.dump(get_referencias)    
                            id_referencia = referencias[0]['id_referencia'] 
                            DetalleReferencia(id_referencia,                               # Ingreso el Detalle de la Referencia
                            '', 
                            '', 
                            '', 
                            '', 
                            '', 
                            '', 
                            numerocitaciones, 
                            '', 
                            '', 
                            '', 
                            '', 
                            titulo, 
                            autores, 
                            año, 
                            medioPublicacion, 
                            '').create()
                        return make_response(jsonify({"respuesta": {"mensajes":[{"error": "False", "mensaje": "Referencias ingresadas correctamente"}], "error":"False"}}))
                except:
                    try:
                        print("Buscando por titulo...")
                        titulo = respuestaArticulo.json['articulo'][0]['titulo']
                        print(titulo)
                        ab = AbstractRetrieval(titulo, view='FULL')
                        refs = ab.references
                        df = pd.DataFrame(refs)
                        numeroReferenciasAPI = len(df.itertuples(index=True, name='Pandas'))
                        if(numeroReferenciasAPI > 0):
                            get_referencia = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']))
                            referencia_schema = ReferenciaSchema(many=True)
                            referencia = referencia_schema.dump(get_referencia)
                            numeroReferencias = len(referencia)

                            if numeroReferencias > 0:
                                eliminarReferenciaPorIdArticulo(nuevaReferencia['id_articulo'])

                            for row in df.itertuples(index=True, name='Pandas'):
                                reference = row.fulltext
                                titulo = row.title
                                autores = row.authors
                                medioPublicacion = row.sourcetitle
                                año = int(row.publicationyear)
                                numerocitaciones = 0
                                if row.citedbycount == None:
                                    numerocitaciones = 0
                                else:
                                    numerocitaciones = int(row.citedbycount)

                            
                                Referencia(nuevaReferencia['id_articulo'], reference).create() # Ingreso primero la referencia
                                get_referencias = Referencia.query.filter((Referencia.id_articulo == nuevaReferencia['id_articulo']) & (Referencia.referencia == reference))
                                referencias_schema = ReferenciaSchema(many=True)
                                referencias = referencias_schema.dump(get_referencias)    
                                id_referencia = referencias[0]['id_referencia'] 
                                DetalleReferencia(id_referencia,                               # Ingreso el Detalle de la Referencia
                                '', 
                                '', 
                                '', 
                                '', 
                                '', 
                                '', 
                                numerocitaciones, 
                                '', 
                                '', 
                                '', 
                                '', 
                                titulo, 
                                autores, 
                                año, 
                                medioPublicacion, 
                                '').create()
                            return make_response(jsonify({"respuesta": {"mensajes":[{"error": "False", "mensaje": "Referencias ingresadas correctamente"}], "error":"False"}}))
                    except:
                        mensaje = {
                            "error": "True",
                            "mensaje": 'No se han encontrado referencias para cargar.'
                            }
                        mensajesRespuesta.append(mensaje)
        else:
            mensaje = {
                        "error": "True",
                        "mensaje": 'No se encuentra registrado el articulo seleccionado.'
                }
            mensajesRespuesta.append(mensaje)
        """else:
            mensaje = {
                        "error": "True",
                        "mensaje": 'No exiten datos de la base de datos digital: '+ nombre_base_datos_digital 
                }
            mensajesRespuesta.append(mensaje)"""
    else:
        mensaje = {
                "error": "True",
                "mensaje": 'No exiten esta registrada la base de datos digital: '+ nombre_base_datos_digital 
        }
        mensajesRespuesta.append(mensaje)
    return make_response(jsonify({"respuesta": {"mensajes":mensajesRespuesta, "error":"False"}}))

def obtenerDetalleReferenciaTotalScopus(articuloBuscar):
    id_articulo = articuloBuscar['id_articulo']
    referenciasNoEncontradas = listaReferenciasNoEncontradasPorIdArticulo(id_articulo)
    referencias = referenciasNoEncontradas.json['referencias']
    print(id_articulo)
    for referencia in referencias:
        id_referencia = referencia['id_referencia']
        referenciaString = referencia['referencia']
        respuestaDetalleReferencia = listaDetalleReferenciaPorId(id_referencia).json['detalleReferencia']
        numeroDetalleReferencia = len(respuestaDetalleReferencia)
        print(numeroDetalleReferencia)
        if numeroDetalleReferencia == 0:
            print(referenciaString)
            try:
                #ab = AbstractRetrieval(referenciaString)
                ab = AbstractRetrieval("10.1016/j.softx.2019.100263")
                print(ab)
            except:
                print('Detalle referencia no fue recuperada.')
    return make_response(jsonify({"respuesta": {"valor":"Proceso Búsqueda Terminado.", "error":"False"}}))




    
   
