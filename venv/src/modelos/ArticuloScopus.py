#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class ArticuloScopus(db.Model):
    __tablename__ = "articulo_scopus"
    id_article = db.Column(db.Integer, primary_key=True)
    Authors = db.Column(db.String(300))
    Authors_ID = db.Column(db.String(300))
    Title = db.Column(db.String(200))
    Year = db.Column(db.Integer)
    Source_Title = db.Column(db.String(100))
    Volume = db.Column(db.String(50))
    Issue = db.Column(db.String(50))
    Art_No = db.Column(db.String(100))
    Page_start = db.Column(db.String(10))
    Page_end = db.Column(db.String(10))
    Page_count = db.Column(db.String(10))
    Cited_by = db.Column(db.String(50))
    DOI = db.Column(db.String(50))
    Link = db.Column(db.String(500))
    Abstract = db.Column(db.String(1000))
    Index_Keywords = db.Column(db.String(500))
    References = db.Column(db.String(100000))
    Document_Type = db.Column(db.String(20))
    Publication_Stage = db.Column(db.String(50))
    Open_Access = db.Column(db.String(100))
    Source = db.Column(db.String(100))
    EID = db.Column(db.String(100))

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
        return '' % self.id_article
#db.create_all() # Para crear la tabla

