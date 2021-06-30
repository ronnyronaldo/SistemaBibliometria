#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class Referencia(db.Model):
    __tablename__ = "referencia"
    id_referencia = db.Column(db.Integer, primary_key=True)
    id_articulo = db.Column(db.Integer)
    referencia = db.Column(db.String(1000))
    
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
        return '' % self.id_referencia
#db.create_all() # Para crear la tabla

