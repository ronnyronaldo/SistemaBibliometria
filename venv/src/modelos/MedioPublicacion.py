#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class MedioPublicacion(db.Model):
    __tablename__ = "medio_publicacion"
    id_medio_publicacion = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150))
    
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(medioPublicacion):
      db.session.delete(medioPublicacion)
      db.session.commit()
      return medioPublicacion

    def __init__(self, nombre):
      self.nombre = nombre
    def __repr__(self):
        return '' % self.id_medio_publicacion
#db.create_all() # Para crear la tabla

