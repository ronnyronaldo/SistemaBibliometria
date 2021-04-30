import flask
from flaskext.mysql import MySQL

app = flask.Flask(__name__)


# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'bd_tesis'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.config["DEBUG"] = True
mysql = MySQL(app)



from controlador.controlador import *

if __name__=='__main__':
    app.run(debug=True)