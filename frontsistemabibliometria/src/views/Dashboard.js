import React from "react";
import ChartistGraph from "react-chartist";
import { publicacionService } from '../_services/publicacion.service';
import { referenciaService } from '../_services/referencia.service';
import { leyBradfordService } from '../_services/ley_bradford.service';
import { detalleReferenciaService } from '../_services/detalle_referencia.service';
import { clusteringService } from '../_services/clustering.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { medioPublicacionService } from '../_services/medio_publicacion.service';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
/**Spinner */
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
import { Link } from "react-router-dom";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: #212F3C;
`;
/**Spinner */

// * libreria highcharts
// * libreria
import * as Highcharts from 'highcharts';
// * mensaje de visualizacion cuando no existe la data
import noData from 'highcharts/modules/no-data-to-display';
// * para exportar como imagenes
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data.js';
import more from 'highcharts/highcharts-more.js'
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
more(Highcharts);

Highcharts.setOptions({
  lang: {
    downloadJPEG: 'Descargar como JPEG',
    downloadPDF: 'Descargar como PDF',
    downloadPNG: 'Descargar como PNG',
    downloadSVG: 'Descargar como SVG',
    viewFullscreen: 'Ver pantalla completa',
    printChart: 'Imprimir',
    exitFullscreen: 'Salir de pantalla completa',
    downloadCSV: 'Descargar como csv',
    downloadXLS: 'Descargar como xlsx',
    viewData: 'Mostrar datos',
    hideData: 'Ocultar datos'
  }
});
// ! fin libreria highcharts

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Dashboard() {


  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [datoReferencia, setDatoReferencia] = React.useState({
    idArticulo: 0,
    referencia: ""
  });
  const [opcionGrafico, setOpcionGrafico] = React.useState('OA');
  const notify = (place, mensaje, type) => {
    //var color = Math.floor(Math.random() * 5 + 1);
    //var type = "danger";
    /*switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }*/
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {mensaje}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const [numeroPublicaciones, setNumeroPublicaciones] = React.useState(0);
  const [numeroPublicacionesSinReferencias, setNumeroPublicacionesSinReferencias] = React.useState(0);
  const [numeroReferencias, setNumeroReferencias] = React.useState(0);
  const [numeroDetalleReferencias, setNumeroDetalleReferencias] = React.useState(0);
  const [numeroOrdenAutor, setnumeroOrdenAutor] = React.useState("");
  const [redesAreas, setRedesAreas] = React.useState("");
  const [redesAreasOrden, setRedesAreasOrden] = React.useState("");
  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [grafo, setGrafo] = React.useState([]);
  const [datosLeyBradford, setDatosLeyBradford] = React.useState([]);
  const handleCargarTotalesArticulosReferencias = () => {
    setLoading(true)
    publicacionService.numeroArticulosIngresados().then(value => {
      setNumeroPublicaciones(value.totalArticulos);
      setLoading(false)
    })

    setLoading(true)
    publicacionService.numeroArticulosNoTienenReferencias().then(value => {
      setNumeroPublicacionesSinReferencias(value.numeroArticulosNoTienenReferencias);
      setLoading(false)
    })

    setLoading(true)
    referenciaService.numeroReferencias().then(value => {
      setNumeroReferencias(value.numeroReferenciasIngresadas);
      setLoading(false)
    })

    setLoading(true)
    detalleReferenciaService.numeroDetalleReferencia().then(value => {
      setNumeroDetalleReferencias(value.numeroDetalleReferenciaIngresadas);
      setLoading(false)
    })
  }

  async function handleCargarRedesDeAutores() {
    setLoading(true)
    let orden_autor = document.getElementById("idOrdenAutor").value;
    await clusteringService.ejecutarclusteringRedesAutores(orden_autor).then(value => {
      setnumeroOrdenAutor(value.valorimagen);
      setLoading(false)
    });
  }

  async function handleCargarRedesDeAutoresAreas() {
    setLoading(true)
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnescoGrafo").value);
    await clusteringService.ejecutarclusteringRedesAutoresAreas(idAreaUnesco).then(value => {
      setRedesAreas(value.valorimagenarea);
      setLoading(false)
    });
  }

  function graficarGrafo(primerAutor, segundoAutor, tercerAutor, cuartoAutor, quintoAutor) {

    Highcharts.chart('redes-autores-grafo', {
      chart: {
        type: 'packedbubble',
        height: '100%'
      },
      title: {
        text: 'Número de publicaciones por autor distribuidos por orden de autor'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value} Pub'
      },
      plotOptions: {
        packedbubble: {
          minSize: '30%',
          maxSize: '120%',
          zMin: 0,
          zMax: 10,
          layoutAlgorithm: {
            splitSeries: false,
            gravitationalConstant: 0.02
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 3
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{ name: 'Pimer Autor', data: primerAutor },
      { name: 'Segundo Autor', data: segundoAutor },
      { name: 'Tercer Autor', data: tercerAutor },
      { name: 'Cuarto Autor', data: cuartoAutor },
      { name: 'Quinto Autor', data: quintoAutor }

      ]
    });

  }

  function graficarGrafoT(muyBaja, baja, moderada, alta) {

    Highcharts.chart('redes-autores-grafo-total', {
      chart: {
        type: 'packedbubble',
        height: '70%'
      },
      title: {
        text: 'Número de publicaciones totales por autor'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value} Pub'
      },
      plotOptions: {
        packedbubble: {
          minSize: '30%',
          maxSize: '120%',
          zMin: 0,
          zMax: 30,
          layoutAlgorithm: {
            gravitationalConstant: 0.00,
            splitSeries: false/*,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true*/
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 7
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{ name: 'Entre 1 y 5 Pub', data: muyBaja },
      { name: 'Entre 6 y 10 Pub', data: baja },
      { name: 'Entre 11 y 16 Pub', data: moderada },
      { name: 'De 17 Pub en adelante', data: alta }]
    });

  }

  async function handleCargarRedesDeAutoresAreasOrden() {
    setLoading(true)
    let orden_autor = document.getElementById("idOrdenAutor").value;
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnescoGrafo").value);
    await clusteringService.ejecutarclusteringRedesAutoresAreasOrden(orden_autor, idAreaUnesco).then(value => {
      setRedesAreasOrden(value.valorimagenarea);
      setLoading(false)
    });

  }

  /** Carga las areas frascati para el filtro*/
  async function handleAreasFrascati() {
    setLoading(true);
    await areaFrascatiService.listaAreasFrascati().then(value => {
      setAreasFrascati(value.area_frascati);
      setLoading(false);
    });
  }
  /**Carga las areas unesco para el filtro */
  async function handleAreasUnesco() {
    setLoading(true);
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
  }
  /**Carga los datos para la red de autores */
  async function handleGrafoOrdenAutor() {
    setLoading(true);

    await clusteringService.ejecutarDatosChart().then(value => {
      let objeto = JSON.parse(value);
      let nombres = objeto.nombre;
      let orden = objeto.orden_autor;
      let numeros = objeto.num_pub;
      let listaAutores = Object.values(nombres)
      let listaOrdenAutores = Object.values(orden)
      let listaNumPub = Object.values(numeros)
      let listaPrimerAutor = [];
      let listaSegundoAutor = [];
      let listaTercerAutor = [];
      let listaCuartoAutor = [];
      let listaQuintoAutor = [];
      // Aqui se cambia la longitud de los autores para no tener delay en la vista
      let longitud = (listaAutores.length) / 4;
      for (let i = 0; i < longitud; i++) {
        if (listaOrdenAutores[i] == 1) {
          let primerAutor = { "name": listaAutores[i], "value": listaNumPub[i] }
          listaPrimerAutor.push(primerAutor);
        }
        if (listaOrdenAutores[i] == 2) {
          let segundoAutor = { "name": listaAutores[i], "value": listaNumPub[i] }
          listaSegundoAutor.push(segundoAutor);
        }
        if (listaOrdenAutores[i] == 3) {
          let tercerAutor = { "name": listaAutores[i], "value": listaNumPub[i] }
          listaTercerAutor.push(tercerAutor);
        }
        if (listaOrdenAutores[i] == 4) {
          let cuartoAutor = { "name": listaAutores[i], "value": listaNumPub[i] }
          listaCuartoAutor.push(cuartoAutor);
        }
        if (listaOrdenAutores[i] == 5) {
          let quintoAutor = { "name": listaAutores[i], "value": listaNumPub[i] }
          listaQuintoAutor.push(quintoAutor);
        }

      }

      // setNombreCluster(nombre_cluster);
      // setTotalClusterCuartilFI(totales);
      // setDetalleDatosClusterCuartilFI(value)

      // setGrafo(listaPrimerAutor);
      graficarGrafo(listaPrimerAutor, listaSegundoAutor, listaTercerAutor, listaCuartoAutor, listaQuintoAutor);
      setLoading(false);
    });
  }

  /**Carga los datos para la red de autores */
  async function handleGrafoTotalPublicaciones() {
    setLoading(true);
    await clusteringService.ejecutarDatosChartTotalAutores().then(value => {
      let objeto = JSON.parse(value);
      let nombres = objeto.nombre;
      let numeros = objeto.total_pub;
      let listaAutores = Object.values(nombres)
      let listaTotalPub = Object.values(numeros)
      let muyBaja = [];
      let baja = [];
      let moderada = [];
      let alta = [];

      // Aqui se cambia la longitud de los autores para no tener delay en la vista
      let longitud = (listaAutores.length);
      for (let i = 0; i < longitud; i++) {
        if (listaTotalPub[i] >= 2 && listaTotalPub[i] <= 5) {
          let muyBajoAutor = { "name": listaAutores[i], "value": listaTotalPub[i] }
          muyBaja.push(muyBajoAutor);
        }
        if (listaTotalPub[i] >= 6 && listaTotalPub[i] <= 10) {
          let bajoAutor = { "name": listaAutores[i], "value": listaTotalPub[i] }
          baja.push(bajoAutor);
        }
        if (listaTotalPub[i] >= 11 && listaTotalPub[i] <= 16) {
          let moderadoAutor = { "name": listaAutores[i], "value": listaTotalPub[i] }
          moderada.push(moderadoAutor);
        }
        if (listaTotalPub[i] >= 17) {
          let altoAutor = { "name": listaAutores[i], "value": listaTotalPub[i] }
          alta.push(altoAutor);
        }
      }

      // setNombreCluster(nombre_cluster);
      // setTotalClusterCuartilFI(totales);
      // setDetalleDatosClusterCuartilFI(value)

      // setGrafo(listaPrimerAutor);
      graficarGrafoT(muyBaja, baja, moderada, alta);
      setLoading(false);
    });
  }

  async function handleCalcularPrcentajesLeyBradford(datos) {
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCitas = 0;
    for (var i = 0; i < datos.length; i++) {
      totalCitas = totalCitas + datos[i].contador;
    }

    for (var i = 0; i < datos.length; i++) {
      suma = suma + datos[i].contador;
      let dato = {
        "id_referencia": datos[i].id_referencia,
        "venue": datos[i].venue,
        "contador": datos[i].contador,
        "numeroAcumuladoCitas": suma,
        "procentajeAcumuladoCitas": (suma / totalCitas * 100).toFixed(2)
      }
      datosYPorcentajes.push(dato);
    }
    //console.log(datosYPorcentajes)
    await setDatosLeyBradford(datosYPorcentajes);
    return datosYPorcentajes;
  }

  async function handleCalcularPrcentajesLeyBradfordInternas(datos) {
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCitas = 0;
    for (var i = 0; i < datos.length; i++) {
      totalCitas = totalCitas + datos[i].contador;
    }

    for (var i = 0; i < datos.length; i++) {
      suma = suma + datos[i].contador;
      let dato = {
        "id_referencia": datos[i].id_articulo,
        "venue": datos[i].medioPublicacion,
        "contador": datos[i].contador,
        "numeroAcumuladoCitas": suma,
        "procentajeAcumuladoCitas": (suma / totalCitas * 100).toFixed(2)
      }
      datosYPorcentajes.push(dato);
    }
    //console.log(datosYPorcentajes)
    await setDatosLeyBradford(datosYPorcentajes);
    return datosYPorcentajes;
  }


  async function handleCargarDatosLeyBradford() {
    setDatosLeyBradford([]);
    let idAnioDesde = parseInt(document.getElementById("idAnioDesde").value);
    let idAnioHasta = parseInt(document.getElementById("idAnioHasta").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);
    let idPublicacionCorrespondiente = document.getElementById("idPublicacionCorrespondiente").value;

  
    if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacion().then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacion().then(value => {
          console.log(value);
          setLoading(false);
        });
      });
      
      /*
      setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionesReferencias().then(async (value) => {
        await handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAnio(idAnioDesde, idAnioHasta).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAnio(idAnioDesde, idAnioHasta).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

      /*setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionesReferenciasPorAnio(idAnioDesde, idAnioHasta).then(async (value) => {
        await handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascati(idAreaFrascati).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascati(idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

      /*setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaFrascati(idAreaFrascati).then(async (value) => {
        await handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnesco(idAreaUnesco).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnesco(idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

      /*setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaUnesco(idAreaUnesco).then(async (value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

      /*setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async (value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

      /*setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async (value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })*/
    }
    else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
      notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
    }
    /*
      if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionesPropios().then(async (value) => {
          await handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      }
      else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionesPropiosPorAnio(idAnioDesde, idAnioHasta).then(async (value) => {
          await handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      }
      else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionPropiosPorAreaFrascati(idAreaFrascati).then(async (value) => {
          await handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      }
      else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionPropiosPorAreaUnesco(idAreaUnesco).then(async (value) => {
          handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      }
      else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionPropiosPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async (value) => {
          handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      }
      else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
        setLoading(true)
        await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
        await leyBradfordService.numeroMediosPublicacionPropiosPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async (value) => {
          handleCalcularPrcentajesLeyBradfordInternas(value.numeroMediosPublicacion)
          await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
          setLoading(false)
        })
      } else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
        notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
      }
    } else {
      notify("tr", 'Seleccione a que Publicaciones aplicar la Ley de Bradford', "danger");
    }*/

  }

  async function handleCargarDatosGraficosBurbujas() {
    let opcionGraficoBurbujas = document.getElementById("OpcionesGarficoBurbujas").value;
    if (opcionGraficoBurbujas == 'OA') {
      setOpcionGrafico('OA');
      handleGrafoOrdenAutor();
    }

    if (opcionGraficoBurbujas == 'NP') {
      setOpcionGrafico('NP');
      handleGrafoTotalPublicaciones();
    }
  }

  React.useEffect(() => {
    // document.getElementById("idOrdenAutor").value=1;
    // document.getElementById("idAreaUnescoGrafo").value=1;
    handleCargarTotalesArticulosReferencias();
    // handleCargarRedesDeAutores();
    handleAreasUnesco();
    handleAreasFrascati();
    handleGrafoOrdenAutor();
    // handleCargarRedesDeAutoresAreas();
    // handleCargarRedesDeAutoresAreasOrden();
  }, []);
  return (
    <>
      <FadeLoader loading={loading} css={override} size={50} />
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-copy-04 text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL PUBLICACIONES</p>
                      <Card.Title as="h4">{numeroPublicaciones + "  (100%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-align-center text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL PUBLICACIONES SIN REFERENCIAS</p>
                      <Card.Title as="h4">{numeroPublicacionesSinReferencias + " (" + parseFloat(numeroPublicacionesSinReferencias * 100 / numeroPublicaciones).toFixed(2) + "%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bullet-list-67 text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL REFERENCIAS</p>
                      <Card.Title as="h4">{numeroReferencias + "  (100%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-notes text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL DETALLE REFERENCIAS</p>
                      <Card.Title as="h4">{numeroDetalleReferencias + "  (" + parseFloat(numeroDetalleReferencias * 100 / numeroReferencias).toFixed(2) + "%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Col className="pr-1" md="6">
                <Form.Group>
                  <label>Opciones de Gráfico de Burbujas</label>
                  <Form.Row>
                    <select className="form-control" id="OpcionesGarficoBurbujas" onChange={handleCargarDatosGraficosBurbujas}>
                      <option value="OA">Gráfico de Búrbujas por Orden de Autor</option>
                      <option value="NP">Gráfico por Número de Publicaciones por Autor</option>
                    </select>
                  </Form.Row>
                </Form.Group>
              </Col>
              {opcionGrafico == 'OA' && (
                <Card.Header>
                  <div id="redes-autores-grafo" ></div>
                </Card.Header>
              )}
              {opcionGrafico == 'NP' && (
                <Card.Header>
                  <div id="redes-autores-grafo-total" ></div>
                </Card.Header>
              )}
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="4">
                    {/* <Form.Group>
                    <label>Orden de Autores</label>
                    <Form.Row>
                      <select className="form-control" id="idOrdenAutor" onChange={handleCargarRedesDeAutoresAreasOrden}>
                        <option value="0">Seleccione</option>
                        <option value="1">Primer Autor</option>
                        <option value="2">Segundo Autor</option>
                        <option value="3">Tercer Autor</option>
                        <option value="4">Cuarto Autor</option>
                        <option value="5">Quinto Autor</option>
                        <option value="6">Sexto Autor</option>
                        <option value="7">Septimo Autor</option>
                        <option value="8">Octavo Autor</option>
                        <option value="9">Noveno Autor</option>
                        <option value="10">Decimo Autor</option>
                        <option value="11">Undecimo Autor</option>
                        <option value="12">Duodecimo Autor</option>
                        <option value="13">Decimo Tercero Autor</option>
                        <option value="19">Decimo Noveno Autor</option>
                      </select>
                    </Form.Row>
                  </Form.Group> */}
                  </Col>
                  <Col className="pr-1" md="3">
                    {/* <Form.Group>
                      <label>Area Unesco</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaUnescoGrafo" onChange={handleCargarRedesDeAutoresAreasOrden}>
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group> */}
                  </Col>

                </Row>
                {/* <div>
                <img src={"data:image/png;base64,"+ redesAreasOrden} width="100%" height="100%" alt="Grafo Autores" />
              </div> */}
                {/* <div>
                <img src={"data:image/png;base64,"+ redesAreas} width="100%" height="100%" alt="Red dot" />
              </div> */}
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ley de Bradford</Card.Title>
                <p className="card-category">
                  Medios de Publicación núcleo de cada Área
                </p>
                <Row>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>PUBLICACIONES</label>
                      <Form.Row>
                        <select className="form-control" id="idPublicacionCorrespondiente">
                          <option value="0">Seleccione</option>
                          <option value="I">Internas (Investigadores U Cuenca)</option>
                          <option value="E">Externas (Referencias)</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO DESDE</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioDesde">
                          <option value="0">Seleccione</option>
                          <option value="2016">2016</option>
                          <option value="2017">2017</option>
                          <option value="2018">2018</option>
                          <option value="2019">2019</option>
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO HASTA</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioHasta">
                          <option value="0">Seleccione</option>
                          <option value="2016">2016</option>
                          <option value="2017">2017</option>
                          <option value="2018">2018</option>
                          <option value="2019">2019</option>
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Area Frascati</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaFrascati">
                          <option value="0">Seleccione</option>
                          {areasFracati.map(item => (
                            <option value={item.id_area_frascati} key={item.id_area_frascati}>{item.descripcion}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Area Unesco</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaUnesco">
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="EJECUTAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleCargarDatosLeyBradford}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableMediosPublicacionReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>REVISTA</th>
                      <th>NUMERO CITAS</th>
                      <th>NUMERO ACUMULADO CITAS</th>
                      <th>% ACUMULADO DE CITAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosLeyBradford.map((item, index, elements) => (
                      <tr className="small" key={item.id_referencia}>
                        <td>{item.venue}</td>
                        <td>{item.contador}</td>
                        <td>{item.numeroAcumuladoCitas}</td>
                        <td>{item.procentajeAcumuladoCitas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
