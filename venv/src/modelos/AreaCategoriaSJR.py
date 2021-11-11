#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class AreaCategoriaSJR(db.Model):
    __tablename__ = "area_categoria_sjr"
    id_area_categoria_sjr = db.Column(db.Integer, primary_key=True)
    id_area_sjr = db.Column(db.Integer)
    id_categoria_sjr = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def delete(areaCategoriaSJR):
      db.session.delete(areaCategoriaSJR)
      db.session.commit()
      return areaCategoriaSJR
      
    def __init__(self, id_area_sjr, id_categoria_sjr):
      self.id_area_sjr = id_area_sjr
      self.id_categoria_sjr = id_categoria_sjr

    def __repr__(self):
        return '' % self.id_area_categoria_sjr 
#db.create_all() # Para crear la tabla

