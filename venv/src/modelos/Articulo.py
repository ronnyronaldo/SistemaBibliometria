#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class Articulo(db.Model):
    __tablename__ = "articulo"
    id_articulo = db.Column(db.Integer, primary_key=True)
    id_base_datos_digital = db.Column(db.Integer)
    id_area_unesco = db.Column(db.Integer)
    id_area_frascati = db.Column(db.Integer)
    id_medio_publicacion = db.Column(db.Integer)
    url_dspace = db.Column(db.String(250))
    titulo = db.Column(db.String(500))
    titulo_alternativo = db.Column(db.String(500))
    palabras_clave = db.Column(db.String(500))
    abstract = db.Column(db.String(10000))
    resumen = db.Column(db.String(5000))
    nombre_area_frascati_amplio = db.Column(db.String(100))
    nombre_area_unesco_amplio = db.Column(db.String(100))
    tipo_publicacion = db.Column(db.String(50))
    anio_publicacion = db.Column(db.Integer)
    link_revista = db.Column(db.String(700))
    doi = db.Column(db.String(100))
    estado_publicacion = db.Column(db.String(45))
    enlace_documento = db.Column(db.String(250))
    factor_impacto = db.Column(db.String(45))
    cuartil = db.Column(db.String(45))
    autor_identificación = db.Column(db.String(45))
    orden_autor = db.Column(db.Integer)
    nombres = db.Column(db.String(100))
    nombre_afiliacion = db.Column(db.String(200))
    nombre_medio_publicacion = db.Column(db.String(150))
    nombre_area_frascati_especifico	= db.Column(db.String(100))
    nombre_area_unesco_especifico = db.Column(db.String(100))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def delete(articulo):
      db.session.delete(articulo)
      db.session.commit()
      return articulo
   
    def __init__(self, id_base_datos_digital, id_area_unesco, id_area_frascati, id_medio_publicacion, url_dspace, titulo, titulo_alternativo, palabras_clave, abstract, resumen, nombre_area_frascati_amplio, nombre_area_unesco_amplio, tipo_publicacion, anio_publicacion, link_revista, doi, estado_publicacion, enlace_documento, factor_impacto, cuartil, autor_identificación, orden_autor, nombres, nombre_afiliacion, nombre_medio_publicacion, nombre_area_frascati_especifico, nombre_area_unesco_especifico):
        self.id_base_datos_digital = id_base_datos_digital
        self.id_area_unesco = id_area_unesco 
        self.id_area_frascati = id_area_frascati
        self.id_medio_publicacion = id_medio_publicacion
        self.url_dspace = url_dspace
        self.titulo = titulo 
        self.titulo_alternativo = titulo_alternativo
        self.palabras_clave = palabras_clave
        self.abstract = abstract 
        self.resumen = resumen 
        self.nombre_area_frascati_amplio = nombre_area_frascati_amplio 
        self.nombre_area_unesco_amplio = nombre_area_unesco_amplio
        self.tipo_publicacion = tipo_publicacion
        self.anio_publicacion = anio_publicacion
        self.link_revista = link_revista
        self.doi = doi 
        self.estado_publicacion = estado_publicacion
        self.enlace_documento = enlace_documento
        self.factor_impacto = factor_impacto
        self.cuartil = cuartil
        self.autor_identificación = autor_identificación
        self.orden_autor = orden_autor 
        self.nombres = nombres 
        self.nombre_afiliacion = nombre_afiliacion
        self.nombre_medio_publicacion = nombre_medio_publicacion 
        self.nombre_area_frascati_especifico	= nombre_area_frascati_especifico
        self.nombre_area_unesco_especifico = nombre_area_unesco_especifico
    def __repr__(self):
        return '' % self.id_articulo
#db.create_all() # Para crear la tabla

