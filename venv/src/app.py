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
#Objeto Estadisticas de Uso
from modelos.EstadisticasUso import db
from rutas.servicio_estadisticas_uso import servicio_estadisticas_uso
#Objeto Estadisticas de Uso
#Objeto AreaUnesco
from modelos.AreaUnesco import db
from rutas.servicio_area_unesco import servicio_area_unesco
#Objeto AreaUnesco
#Objeto AreaFrascati
from modelos.AreaFrascati import db
from rutas.servicio_area_frascati import servicio_area_frascati
#Objeto AreaFrascati
#Objeto Articulo Scopus
from modelos.ArticuloScopus import db
from rutas.servicio_articulo_scopus import servicio_articulo_scopus
#Objeto Articulo Scopus
#Objeto clustering
from rutas.servicio_clustering import servicio_clustering
#Objeto clustering
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
CORS(app, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], supports_credentials=True)
app.config.from_object('config')
db.init_app(app)
migrate = Migrate(app, db)
# Fin de la configuracion

# Registrar los objetos para poder navegar
app.register_blueprint(servicio_articulo, url_prefix='/articulo')
app.register_blueprint(servicio_referencia, url_prefix='/referencia')
app.register_blueprint(servicio_base_datos_digital, url_prefix='/baseDatosDigital')
app.register_blueprint(servicio_medio_publicacion, url_prefix='/medioPublicacion')
app.register_blueprint(servicio_estadisticas_uso, url_prefix='/estadisticasUso') 
app.register_blueprint(servicio_area_frascati, url_prefix='/areaFrascati') 
app.register_blueprint(servicio_area_unesco, url_prefix='/areaUnesco') 
app.register_blueprint(servicio_articulo_scopus, url_prefix='/articuloScopus')
app.register_blueprint(servicio_clustering, url_prefix='/cluster')

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


