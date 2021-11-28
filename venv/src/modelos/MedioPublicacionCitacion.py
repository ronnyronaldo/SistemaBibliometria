#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_bibliometria'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class MedioPublicacionCitacion(db.Model):
    __tablename__ = "medio_publicacion_citacion"
    id_medio_publicacion = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150))
    numero_citas = db.Column(db.Integer)
    estado = db.Column(db.String(1))
    
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def __init__(self, nombre, numero_citas, estado):
      self.nombre = nombre
      self.numero_citas = numero_citas
      self.estado = estado

    def __repr__(self):
        return '' % self.id_medio_publicacion
#db.create_all() # Para crear la tabla

