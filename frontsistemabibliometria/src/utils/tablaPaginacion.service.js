export const tablaPaginacionService = {
    paginacion,
    destruirTabla
};
function destruirTabla(idTabla) {
    $(idTabla).dataTable().fnDestroy(); // Se destruye la tabla para cargar los resultados
}

function paginacion(idTabla) {
    $(document).ready(function () {
        $(idTabla).DataTable({
            "ordering": false,
            language: {
                processing: "Tratamiento en curso...",
                search: "Buscar&nbsp;:",
                lengthMenu: "Agrupar _MENU_ registros",
                info: "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ registros",
                infoEmpty: "No existen datos.",
                infoFiltered: "(filtrado de _MAX_ elementos en total)",
                infoPostFix: "",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron datos con tu busqueda",
                emptyTable: "No hay datos disponibles en la tabla.",
                paginate: {
                    first: "Primero",
                    previous: "Anterior",
                    next: "Siguiente",
                    last: "Ultimo"
                },
                aria: {
                    sortAscending: ": active para ordenar la columna en orden ascendente",
                    sortDescending: ": active para ordenar la columna en orden descendente"
                }
            },
            scrollY: 300,
            lengthMenu: [[10, 25, -1], [10, 25, "All"]],
        });
    });
}