import sys
sys.path.append("src")
from app import app, mysql, cur, consulta_select
from flask import request, jsonify

# Get principal para ver y documentar el estado de la API
@app.route('/', methods=['GET'])
def home():
    return '''<h1>API REST en Flask para desarrolo de tesis bibliometria</h1>
<p>A Estado de la API: metodo get y get con filtrado por id de articulo.</p>'''

# Get para recuperar todos los articulos
@app.route('/scopus', methods=['GET'])
def scopus():
    consulta_select
    r = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify({'Articulos de Scopus' : r})

# Get para recuper un articulo mediante un id
@app.route('/scopus/busqueda', methods=['GET'])
def api_busqueda():
    # Con esto se filtrara para obtener un articulo por su id.
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return "Error: No se ha especificado por que parametro desea buscar. Por Favor ingrese ej id=1."

    consulta_select
    bd = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    # Se crea una lista vacia para los resultados obtenidos
    resultados = []
    # El id es unico pero se retornan todos los elemnetos con ese id
    for id_ar in bd:
        if id_ar['id_article'] == id:
            resultados.append(id_ar)
    # Con jsonify convertimos nuestro diccionario en JSON
    return jsonify(resultados)