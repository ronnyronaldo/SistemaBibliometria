
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
#MySQL configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

###Models####
class ReferenciasErroneas(db.Model):
    __tablename__ = "referencias_erroneas"
    id = db.Column(db.Integer, primary_key=True)
    id_articleRef = db.Column(db.Integer)
    id_article_pwh = db.Column(db.Integer)
    id_article = db.Column(db.Integer)
    reference = db.Column(db.String(500))
   
    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    def __init__(self, articleRef, id_article_pwh, id_article, reference):
        self.id_articleRef = articleRef
        self.id_article_pwh  = id_article_pwh
        self.id_article = id_article
        self.reference = reference
    #def __repr__(self):
        #return '' % self.id

db.create_all() # Para crear la tabla
