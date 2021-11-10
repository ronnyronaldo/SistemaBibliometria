#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class AreaSJR(db.Model):
    __tablename__ = "area_sjr"
    id_area_sjr = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def delete(areaSJR):
      db.session.delete(areaSJR)
      db.session.commit()
      return areaSJR
      
    def __init__(self, nombre):
      self.nombre = nombre

    def __repr__(self):
        return '' % self.id_area_sjr
#db.create_all() # Para crear la tabla

