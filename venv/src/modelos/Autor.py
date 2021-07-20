#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class Autor(db.Model):
    __tablename__ = "articulo_autor"
    id_autor = db.Column(db.Integer, primary_key=True)
    id_articulo = db.Column(db.Integer)
    identificacion = db.Column(db.String(15))
    orden_autor = db.Column(db.Integer)
    nombre = db.Column(db.String(200))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(autor):
      db.session.delete(autor)
      db.session.commit()
      return autor
      
    def __init__(self, id_articulo, identificacion, orden_autor, nombre):
      self.id_articulo = id_articulo
      self.identificacion = identificacion
      self.orden_autor = orden_autor
      self.nombre = nombre

    def __repr__(self):
        return '' % self.id_autor
#db.create_all() # Para crear la tabla

