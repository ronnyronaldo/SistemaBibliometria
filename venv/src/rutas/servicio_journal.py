from flask import Blueprint
from flask import request
from controladores.JournalController import insertarJournalScienceDirect, listaJournalPorBaseDatosDigital, insertarJournalEbsco, insertarJournalScopus
servicio_journal =  Blueprint('servicio_journal', __name__)
@servicio_journal.route('/insertarScienceDirect', methods=['POST']) 
def insertar():
    nuevoRegistroJournal= request.json #Obtengo los datos de los nuevos registros del Journal
    return insertarJournalScienceDirect(nuevoRegistroJournal)

@servicio_journal.route('/insertarEbsco', methods=['POST'])
def insertarEbsco():
    nuevoRegistroJournal= request.json #Obtengo los datos de los nuevos registros del Journal
    return insertarJournalEbsco(nuevoRegistroJournal)

@servicio_journal.route('/insertarScopus', methods=['POST'])
def insertarScopus():
    nuevoRegistroJournal= request.json #Obtengo los datos de los nuevos registros del Journal
    return insertarJournalScopus(nuevoRegistroJournal)

@servicio_journal.route('/listarPorBaseDatosDigital/<int:id_base_datos_digital>', methods=['GET']) 
def listarRegistrosJournal(id_base_datos_digital):
    return listaJournalPorBaseDatosDigital(id_base_datos_digital)

