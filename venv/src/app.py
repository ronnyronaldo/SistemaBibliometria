from flask import Flask, render_template
from flask_migrate import Migrate
from flask_cors import CORS
#Objeto Articulo Latindex y Scopus
from modelos.Articulo import db
from rutas.servicio_articulo import servicio_articulo
#Objeto Articulo
#Objeto Referencia
from modelos.Referencia import db
from rutas.servicio_referencia import servicio_referencia
#Objeto Referencia
#Objeto BaseDatosDigital
from modelos.BaseDatosDigital import db
from rutas.servicio_base_datos_digital import servicio_base_datos_digital
#Objeto BaseDatosDigital
#Objeto Medio de Publicacion
from modelos.MedioPublicacion import db
from rutas.servicio_medio_publicacion import servicio_medio_publicacion
#Objeto Medio de Publicacion
#Objeto Articulo
from modelos.ArticuloScopus import db
from rutas.articulo_bp import articulo_bp
#Objeto Articulo
#Objeto ArticuloReferencias
from modelos.ArticuloReferenciaScopus import db
from rutas.articuloReferencia_bp import articuloReferencia_bp
#Objeto ArticuloReferencias
#Objeto Referencia
from modelos.DetalleReferenciaScopus import db
from rutas.referencia_bp import referencia_bp
#Objeto Referencia
#Objeto ReferenciaCompleta
from modelos.ReferenciaCorrectaScopus import db
#Objeto ReferenciaCompleta
#Objeto ReferenciaNoEncontradas
from modelos.ReferenciaNoEncontradaScopus import db
#Objeto ReferenciasNoEncontradas
#Objeto ReferenciaErroneas
from modelos.ReferenciaErroneaScopus import db
#Objeto ReferenciasErronas
#Configuracion de la aplicacion y de la base de datos
app = Flask(__name__)
CORS(app)
app.config.from_object('config')
db.init_app(app)
migrate = Migrate(app, db)
# Fin de la configuracion

# Registrar los objetos para poder navegar
app.register_blueprint(servicio_articulo, url_prefix='/articulo')
app.register_blueprint(servicio_referencia, url_prefix='/referencia')
app.register_blueprint(servicio_base_datos_digital, url_prefix='/baseDatosDigital')
app.register_blueprint(servicio_medio_publicacion, url_prefix='/medioPublicacion')
app.register_blueprint(articulo_bp, url_prefix='/articuloScopus')
app.register_blueprint(articuloReferencia_bp, url_prefix='/referencia')
app.register_blueprint(referencia_bp, url_prefix='/referenciaDetalle')

# Correr la aplicacion
app.run()
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()
"""@app.teardown_request
def checkin_db(exc):
    db.session.remove()"""


