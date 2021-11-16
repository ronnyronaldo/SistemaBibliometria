#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class EquivalenciaAreaUnesco(db.Model):
    __tablename__ = "equivalencia_area_unesco"
    id_equivalencia_area = db.Column(db.Integer, primary_key=True)
    id_area_unesco = db.Column(db.Integer)
    id_area_sjr = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def delete(equivalenciaAreas):
      db.session.delete(equivalenciaAreas)
      db.session.commit()
      return equivalenciaAreas
      
    def __init__(self, id_area_unesco, id_area_sjr):
      self.id_area_unesco = id_area_unesco
      self.id_area_sjr = id_area_sjr

    def __repr__(self):
        return '' % self.id_equivalencia_area
#db.create_all() # Para crear la tabla

