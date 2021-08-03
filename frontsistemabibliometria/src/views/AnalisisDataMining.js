import React from "react";
import { clusteringService } from '../_services/clustering.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import Chart1 from './Chart1';
import ChartCluster from './ChartCluster';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { analisisEstadisticoService } from "_services/analisis_estadistico.service";
import ChartClusterAreas from './ChartClusterAreas';
import ChartClusterAreasUF from './ChartClusterAreasUF';
import ChartClusterMedPubOrdAut from './ChartClusterMedPubOrdAut';
import ChartClusterRevNumCit from './ChartClusterRevNumCit';
import { medioPublicacionService } from '../_services/medio_publicacion.service';
import ChartClusterCuartilAreUne from './ChartClusterCuartilAreUne';
import ChartClusterFICuartil from './ChartClusterFICuartil';
import { Bar, Doughnut, Pie, PolarArea, Bubble } from 'react-chartjs-2';

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
  Form
} from "react-bootstrap";
import { publicacionService } from "_services/publicacion.service";
function AnalisisDataMining() {
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
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

  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

  const [numero_cluster, setNumeroCluster] = React.useState(0);
  const [nombre_cluster, setNombreCluster] = React.useState([]);
  const [detalleDatosClusterAreas, setDetalleDatosClusterAreas] = React.useState([]);
  const [detalleDatosClusterAreasCuartil, setDetalleDatosClusterAreasCuartil] = React.useState([]);
  const [detalleDatosClusterCuartilFI, setDetalleDatosClusterCuartilFI] = React.useState([]);
  const [detalleDatosClusterMediosPublciacion, setDetalleDatosClusterMediosPublicacion] = React.useState([]);
  const [detalleDatosClusterMediosPublciacionRef, setDetalleDatosClusterMediosPublicacionRef] = React.useState([]);
  const [tituloGrafico, setTituloGrafico] = React.useState('');
  const [tituloGraficoEstadistica, setTituloGraficoEstadistica] = React.useState('');
  const [detalleDatosClusterEsp, setDetalleDatosClusterEsp] = React.useState([]);
  const [resultadoClusterAreas, setResultadoClusterAreas] = React.useState([]);
  const [numeroAreaFrascatti, setNumeroAreaFrascatti] = React.useState(0);
  const [numeroAreaUnesco, setNumeroAreaUnesco] = React.useState(0);
  const [totalClusterAreas, setTotalClusterAreas] = React.useState([]);
  const [totalClusterAreasCuartil, setTotalClusterAreasCuartil] = React.useState([]);
  const [totalClusterCuartilFI, setTotalClusterCuartilFI] = React.useState([]);
  const [totalClusterMediosPublicacion, setTotalClusterMediosPublicacion] = React.useState([]);
  const [totalClusterMediosPublicacionReferencias, setTotalClusterMediosPublicacionReferencias] = React.useState([]);
  const [resultadoClusterMediosPublicacionOrdenAutor, setResultadoClusterMediosPublicacionOrdenAutor] = React.useState([]);
  const [numeroMediosPublicacion, setNumeroMediosPublicacion] = React.useState(0);
  const [resultadoClusterRevNumCit, setResultadoClusterRevNumCit] = React.useState([]);
  const [filtroPorArea, setFiltroArea] = React.useState(true);
  const [filtroPorAreaEstadistica, setFiltroPorAreaEstadistica] = React.useState(false);
  const [resultadoClusterCuartilAreas, setResultadoClusterCuartilAreas] = React.useState([]);
  const [resultadoClusterCuartilFI, setResultadoClusterCuartilFI] = React.useState([]);

  const ordenAutor = 19;
  const num_citations = 300000;
  const num_revistas = 6000;
  const num_cuartil = 1;
  const num_factorI = 1;

  const [etiquetas, setEtiquetas] = React.useState([]);
  const [datos, setDatos] = React.useState([]);
  const [numeroPublicacionesUnesco, setNumeroPublicacionesUnesco] = React.useState([]);
  const [numeroPublicacionesFrascati, setNumeroPublicacionesFrascati] = React.useState([]);
  const [numeroPublicacionesMediosPublicacion, setNumeroPublicacionesMediosPublicacion] = React.useState([]);
  const [numeroPublicacionesCuartil, setNumeroPublicacionesCuartil] = React.useState([]);
  const [numeroPublicacionesFactorImpacto, setNumeroPublicacionesFactorImpacto] = React.useState([]);
  const [backgroundColor, setBackgroundColor] = React.useState(['']);
  const [borderColor, setBorderColor] = React.useState(['']);
  const [hoverBackgroundColor, setHoverBackgroundColor] = React.useState(['']);
  const [opciones, setOpciones] = React.useState({});

  const data = {
    labels: etiquetas,
    datasets: [{
      label: 'Número de publicaciones',
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      hoverBackgroundColor: hoverBackgroundColor,
      hoverBorderColor: 'white',
      data: datos
    }]
  }

  const opcionesBarVertical = {
    maintainAspectRatio: false,
    responsive: true/*,
    plugins: {
      title: {
        display: true,
        text: tituloGraficoEstadistica,
      },
    },*/
  }

  const opcionesBarHorizontal = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: tituloGraficoEstadistica,
      },
    },
  };

  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);

  async function handleProcesarDatosClusteringFICuartil(value, numeroCluster) {
    //console.log(value)
    if (value == 'Error') {
      notify("tr", 'Debido a la cantidad de datos no es posible realizar el agrupamiento que ingreso.', "danger");
      return;
    }

    setLoading(true);
    var objeto = JSON.parse(value);
    var id_cuartil = objeto.Componente_1;
    var id_factor_impacto = objeto.Componente_2;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaCuartil = Object.values(id_cuartil)
    var listaFactorImpacto = Object.values(id_factor_impacto)
    var listaKMeans_Clusters = Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var listaRegistros = []
    var resultadoArticuloCluster = []
    for (var i = 0; i < listaFactorImpacto.length; i++) {
      const registro = {
        id_cuartil: listaCuartil[i],
        id_factor_impacto: listaFactorImpacto[i],
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i]
      }
      const idArticuloCluster = {
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i],
        num_cluster: numeroCluster
      }
      resultadoArticuloCluster.push(idArticuloCluster)
      listaRegistros.push(registro)
    }

    await publicacionService.obtenerDetalleClusteringCuartilFI(resultadoArticuloCluster).then(value => {
      if (value.length != 0) {
        let totales = [];
        let nombre_cluster = [];
        for (var i = 0; i < numeroCluster; i++) {
          let registro_nombre_cluster = { "codigo": i, "nombre": "Grupo " + i }
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterCuartilFI(totales);
        setDetalleDatosClusterCuartilFI(value)
      }
      setLoading(false);
    })

    setResultadoClusterCuartilFI(listaRegistros);
    
  }


  async function handleEjecutarClusteringFICuartil(numeroCluster) {
    setLoading(true)
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarClusterFactorImpactoXCuartil(numeroCluster).then(value => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false)
    })
  }

  async function handleEjecutarClusteringCuaFIPorAnio(anio, numeroCluster) {
    setLoading(true);
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarclusteringCuarFIPorAnio(anio, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringCuaFIPorAreaFrascati(id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarclusteringCuarFIPorAreaFrascati(id_area_frascati, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringCuaFIPorAreaUnesco(id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarclusteringCuarFIPorAreaUnesco(id_area_unesco, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringCuaFIPorAreaFraYAñoPub(anio_publicacion, id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarclusteringCuarFIPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringCuaFIPorAreaUneYAñoPub(anio_publicacion, id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('CUARTIL POR FACTOR DE IMPACTO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    setResultadoClusterCuartilFI([]);
    await clusteringService.ejecutarclusteringCuarFIPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringFICuartil(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleValoresUnicosAreas(cluster) {
    let unicos = [];
    for (var i = 0; i < cluster.length; i++) {
      const valor = cluster[i];
      const found = unicos.find(element => element.areaFrascati == valor.areaFrascati && element.areaUnesco == valor.areaUnesco);
      if (found == undefined) {
        unicos.push(valor)
      }
    }
    return unicos;
  }

  async function handleValoresUnicosMediosPublicacion(cluster) {
    let unicos = [];
    for (var i = 0; i < cluster.length; i++) {
      const valor = cluster[i];
      const found = unicos.find(element => element.medioPublicacion == valor.medioPublicacion);
      if (found == undefined) {
        unicos.push(valor)
      }
    }
    return unicos;
  }


  async function handleSeleccionarDatosClusterCuartilFactorImpacto() {

    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterCuartilFI');
    let idCluster = document.getElementById("idClusterCuartilFI").value;
    if (idCluster != 'N') {
      for (var i = 0; i < numero_cluster; i++) {
        if (idCluster == i) {
          setDetalleDatosClusterEsp(detalleDatosClusterCuartilFI[i][i]);
          /*await handleValoresUnicosMediosPublicacion(detalleDatosClusterCuartilFI[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
          })*/
        }
      }
    }
    await tablaPaginacionService.paginacion('#dataClusterCuartilFI');
  }

  async function handleEjecutarOperacion() {
    setDetalleDatosClusterEsp([]);
    setNombreCluster([]);
    let idOperacion = document.getElementById("idOperacion").value;
    let idCampo = document.getElementById("idCampo").value;
    let idAnio = parseInt(document.getElementById("idAnio").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);
    let numeroCluster = parseInt(document.getElementById("numeroClusterText").value);
    if (idOperacion != 0) {
      if (idCampo != 0) {
        if (idCampo == 1) {
          if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringFICuartil(numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuaFIPorAnio(idAnio, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuaFIPorAreaFrascati(idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuaFIPorAreaUnesco(idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuaFIPorAreaFraYAñoPub(idAnio, idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuaFIPorAreaUneYAñoPub(idAnio, idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
            notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
          }
        }
      }
      else {
        notify("tr", 'Seleccione el campo.', "danger");
      }
    } else {
      notify("tr", 'Seleccione la operación.', "danger");
    }

  }
  const w = 700;
  const h = 500;
  /** Carga las areas frascati para el filtro*/
  async function handleAreasFrascati() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableAreasFrascati');
    await areaFrascatiService.listaAreasFrascati().then(value => {
      setAreasFrascati(value.area_frascati);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableAreasFrascati');
  }
  /**Carga las areas unesco para el filtro */
  async function handleAreasUnesco() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableAreasUnesco');
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableAreasUnesco');
  }

  async function handleEjecutarOperacionEstadistica() {
    setNumeroPublicacionesUnesco([]);
    setNumeroPublicacionesFrascati([]);
    setNumeroPublicacionesMediosPublicacion([]);
    setNumeroPublicacionesCuartil([]);
    setNumeroPublicacionesFactorImpacto([]);
    setEtiquetas([])
    setDatos([])
    setTituloGraficoEstadistica('');
    setBackgroundColor(['']);
    setBorderColor(['']);
    setHoverBackgroundColor(['']);

    let idOperacion = document.getElementById("idOperacionEstadistica").value;
    let idAnio = parseInt(document.getElementById("idAnioEstadistica").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnescoEstadistica").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascatiEstadistica").value);

    //console.log(idOperacion)
    //console.log(idAnio)
    //console.log(idAreaUnesco)
    //console.log(idAreaFrascati)
    if (idOperacion == 1 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorAreaUnesco().then(value => {
        setBackgroundColor(['#0B5345']);
        setBorderColor(['black'])
        setHoverBackgroundColor(['#73C6B6'])
        setOpciones(opcionesBarHorizontal)
        setTituloGraficoEstadistica('PRODUCTIVIDAD POR AREA UNESCO');
        var numeroPublicacionesAreaUnesco = value.numeroPublicacionesAreaUnesco
        setNumeroPublicacionesUnesco(numeroPublicacionesAreaUnesco);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesAreaUnesco.length; i++) {
          etiquetas.push(numeroPublicacionesAreaUnesco[i].nombre)
          datos.push(numeroPublicacionesAreaUnesco[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 1 && idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesAreaUnescoPorAnio(idAnio).then(value => {
        setBackgroundColor(['#1B2631']);
        setBorderColor(['black'])
        setHoverBackgroundColor(['#5D6D7E'])
        setOpciones(opcionesBarVertical)
        setTituloGraficoEstadistica('PRODUCTIVIDAD POR AREA UNESCO');
        var numeroPublicacionesAreaUnesco = value.numeroPublicacionesAreaUnesco
        setNumeroPublicacionesUnesco(numeroPublicacionesAreaUnesco);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesAreaUnesco.length; i++) {
          etiquetas.push(numeroPublicacionesAreaUnesco[i].nombre)
          datos.push(numeroPublicacionesAreaUnesco[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 2 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesAreaFrascati().then(value => {
        setBackgroundColor(['#784212']);
        setBorderColor(['black'])
        setHoverBackgroundColor(['#EB984E'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR AREA FRASCATI');
        var numeroPublicacionesAreaFrascati = value.numeroPublicacionesAreaFrascati
        setNumeroPublicacionesFrascati(numeroPublicacionesAreaFrascati);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesAreaFrascati.length; i++) {
          etiquetas.push(numeroPublicacionesAreaFrascati[i].nombre)
          datos.push(numeroPublicacionesAreaFrascati[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 2 && idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesAreaFrascatiPorAnio(idAnio).then(value => {
        setBackgroundColor(['#1B4F72']);
        setBorderColor(['black'])
        setHoverBackgroundColor(['#5DADE2'])
        setOpciones(opcionesBarVertical)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR AREA FRASCATI');
        var numeroPublicacionesAreaFrascati = value.numeroPublicacionesAreaFrascati
        setNumeroPublicacionesFrascati(numeroPublicacionesAreaFrascati);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesAreaFrascati.length; i++) {
          etiquetas.push(numeroPublicacionesAreaFrascati[i].nombre)
          datos.push(numeroPublicacionesAreaFrascati[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 3 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesMediosPublicacion().then(value => {
        setBackgroundColor(['#4D5656']);
        setBorderColor(['black'])
        setHoverBackgroundColor(['#4D5656'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR MEDIOS DE PUBLICACION');
        var numeroMediosPublicacion = value.numeroMediosPublicacion
        setNumeroPublicacionesMediosPublicacion(numeroMediosPublicacion);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroMediosPublicacion.length; i++) {
          etiquetas.push(numeroMediosPublicacion[i].nombre)
          datos.push(numeroMediosPublicacion[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 3 && idAnio == 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesMediosPublicacionPorAreaUnesco(idAreaUnesco).then(value => {
        setBackgroundColor(['#138D75']);
        setBorderColor(['#138D75'])
        setHoverBackgroundColor(['#138D75'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR MEDIOS DE PUBLICACION');
        var numeroMediosPublicacion = value.numeroMediosPublicacion
        setNumeroPublicacionesMediosPublicacion(numeroMediosPublicacion);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroMediosPublicacion.length; i++) {
          etiquetas.push(numeroMediosPublicacion[i].nombre)
          datos.push(numeroMediosPublicacion[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 3 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesMediosPublicacionPorAreaFrascati(idAreaFrascati).then(value => {

        setBackgroundColor(['#5D6D7E']);
        setBorderColor(['#5D6D7E'])
        setHoverBackgroundColor(['#AEB6BF'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR MEDIOS DE PUBLICACION');
        var numeroMediosPublicacion = value.numeroMediosPublicacion
        setNumeroPublicacionesMediosPublicacion(numeroMediosPublicacion);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroMediosPublicacion.length; i++) {
          etiquetas.push(numeroMediosPublicacion[i].nombre)
          datos.push(numeroMediosPublicacion[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 3 && idAnio != 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesMediosPublicacionPorAreaUnescoPorAnio(idAreaUnesco, idAnio).then(value => {

        setBackgroundColor(['#52BE80']);
        setBorderColor(['#52BE80'])
        setHoverBackgroundColor(['#A9DFBF'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR MEDIOS DE PUBLICACION');
        var numeroMediosPublicacion = value.numeroMediosPublicacion
        setNumeroPublicacionesMediosPublicacion(numeroMediosPublicacion);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroMediosPublicacion.length; i++) {
          etiquetas.push(numeroMediosPublicacion[i].nombre)
          datos.push(numeroMediosPublicacion[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 3 && idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesMediosPublicacionPorAreaFrascatiPorAnio(idAreaFrascati, idAnio).then(value => {

        setBackgroundColor(['#2980B9']);
        setBorderColor(['#2980B9'])
        setHoverBackgroundColor(['#85C1E9'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR MEDIOS DE PUBLICACION');
        var numeroMediosPublicacion = value.numeroMediosPublicacion
        setNumeroPublicacionesMediosPublicacion(numeroMediosPublicacion);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroMediosPublicacion.length; i++) {
          etiquetas.push(numeroMediosPublicacion[i].nombre)
          datos.push(numeroMediosPublicacion[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 4 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorCuartil().then(value => {
        setTituloGraficoEstadistica('PRODUCTIVIDAD POR CUARTIL');

        setBackgroundColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"]);
        setBorderColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"])
        setHoverBackgroundColor(["#F5EEF8", "#D1F2EB", "#FCF3CF", "#E5E8E8", "#EBF5FB"])
        setOpciones(opcionesBarVertical)

        var numeroPublicacionesCuartil = value.numeroPublicacionesCuartil
        setNumeroPublicacionesCuartil(numeroPublicacionesCuartil);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesCuartil.length; i++) {
          if(numeroPublicacionesCuartil[i].cuartil != 'Q1' && numeroPublicacionesCuartil[i].cuartil != 'Q2' && numeroPublicacionesCuartil[i].cuartil != 'Q3' && numeroPublicacionesCuartil[i].cuartil != 'Q4'){
            etiquetas.push('NA')
          }else{
          etiquetas.push(numeroPublicacionesCuartil[i].cuartil)
          }
          datos.push(numeroPublicacionesCuartil[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 4 && idAnio == 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorCuartilPorAreaUnesco(idAreaUnesco).then(value => {

        setBackgroundColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"]);
        setBorderColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"])
        setHoverBackgroundColor(["#F5EEF8", "#D1F2EB", "#FCF3CF", "#E5E8E8", "#EBF5FB"])
        setOpciones(opcionesBarVertical)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR CUARTIL');
        var numeroPublicacionesCuartil = value.numeroPublicacionesCuartil
        setNumeroPublicacionesCuartil(numeroPublicacionesCuartil);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesCuartil.length; i++) {
          if(numeroPublicacionesCuartil[i].cuartil != 'Q1' && numeroPublicacionesCuartil[i].cuartil != 'Q2' && numeroPublicacionesCuartil[i].cuartil != 'Q3' && numeroPublicacionesCuartil[i].cuartil != 'Q4'){
            etiquetas.push('NA')
          }else{
          etiquetas.push(numeroPublicacionesCuartil[i].cuartil)
          }
          datos.push(numeroPublicacionesCuartil[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 4 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorCuartilPorAreaFrascati(idAreaFrascati).then(value => {

        setBackgroundColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"]);
        setBorderColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"])
        setHoverBackgroundColor(["#F5EEF8", "#D1F2EB", "#FCF3CF", "#E5E8E8", "#EBF5FB"])
        setOpciones(opcionesBarVertical)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR CUARTIL');
        var numeroPublicacionesCuartil = value.numeroPublicacionesCuartil
        setNumeroPublicacionesCuartil(numeroPublicacionesCuartil);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesCuartil.length; i++) {
          if(numeroPublicacionesCuartil[i].cuartil != 'Q1' && numeroPublicacionesCuartil[i].cuartil != 'Q2' && numeroPublicacionesCuartil[i].cuartil != 'Q3' && numeroPublicacionesCuartil[i].cuartil != 'Q4'){
            etiquetas.push('NA')
          }else{
          etiquetas.push(numeroPublicacionesCuartil[i].cuartil)
          }
          datos.push(numeroPublicacionesCuartil[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 4 && idAnio != 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorCuartilPorAreaUnescoPorAnio(idAreaUnesco, idAnio).then(value => {

        setBackgroundColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"]);
        setBorderColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"])
        setHoverBackgroundColor(["#F5EEF8", "#D1F2EB", "#FCF3CF", "#E5E8E8", "#EBF5FB"])
        setOpciones(opcionesBarVertical)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR CUARTIL');
        var numeroPublicacionesCuartil = value.numeroPublicacionesCuartil
        setNumeroPublicacionesCuartil(numeroPublicacionesCuartil);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesCuartil.length; i++) {
          if(numeroPublicacionesCuartil[i].cuartil != 'Q1' && numeroPublicacionesCuartil[i].cuartil != 'Q2' && numeroPublicacionesCuartil[i].cuartil != 'Q3' && numeroPublicacionesCuartil[i].cuartil != 'Q4'){
            etiquetas.push('NA')
          }else{
          etiquetas.push(numeroPublicacionesCuartil[i].cuartil)
          }
          datos.push(numeroPublicacionesCuartil[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 4 && idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorCuartilPorAreaFrascatiPorAnio(idAreaFrascati, idAnio).then(value => {

        setBackgroundColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"]);
        setBorderColor(["#9B59B6", "#45B39D", "#F1C40F", "#5D6D7E", "#EBF5FB"])
        setHoverBackgroundColor(["#F5EEF8", "#D1F2EB", "#FCF3CF", "#E5E8E8", "#EBF5FB"])
        setOpciones(opcionesBarVertical)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR CUARTIL');
        var numeroPublicacionesCuartil = value.numeroPublicacionesCuartil
        setNumeroPublicacionesCuartil(numeroPublicacionesCuartil);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesCuartil.length; i++) {
          if(numeroPublicacionesCuartil[i].cuartil != 'Q1' && numeroPublicacionesCuartil[i].cuartil != 'Q2' && numeroPublicacionesCuartil[i].cuartil != 'Q3' && numeroPublicacionesCuartil[i].cuartil != 'Q4'){
            etiquetas.push('NA')
          }else{
          etiquetas.push(numeroPublicacionesCuartil[i].cuartil)
          }
          datos.push(numeroPublicacionesCuartil[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 5 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorFactorImpacto().then(value => {
        setBackgroundColor(['#9B59B6']);
        setBorderColor(['#9B59B6'])
        setHoverBackgroundColor(['#F5EEF8'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR FACTOR IMPACTO');
        var numeroPublicacionesFactorImpacto = value.numeroPublicacionesFactorImpacto
        setNumeroPublicacionesFactorImpacto(numeroPublicacionesFactorImpacto);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesFactorImpacto.length; i++) {
          etiquetas.push(numeroPublicacionesFactorImpacto[i].factor_impacto)
          datos.push(numeroPublicacionesFactorImpacto[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 5 && idAnio == 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorFactorImpactoPorAreaUnesco(idAreaUnesco).then(value => {
        setBackgroundColor(['#45B39D']);
        setBorderColor(['#45B39D'])
        setHoverBackgroundColor(['#D1F2EB'])
        setOpciones(opcionesBarHorizontal)
        
        setTituloGraficoEstadistica('PRODUCTIVIDAD POR FACTOR IMPACTO');
        var numeroPublicacionesFactorImpacto = value.numeroPublicacionesFactorImpacto
        setNumeroPublicacionesFactorImpacto(numeroPublicacionesFactorImpacto);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesFactorImpacto.length; i++) {
          etiquetas.push(numeroPublicacionesFactorImpacto[i].factor_impacto)
          datos.push(numeroPublicacionesFactorImpacto[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 5 && idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorFactorImpactoPorAreaFrascati(idAreaFrascati).then(value => {
        setBackgroundColor(['#F1C40F']);
        setBorderColor(['#F1C40F'])
        setHoverBackgroundColor(['#FCF3CF'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR FACTOR IMPACTO');
        var numeroPublicacionesFactorImpacto = value.numeroPublicacionesFactorImpacto
        setNumeroPublicacionesFactorImpacto(numeroPublicacionesFactorImpacto);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesFactorImpacto.length; i++) {
          etiquetas.push(numeroPublicacionesFactorImpacto[i].factor_impacto)
          datos.push(numeroPublicacionesFactorImpacto[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 5 && idAnio != 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorFactorImpactoPorAreaUnescoPorAnio(idAreaUnesco, idAnio).then(value => {
        setBackgroundColor(['#5D6D7E']);
        setBorderColor(['#5D6D7E'])
        setHoverBackgroundColor(['#E5E8E8'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR FACTOR IMPACTO');
        var numeroPublicacionesFactorImpacto = value.numeroPublicacionesFactorImpacto
        setNumeroPublicacionesFactorImpacto(numeroPublicacionesFactorImpacto);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesFactorImpacto.length; i++) {
          etiquetas.push(numeroPublicacionesFactorImpacto[i].factor_impacto)
          datos.push(numeroPublicacionesFactorImpacto[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else if (idOperacion == 5 && idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      setLoading(true)
      analisisEstadisticoService.numeroPublicacionesPorFactorImpactoPorAreaFrascatiPorAnio(idAreaFrascati, idAnio).then(value => {
        setBackgroundColor(['#5DADE2']);
        setBorderColor(['#5DADE2'])
        setHoverBackgroundColor(['#EBF5FB'])
        setOpciones(opcionesBarHorizontal)

        setTituloGraficoEstadistica('PRODUCTIVIDAD POR FACTOR IMPACTO');
        var numeroPublicacionesFactorImpacto = value.numeroPublicacionesFactorImpacto
        setNumeroPublicacionesFactorImpacto(numeroPublicacionesFactorImpacto);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < numeroPublicacionesFactorImpacto.length; i++) {
          etiquetas.push(numeroPublicacionesFactorImpacto[i].factor_impacto)
          datos.push(numeroPublicacionesFactorImpacto[i].contador)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      })
    } else {
      notify("tr", 'Operación no disponible.', "danger");
    }
  }

  /**Muestra los filtros de areas analisis estadistico*/
  async function mostrarFiltroAreasEstadistica() {
    let idOperacionEstadistica = document.getElementById("idOperacionEstadistica").value;
    if (idOperacionEstadistica == 1 || idOperacionEstadistica == 2) {
      document.getElementById("idAreaFrascatiEstadistica").value = "0";
      document.getElementById("idAreaFrascatiEstadistica").disabled = true;
      document.getElementById("idAreaUnescoEstadistica").value = "0";
      document.getElementById("idAreaUnescoEstadistica").disabled = true;
    } else {
      document.getElementById("idAreaFrascatiEstadistica").disabled = false;
      document.getElementById("idAreaUnescoEstadistica").disabled = false;
    }
  }


  React.useEffect(() => {
    handleAreasFrascati();
    handleAreasUnesco();
  }, []);
  return (
    <>
      <FadeLoader loading={loading} css={override} size={50} />
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col md="6">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">AGRUPAMIENTO</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Operaciones</label>
                      <Form.Row>
                        <select className="form-control" id="idOperacion">
                          <option value="0">Seleccione</option>
                          <option value="1">Agrupamiento</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Campo</label>
                      <Form.Row>
                        <select className="form-control" id="idCampo">
                          <option value="0">Seleccione</option>
                          <option value="1">Cuartil vs Factor de Impacto</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>AÑO</label>
                      <Form.Row>
                        <select className="form-control" id="idAnio">
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
                  <Col className="pr-1" md="2">
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
                  <Col className="pr-1" md="2">
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
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>NUMERO GRUPOS</label>
                      <Form.Control
                        id="numeroClusterText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="EJECUTAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleEjecutarOperacion}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">{tituloGrafico}</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                {resultadoClusterCuartilFI.length !== 0 && (
                  <ChartClusterFICuartil data={resultadoClusterCuartilFI} w={w} h={h} nc={num_cuartil} fi={num_factorI} totales={totalClusterCuartilFI}></ChartClusterFICuartil>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md="6">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">ESTADISTICAS DE LOS DATOS</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Operaciones</label>
                      <Form.Row>
                        <select className="form-control" id="idOperacionEstadistica" onClick={mostrarFiltroAreasEstadistica}>
                          <option value="0">Seleccione</option>
                          <option value="1">Número de publicaciones por Area Unesco</option>
                          <option value="2">Número de publicaciones por Area Frascati</option>
                          <option value="3">Número de publicaciones por Medio Publicacion</option>
                          <option value="4">Número de publicaciones por Cuartil</option>
                          <option value="5">Número de publicaciones por Factor Impacto</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>AÑO</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioEstadistica">
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
                        <select className="form-control" id="idAreaFrascatiEstadistica" disabled={filtroPorAreaEstadistica}>
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
                        <select className="form-control" id="idAreaUnescoEstadistica" disabled={filtroPorAreaEstadistica}>
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="EJECUTAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleEjecutarOperacionEstadistica}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">{tituloGraficoEstadistica}</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                {numeroPublicacionesUnesco.length !== 0 && (
                  <div style={{ width: '100%', height: '500px' }}>
                    <Bar data={data} options={opciones}></Bar>
                  </div>
                )}
                {numeroPublicacionesFrascati.length !== 0 && (
                  <div style={{ width: '100%', height: '500px' }}>
                    <Bar data={data} options={opciones}></Bar>
                  </div>
                )}
                {numeroPublicacionesMediosPublicacion.length !== 0 && (
                  <div style={{ width: '100%', height: '500px' }}>
                    <Bar data={data} options={opciones}></Bar>
                  </div>
                )}
                {numeroPublicacionesCuartil.length !== 0 && (
                  <div style={{ width: '60%', height: '500px' }}>
                    <Pie data={data} options={opciones}></Pie>
                  </div>
                )}
                {numeroPublicacionesFactorImpacto.length !== 0 && (
                  <div style={{ width: '100%', height: '500px' }}>
                    <Bar data={data} options={opciones}></Bar>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          {resultadoClusterCuartilFI.length !== 0 && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">DETALLE DE LOS RESULTADOS</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Grupos</label>
                      <Form.Row>
                        <select className="form-control" id="idClusterCuartilFI" onClick={handleSeleccionarDatosClusterCuartilFactorImpacto}>
                          <option value="N">Seleccione el Grupo</option>
                          {nombre_cluster.map(item => (
                            <option value={item.codigo} key={item.codigo}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <table className="table table-bordered table-hover" id="dataClusterCuartilFI" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>AREA UNESCO</th>
                        <th>AREA FRASCATI</th>
                        <th>CUARTIL</th>
                        <th>FACTOR IMPACTO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleDatosClusterEsp.map(item => (
                        <tr className="small" key={item.id_articulo}>
                          <td width="15%">{item.areaUnesco}</td>
                          <td width="15%">{item.areaFrascati}</td>
                          <td width="15%">{item.cuartil}</td>
                          <td width="15%">{item.fi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default AnalisisDataMining;
