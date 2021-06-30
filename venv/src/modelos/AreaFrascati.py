#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class AreaFrascati(db.Model):
    __tablename__ = "area_frascati_especifico"
    id_area_frascati = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(100))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
      
    """def __init__(self,title,productDescription,productBrand,price):
        self.title = title
        self.productDescription = productDescription
        self.productBrand = productBrand
        self.price = price"""
    def __repr__(self):
        return '' % self.id_area_frascati
#db.create_all() # Para crear la tabla

