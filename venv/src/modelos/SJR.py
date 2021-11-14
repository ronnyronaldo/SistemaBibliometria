#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_bibliometria'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class SJR(db.Model):
    __tablename__ = "journal_sjr"
    id_sjr = db.Column(db.Integer, primary_key=True)
    rank = db.Column(db.Integer)
    id_recurso = db.Column(db.String(50))
    titulo = db.Column(db.String(300))
    tipo = db.Column(db.String(200))
    isnn = db.Column(db.String(30))
    sjr = db.Column(db.Float)
    quartil = db.Column(db.String(10))
    
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self


    def __init__(self, rank, id_recurso, titulo, tipo, isnn, sjr, quartil):
      self.rank = rank
      self.id_recurso = id_recurso
      self.titulo = titulo
      self.tipo = tipo
      self.isnn = isnn
      self.sjr = sjr
      self.quartil = quartil
    def __repr__(self):
        return '' % self.id_sjr
#db.create_all() # Para crear la tabla

