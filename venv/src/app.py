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
#Objeto ArticuloAutor
from modelos.ArticuloAutor import db
from rutas.servicio_articulo_autor import servicio_articulo_autor
#Objeto ArticuloAutor
#Objeto Autor
from modelos.Autor import db
from rutas.servicio_autor import servicio_autor
#Objeto Autor
#Objeto Categorias SJR
from modelos.CategoriasSJR import db
from rutas.servicio_categorias_sjr import servicio_categorias_sjr
#Objeto Categorias SJR
#Objeto Areas SJR
from modelos.AreaSJR import db
from rutas.servicio_area_sjr import servicio_area_sjr
#Objeto Areas SJR
#Objeto Areas SJR
from modelos.AreaCategoriaSJR import db
from rutas.servicio_area_categoria_sjr import servicio_area_categoria_sjr
#Objeto Areas SJR
from modelos.CategoriaJournalSJR import db
#Objeto Equivalencia Area Unesco
from modelos. EquivalenciaAreaUnesco import db
from rutas.servicio_equivalencia_area_unesco import servicio_equivalencia_area_unesco
#Objeto Equivalencia Area Unesco
#Objeto Equivalencia Area Unesco Frascati
from modelos. EquivalenciaAreaUnescoFrascati import db
from rutas.servicio_equivalencia_area_unesco_frascati import servicio_equivalencia_area_unesco_frascati
#Objeto Equivalencia Area Unesco Frascati
#Objeto DetalleReferencia
from modelos.DetalleReferencia import db
from rutas.servicio_detalle_referencia import servicio_detalle_referencia
#Objeto DetalleReferencia
#Objeto clustering
from rutas.servicio_clustering import servicio_clustering
#Objeto clustering
#Objeto leyBradford
from rutas.servicio_ley_bradford import servicio_ley_bradford
#Objeto leyBradford
#Objeto analisis estadistico
from rutas.servicio_analisis_estadistico import servicio_analisis_estadistico
#Objeto analisis esdistico
#Objeto Medio Publicacion Citacion
from modelos.MedioPublicacionCitacion import db
from rutas.servicio_medio_publicacion_citacion import servicio_medio_publicacion_citacion
#Objeto Medio Publicacion Citacion
#Objeto Medio Publicacion Publicacion
from modelos.MedioPublicacionPublicacion import db
from rutas.servicio_medio_publicacion_publicacion import servicio_medio_publicacion_publicacion
#Objeto Medio Publicacion Publicacion
#Objeto Medio Publicacion Busqueda
from modelos.MedioPublicacionBusqueda import db
from rutas.servicio_medio_publicacion_busqueda import servicio_medio_publicacion_busqueda
#Objeto Medio Publicacion Busqueda
#Objeto Parametro
from modelos.Parametro import db
from rutas.servicio_parametro import servicio_parametro
#Objeto Parametro
#Objeto SJR
from modelos.SJR import db
from rutas.servicio_sjr import servicio_sjr
#Objeto SJR
#Objeto Journal
from modelos.Journal import db
from rutas.servicio_journal import servicio_journal
#Objeto Journal
#Objeto Estadisticas Journal
from modelos.EstadisticasJournal import db
#Objeto Estadisticas Journal
#Objeto Resumen Medios Publicacion
from modelos.ResumenMediosPublicacion import db
from rutas.servicio_resumen_medios_publicacion import servicio_resumen_medios_publicacion
#Objeto Resumen Medios Publicacion
#Objeto Base Datos Digital Journal
from modelos. BaseDatosDigitalJournal import db
from rutas.servicio_estadisticas_journal import servicio_estadisticas_journal
#Objeto Base Datos Digital Journal
#Configuracion de la aplicacion y de la base de datos

#MySQL configurations
app = Flask(__name__)
CORS(app, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], supports_credentials=True)
app.config.from_object('config')
db.init_app(app)
migrate = Migrate(app, db)
# Fin de la configuracion

# Registrar los objetos para poder navegar
app.register_blueprint(servicio_articulo, url_prefix='/articulo')
app.register_blueprint(servicio_articulo_autor, url_prefix='/articuloAutor')
app.register_blueprint(servicio_autor, url_prefix='/autor')
app.register_blueprint(servicio_referencia, url_prefix='/referencia')
app.register_blueprint(servicio_base_datos_digital, url_prefix='/baseDatosDigital')
app.register_blueprint(servicio_medio_publicacion, url_prefix='/medioPublicacion')
app.register_blueprint(servicio_estadisticas_uso, url_prefix='/estadisticasUso') 
app.register_blueprint(servicio_estadisticas_journal, url_prefix='/estadisticasJournal') 
app.register_blueprint(servicio_area_frascati, url_prefix='/areaFrascati') 
app.register_blueprint(servicio_area_unesco, url_prefix='/areaUnesco') 
app.register_blueprint(servicio_area_sjr, url_prefix='/areaSJR') 
app.register_blueprint(servicio_categorias_sjr, url_prefix='/categoriasSJR') 
app.register_blueprint(servicio_area_categoria_sjr, url_prefix='/areaCategoriaSJR') 
app.register_blueprint(servicio_equivalencia_area_unesco, url_prefix='/equivalenciaAreaUnesco') 
app.register_blueprint(servicio_equivalencia_area_unesco_frascati, url_prefix='/equivalenciaAreaUnescoFrascati') 
app.register_blueprint(servicio_articulo_scopus, url_prefix='/articuloScopus')
app.register_blueprint(servicio_clustering, url_prefix='/cluster')
app.register_blueprint(servicio_detalle_referencia, url_prefix='/detalleReferencia')
app.register_blueprint(servicio_ley_bradford, url_prefix='/leyBradford')
app.register_blueprint(servicio_analisis_estadistico, url_prefix='/analisisEstadistico')
app.register_blueprint(servicio_medio_publicacion_citacion, url_prefix='/medioPublicacionCitacion')
app.register_blueprint(servicio_medio_publicacion_publicacion, url_prefix='/medioPublicacionPublicacion')
app.register_blueprint(servicio_medio_publicacion_busqueda, url_prefix='/medioPublicacionBusqueda')
app.register_blueprint(servicio_resumen_medios_publicacion, url_prefix='/resumenMediosPublicacion')
app.register_blueprint(servicio_parametro, url_prefix='/parametro')
app.register_blueprint(servicio_sjr, url_prefix='/sjr')
app.register_blueprint(servicio_journal, url_prefix='/journal')

# Correr la aplicacion
app.run()
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()
"""@app.teardown_request
def checkin_db(exc):
    db.session.remove()"""


