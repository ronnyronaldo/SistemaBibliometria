from flask import Flask, render_template
from flask_migrate import Migrate
#Objeto Producto
from modelos.Product import db
from rutas.product_bp import product_bp
#Objeto Producto
#Configuracion de la aplicacion y de la base de datos
app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)
migrate = Migrate(app, db)
# Fin de la configuracion

# Registrar los objetos para poder navegar
app.register_blueprint(product_bp, url_prefix='/product')

# Correr la aplicacion
app.run()

