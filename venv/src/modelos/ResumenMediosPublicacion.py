#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class ResumenMediosPublicacion(db.Model):
    __tablename__ = "resumen_medios_publicacion"
    id_resumen = db.Column(db.Integer, primary_key=True)
    id_medio_publicacion = db.Column(db.String(1000))
    id_medio_citacion = db.Column(db.String(1000))
    id_medio_busqueda = db.Column(db.String(1000))
    id_medio_sjr = db.Column(db.String(1000))
    indexado = db.Column(db.String(1000))
    
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(resumenMedioPublicacion):
      db.session.delete(resumenMedioPublicacion)
      db.session.commit()
      return resumenMedioPublicacion

    def __init__(self, id_medio_publicacion, id_medio_citacion, id_medio_busqueda, id_medio_sjr, indexado):
      self.id_medio_publicacion = id_medio_publicacion
      self.id_medio_citacion = id_medio_citacion
      self.id_medio_busqueda = id_medio_busqueda
      self.id_medio_sjr = id_medio_sjr
      self.indexado = indexado
    def __repr__(self):
        return '' % self.id_resumen
#db.create_all() # Para crear la tabla

