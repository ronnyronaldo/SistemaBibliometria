#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class Parametro(db.Model):
    __tablename__ = "parametro"
    id_parametro = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(500))
    valor = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def delete(parametro):
      db.session.delete(parametro)
      db.session.commit()
      return parametro
   
    def __init__(self, id_parametro, nombre, valor):
        self.id_parametro = id_parametro
        self.nombre = nombre 
        self.valor = valor

    def __repr__(self):
        return '' % self.id_parametro
#db.create_all() # Para crear la tabla