from flask import Blueprint
from flask import request
from controladores.JournalController import insertarJournalScienceDirect, listaJournal
servicio_journal =  Blueprint('servicio_journal', __name__)
@servicio_journal.route('/insertarScienceDirect', methods=['POST']) 
def insertar():
    nuevoRegistroJournal= request.json #Obtengo los datos de los nuevos registros del Journal
    return insertarJournalScienceDirect(nuevoRegistroJournal)

@servicio_journal.route('/listar', methods=['GET']) 
def listarRegistrosJournal():
    return listaJournal()

