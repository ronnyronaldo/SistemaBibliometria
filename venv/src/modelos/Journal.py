#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class Journal(db.Model):
    __tablename__ = "journal"
    id_journal = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200))
    id_base_datos_digital = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(journal):
      db.session.delete(journal)
      db.session.commit()
      return journal

    def __init__(self, titulo, id_base_datos_digital):
        self.titulo = titulo
        self.id_base_datos_digital = id_base_datos_digital

    def __repr__(self):
        return '' % self.id_journal
#db.create_all() # Para crear la tabla

