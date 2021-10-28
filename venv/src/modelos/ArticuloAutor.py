#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class ArticuloAutor(db.Model):
    __tablename__ = "articulo_autor"
    id_articulo_autor = db.Column(db.Integer, primary_key=True)
    id_articulo = db.Column(db.Integer)
    id_autor = db.Column(db.String(50))
    orden_autor = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(autor):
      db.session.delete(autor)
      db.session.commit()
      return autor
      
    def __init__(self, id_articulo, id_autor, orden_autor):
      self.id_articulo = id_articulo
      self.id_autor = id_autor
      self.orden_autor = orden_autor

    def __repr__(self):
        return '' % self.id_articulo_autor
#db.create_all() # Para crear la tabla

