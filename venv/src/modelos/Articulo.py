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

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    """def __init__(self,title,productDescription,productBrand,price):
        self.title = title
        self.productDescription = productDescription
        self.productBrand = productBrand
        self.price = price"""
    def __repr__(self):
        return '' % self.id_articulo
#db.create_all() # Para crear la tabla

