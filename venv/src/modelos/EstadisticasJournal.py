#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class EstadisticasJournal(db.Model):
    __tablename__ = "estadisticas_journal"
    id_estadisticas_journal = db.Column(db.Integer, primary_key=True)
    id_base_datos_digital = db.Column(db.Integer)
    id_journal = db.Column(db.Integer)
    año = db.Column(db.Integer)
    mes = db.Column(db.String(45))
    numero_busquedas = db.Column(db.Integer)
    id_mes= db.Column(db.Integer)
   
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(estadisticas_journal):
      db.session.delete(estadisticas_journal)
      db.session.commit()
      return estadisticas_journal

    def __init__(self, id_base_datos_digital, id_journal, año, mes, numero_busquedas, id_mes):
        self.id_base_datos_digital = id_base_datos_digital
        self.id_journal= id_journal
        self.año = año
        self.mes = mes
        self.numero_busquedas = numero_busquedas
        self.id_mes = id_mes

    def __repr__(self):
        return '' % self.id_estadisticas_journal
#db.create_all() # Para crear la tabla

