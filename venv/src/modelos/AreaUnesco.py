#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class AreaUnesco(db.Model):
    __tablename__ = "area_unesco_específico"
    id_area_unesco = db.Column(db.Integer, primary_key=True)
    descripcion_unesco = db.Column(db.String(100))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(areaUnesco):
      db.session.delete(areaUnesco)
      db.session.commit()
      return areaUnesco
      
    def __init__(self, descripcion_unesco):
      self.descripcion_unesco = descripcion_unesco

    def __repr__(self):
        return '' % self.id_area_unesco
#db.create_all() # Para crear la tabla

