from flask import Blueprint
from controladores.ReferenciaController import listaReferenciasPorIdArticulo
servicio_referencia= Blueprint('servicio_referencia', __name__)
@servicio_referencia.route('/listarReferenciasPorIdArticulo/<int:id_articulo>', methods=['GET']) 
def listarReferenciasPorIdArticulo(id_articulo):
    return listaReferenciasPorIdArticulo(id_articulo)
