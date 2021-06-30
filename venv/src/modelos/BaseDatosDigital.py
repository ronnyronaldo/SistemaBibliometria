#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class BaseDatosDigital(db.Model):
    __tablename__ = "base_datos_digital"
    id_base_datos_digital = db.Column(db.Integer, primary_key=True)
    nombre_base_datos_digital = db.Column(db.String(200))
    proveedor = db.Column(db.String(100))
    costo_actual = db.Column(db.Float)
    suscripcion_descripcion = db.Column(db.String(500))
    area_servicio = db.Column(db.String(1000))
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
        return '' % self.id_base_datos_digital
#db.create_all() # Para crear la tabla

