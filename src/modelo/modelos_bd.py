from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

# MySQL configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/bd_tesis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


class scopus(db.Model):
    id_article = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.Integer)
    date_from = db.Column(db.Date)
    date_to = db.Column(db.Date)
    Authors = db.Column(db.String(1000))
    Authors_ID = db.Column(db.String(500))
    Title = db.Column(db.String(1000))
    Year = db.Column(db.Integer)
    Source_Title = db.Column(db.String(1000))
    Volume = db.Column(db.String(1000))
    Issue = db.Column(db.String(1000))
    Art_No = db.Column(db.String(14))
    Cited_by = db.Column(db.Integer)
    DOI = db.Column(db.String(100))
    Link = db.Column(db.String(500))
    Abstract = db.Column(db.String(5000))
    Index_Keywords = db.Column(db.String(5000))
    References = db.Column(db.String(5000))
    Document_Type = db.Column(db.String(20))
    Publication_Stage = db.Column(db.String(20))
    Open_Access = db.Column(db.String(35))
    Source = db.Column(db.String(20))
    EID = db.Column(db.String(20))
    def __repr__(self):
        super().__repr__()

db.create_all()