
#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class DetalleReferencia(db.Model):
    __tablename__ = "detalle_referencia"
    id_detalle_referencia = db.Column(db.Integer, primary_key=True)
    id_referencia = db.Column(db.Integer)
    container_type = db.Column(db.String(200))
    source = db.Column(db.String(200))
    filled = db.Column(db.String(30))
    gsrank = db.Column(db.String(30))
    pub_url =  db.Column(db.String(600))
    author_id =  db.Column(db.String(400))
    num_citations = db.Column(db.Integer)
    url_scholarbib = db.Column(db.String(600))
    url_add_sclib = db.Column(db.String(600))
    citedby_url = db.Column(db.String(600))
    url_related_articles = db.Column(db.String(600))
    title = db.Column(db.String(350))
    author = db.Column(db.String(350))
    pub_year = db.Column(db.Integer)
    venue = db.Column(db.String(100))
    abstract = db.Column(db.String(350))
  
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self

    def __init__(self, id_referencia, container_type, source, filled, gsrank, pub_url, author_id, num_citations, url_scholarbib, url_add_sclib, citedby_url, url_related_articles, title, author, pub_year, venue, abstract):
      self.id_referencia  = id_referencia 
      self.container_type = container_type
      self.source = source 
      self.filled = filled
      self.gsrank = gsrank 
      self.pub_url =  pub_url 
      self.author_id =  author_id
      self.num_citations = num_citations
      self.url_scholarbib = url_scholarbib 
      self.url_add_sclib = url_add_sclib
      self.citedby_url = citedby_url
      self.url_related_articles = url_related_articles
      self.title = title
      self.author = author
      self.pub_year = pub_year 
      self.venue = venue
      self.abstract = abstract
    #def __repr__(self):
        #return '' % self.id

#db.create_all() # Para crear la tabla
