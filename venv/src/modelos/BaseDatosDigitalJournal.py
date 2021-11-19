#from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

#app = Flask(__name__)
#MySQL configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

###Models####
class BaseDatosDigitalJournal(db.Model):
    __tablename__ = "base_datos_digital_journal"
    id_base_datos_digital_journal = db.Column(db.Integer, primary_key=True)
    id_base_datos_digital = db.Column(db.Integer)
    id_journal = db.Column(db.Integer)

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(self):
      db.session.delete(self)
      db.session.commit()
      return self

    def __init__(self, id_base_datos_digital, id_journal):
        self.id_base_datos_digital = id_base_datos_digital
        self.id_journal = id_journal

    def __repr__(self):
        return '' % self.id_base_datos_digital_journal
#db.create_all() # Para crear la tabla

