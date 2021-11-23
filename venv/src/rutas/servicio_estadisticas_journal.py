from flask import Blueprint
from flask import request
from controladores.EstadisticasJournalController import insertarEstadisticasJournal, buscarEstadisticasJournalPorId, eliminarEstadisticasJournal
from controladores.EstadisticasJournalController import  insertarEstadisticasJournalScienceDirect
servicio_estadisticas_journal= Blueprint('servicio_estadisticas_journal', __name__)

@servicio_estadisticas_journal.route('/insertar', methods=['POST']) 
def insertar():
    nuevoEstadisticasUso = request.json #Obtengo los datos de las estadísticas de uso para el Nuevo Ingreso
    return insertarEstadisticasJournal(nuevoEstadisticasUso)

@servicio_estadisticas_journal.route('/buscarEstadisticasJournalaPorId/<int:id_base_datos_digital>/<int:id_journal>', methods=['GET']) 
def listarEstadisticasJournalPorId(id_base_datos_digital, id_journal):
    return buscarEstadisticasJournalPorId(id_base_datos_digital, id_journal)

@servicio_estadisticas_journal.route('/eliminar/<int:id_estadisticas_journal>', methods=['GET']) 
def eliminarEstadisticasJournalPorId(id_estadisticas_journal):
    return eliminarEstadisticasJournal(id_estadisticas_journal)

@servicio_estadisticas_journal.route('/insertarEstadisticasScienceDirect', methods=['POST']) 
def insertarEstadisticas():
    nuevoRegistroJournal= request.json #Obtengo los datos de los nuevos registros del Journal
    return insertarEstadisticasJournalScienceDirect(nuevoRegistroJournal)



