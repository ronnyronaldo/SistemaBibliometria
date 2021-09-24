from flask import Blueprint
from flask import request
from controladores.SJRController import insertarSJR, listaSJR
servicio_sjr =  Blueprint('servicio_sjr', __name__)
@servicio_sjr.route('/insertar', methods=['POST']) 
def insertar():
    nuevoRegistroSJR= request.json #Obtengo los datos de los nuevos registros del SJR
    return insertarSJR(nuevoRegistroSJR)

@servicio_sjr.route('/listar', methods=['GET']) 
def listarRegistrosSJR():
    return listaSJR()

