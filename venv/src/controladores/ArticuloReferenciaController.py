from scraper_api import ScraperAPIClient
from modelos.ArticuloReferenciaScopus import ArticuloReferenciaScopus
from modelos.DetalleReferenciaScopus import DetalleReferenciaScopus
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from marshmallow_sqlalchemy import ModelSchema
from marshmallow import fields
#from scholarly import scholarly, ProxyGenerator 

db = SQLAlchemy()

class ArticuloReferenciaScopusSchema(ModelSchema):
    class Meta(ModelSchema.Meta):
        model = ArticuloReferenciaScopus
        sqla_session = db.session
    id = fields.Number(dump_only=True)
    id_article_pwh = fields.Number(dump_only=True)
    id_article = fields.Number(required=True)
    references = fields.String(required=True)

def listaArticulosReferencias():
    get_articulos = ArticuloReferenciaScopus.query.all()
    articulos_schema = ArticuloReferenciaScopusSchema(many=True)
    articulosRef = articulos_schema.dump(get_articulos)
    return make_response(jsonify({"referencias": articulosRef}))

def obtenerDetalleReferencias():
    #pg = ProxyGenerator()
    #pg.ScraperAPI('b2b3bd83b1aabff21cfdca39bf18a0dd')
    #scholarly.use_proxy(pg)
    get_articulos = ArticuloReferenciaScopus.query.filter((ArticuloReferenciaScopus.id >= 2271)&(ArticuloReferenciaScopus.id <= 5000))
    articulos_schema = ArticuloReferenciaScopusSchema(many=True)
    articulosRef = articulos_schema.dump(get_articulos)
    for articulo in articulosRef:
        #print("Ingreso al bucle")
        id_articleRef = articulo["id"]
        print(id_articleRef)
        print(articulo["reference"])
        """try:
            search_queryAux = scholarly.search_pubs(articulo["reference"])
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
            DetalleReferenciaScopus(id_articleRef, container_type, source, filled, gsrank, pub_url, author_id_string, num_citations, url_scholarbib, url_add_sclib, citedby_url, url_related_articles, title, author_string, pub_year, venue, abstract).create()
        except:
            pass"""
        
    return make_response(jsonify({"referencias": "Buscando scholarly"}))