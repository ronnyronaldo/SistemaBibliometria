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
  const [totalClusterMediosPublicacion, setTotalClusterMediosPublicacion] = React.useState([]);
  const [totalClusterMediosPublicacionReferencias, setTotalClusterMediosPublicacionReferencias] = React.useState([]);
  const [resultadoClusterMediosPublicacionOrdenAutor, setResultadoClusterMediosPublicacionOrdenAutor] = React.useState([]);
  const [numeroMediosPublicacion, setNumeroMediosPublicacion] = React.useState(0);
  const [resultadoClusterRevNumCit, setResultadoClusterRevNumCit] = React.useState([]);
  const [filtroPorArea, setFiltroArea] = React.useState(true);
  const [filtroPorAreaEstadistica, setFiltroPorAreaEstadistica] = React.useState(false);
  const [resultadoClusterCuartilAreas, setResultadoClusterCuartilAreas] = React.useState([]);

  const ordenAutor = 19;
  const num_citations = 300000;
  const num_revistas = 6000;
  const num_cuartil = 5;

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
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: tituloGraficoEstadistica,
      },
    },
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

  async function handleEjecutarClusteringAreas(numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR ÁREAS');
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarClusterAreas(numeroCluster).then(value => {
      handleProcesarDatosClusteringAreas(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringAreasPorAnio(anio, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR ÁREAS');
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringAreasPorAnio(anio, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringAreas(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleProcesarDatosClusteringAreas(value, numeroCluster) {
    if (value == 'Error') {
      notify("tr", 'Debido a la cantidad de datos no es posible realizar el número de cluster que ingreso.', "danger");
      return;
    }

    setLoading(true);
    var objeto = JSON.parse(value);
    var id_area_frascati = objeto.id_area_frascati;
    var id_area_unesco = objeto.id_area_unesco;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaAreaFrascati = Object.values(id_area_frascati)
    var listaAreaUnesco = Object.values(id_area_unesco)
    var listaKMeans_Clusters = Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var resultadoAreas = []
    var resultadoArticuloCluster = []
    for (var i = 0; i < listaAreaFrascati.length; i++) {
      const registro = {
        id_area_frascati: listaAreaFrascati[i],
        id_area_unesco: listaAreaUnesco[i],
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i]
      }
      const idArticuloCluster = {
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i],
        num_cluster: numeroCluster
      }
      resultadoArticuloCluster.push(idArticuloCluster)
      resultadoAreas.push(registro)
    }


    await publicacionService.obtenerDetalleClusterAreasPub(resultadoArticuloCluster).then(value => {
      if (value.length != 0) {
        let totales = [];
        let nombre_cluster = [];
        for (var i = 0; i < numeroCluster; i++) {
          let registro_nombre_cluster = { "codigo": i, "nombre": "Cluster " + i }
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterAreas(totales);
        setDetalleDatosClusterAreas(value)
      }
      setLoading(false);
    })

    areaFrascatiService.listaAreasFrascati().then(value => {
      setNumeroAreaFrascatti(value.area_frascati.length)
      areaUnescoService.listaAreasUnesco().then(value => {
        setNumeroAreaUnesco(value.area_unesco.length)
        setResultadoClusterAreas(resultadoAreas);
      });
    });
  }


  async function handleProcesarDatosClusteringCuartilAreasUnesco(value, numeroCluster) {
    if (value == 'Error') {
      notify("tr", 'Debido a la cantidad de datos no es posible realizar el número de cluster que ingreso.', "danger");
      return;
    }

    setLoading(true);
    var objeto = JSON.parse(value);
    var id_cuartil = objeto.Quartil;
    var id_area_unesco = objeto.id_area_unesco;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaCuartil = Object.values(id_cuartil)
    var listaAreaUnesco = Object.values(id_area_unesco)
    var listaKMeans_Clusters = Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var resultadoAreas = []
    var resultadoArticuloCluster = []
    for (var i = 0; i < listaAreaUnesco.length; i++) {
      const registro = {
        id_cuartil: listaCuartil[i],
        id_area_unesco: listaAreaUnesco[i],
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i]
      }
      const idArticuloCluster = {
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i],
        num_cluster: numeroCluster
      }
      resultadoArticuloCluster.push(idArticuloCluster)
      resultadoAreas.push(registro)
    }



    await publicacionService.obtenerDetalleClusteringCuartilAreaUnesco(resultadoArticuloCluster).then(value => {
      if (value.length != 0) {
        let totales = [];
        let nombre_cluster = [];
        for (var i = 0; i < numeroCluster; i++) {
          let registro_nombre_cluster = { "codigo": i, "nombre": "Cluster " + i }
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterAreasCuartil(totales);
        setDetalleDatosClusterAreasCuartil(value)
      }
      setLoading(false);
    })

    areaUnescoService.listaAreasUnesco().then(value => {
      setNumeroAreaUnesco(value.area_unesco.length)
      setResultadoClusterCuartilAreas(resultadoAreas);
    });
  }

  async function handleEjecutarClusteringMedPubOrdAut(numeroCluster) {
    setLoading(true)
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarClusterMediosPublicacionOrden(numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false)
    })
  }

  async function handleEjecutarClusteringCuartilAreasUnesco(numeroCluster) {
    setLoading(true)
    setTituloGrafico('CUARTIL POR ÁREA UNESCO');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarClusterCuartilAreaUnesco(numeroCluster).then(value => {
      handleProcesarDatosClusteringCuartilAreasUnesco(value, numeroCluster);
      setLoading(false)
    })
  }

  async function handleEjecutarClusteringMedPubOrdAutPorAnio(anio, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringMediosPublicacionPorAnio(anio, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringMedPubOrdAutPorAreaFrascati(id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringMediosPublicacionPorAreaFrascati(id_area_frascati, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringMedPubOrdAutPorAreaUnesco(id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringMediosPublicacionPorAreaUnesco(id_area_unesco, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringMedPubOrdAutPorAreaFraYAñoPub(anio_publicacion, id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringMediosPublicacionPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringMedPubOrdAutPorAreaUneYAñoPub(anio_publicacion, id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringMediosPublicacionPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, numeroCluster).then(async (value) => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster) {
    if (value == 'Error') {
      notify("tr", 'Debido a la cantidad de datos no es posible realizar el número de cluster que ingreso.', "danger");
      return;
    }

    setLoading(true)
    var objeto = JSON.parse(value);
    var id_medio_publicacion = objeto.id_medio_publicacion;
    var orden_autor = objeto.orden_autor;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaMedioPublicacion = Object.values(id_medio_publicacion)
    var listaOrdenAutor = Object.values(orden_autor)
    var listaKMeans_Clusters = Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var resultadoMedioPublicacion = []
    var resultadoMedioPublicacionCluster = []
    for (var i = 0; i < listaMedioPublicacion.length; i++) {
      const registro = {
        id_medio_publicacion: listaMedioPublicacion[i],
        orden_autor: listaOrdenAutor[i],
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i]
      }
      const idArticuloCluster = {
        id_cluster: listaKMeans_Clusters[i],
        id_articulo: listaArticulo[i],
        num_cluster: numeroCluster
      }
      resultadoMedioPublicacionCluster.push(idArticuloCluster)
      resultadoMedioPublicacion.push(registro)
    }

    await publicacionService.obtenerDetalleClusterMediosPublicacion(resultadoMedioPublicacionCluster).then(value => {
      //console.log(value)
      if (value.length != 0) {
        let totales = [];
        let nombre_cluster = [];
        for (var i = 0; i < numeroCluster; i++) {
          let registro_nombre_cluster = { "codigo": i, "nombre": "Cluster " + i }
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterMediosPublicacion(totales);
        setDetalleDatosClusterMediosPublicacion(value);
        setLoading(false);
      }
    })

    medioPublicacionService.listar().then(value => {
      setNumeroMediosPublicacion(value.mediosPublicacion.length);
      setResultadoClusterMediosPublicacionOrdenAutor(resultadoMedioPublicacion);
    });
  }

  async function handleEjecutarClusteringRevNumCit(numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCit(numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringRevNumCitPorAnio(anio_publicacion, numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCitPorAnio(anio_publicacion, numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringRevNumCitPorAreFra(id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCitPorAreaFrascati(id_area_frascati, numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringRevNumCitPorAreUne(id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCitPorAreaUnesco(id_area_unesco, numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringRevNumCitPorAreFraYAniPub(anio_publicacion, id_area_frascati, numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCitPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleEjecutarClusteringRevNumCitPorAreUneYAniPub(anio_publicacion, id_area_unesco, numeroCluster) {
    setLoading(true);
    setTituloGrafico('USO POR MEDIOS PUBLICACIÓN');
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    setResultadoClusterAreas([]);
    setResultadoClusterCuartilAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCitPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster);
      setLoading(false);
    });
  }

  async function handleProcesarDatosClusteringMediosPublicacionReferencias(value, numeroCluster) {
    if (value == 'Error') {
      notify("tr", 'Debido a la cantidad de datos no es posible realizar el número de cluster que ingreso.', "danger");
      return;
    }
    setLoading(true);
    var objeto = JSON.parse(value);
    var revista = objeto.revista;
    var num_citations = objeto.num_citations;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_referencia = objeto.id_referencia
    var nombre_medio_publicacion = objeto.venue
    var listaRevista = Object.values(revista)
    var listaNumCit = Object.values(num_citations)
    var listaKMeans_Clusters = Object.values(KMeans_Clusters)
    var listaReferencia = Object.values(id_referencia)
    var listaNombreMedioPublicacion = Object.values(nombre_medio_publicacion)

    var resultadoRevNumCit = []
    var resultadoMedioPublicacionClusterRef = []
    for (var i = 0; i < listaRevista.length; i++) {
      const registro = {
        revista: listaRevista[i],
        num_citations: listaNumCit[i],
        id_cluster: listaKMeans_Clusters[i],
        id_referencia: listaReferencia[i]
      }
      const idReferenciaCluster = {
        id_cluster: listaKMeans_Clusters[i],
        id_referencia: listaReferencia[i],
        nombre_medio_publicacion: listaNombreMedioPublicacion[i],
        num_cluster: numeroCluster
      }
      resultadoMedioPublicacionClusterRef.push(idReferenciaCluster);
      resultadoRevNumCit.push(registro);
    }

    await publicacionService.obtenerDetalleClusterMediosPublicacionReferencias(resultadoMedioPublicacionClusterRef).then(value => {
      if (value.length != 0) {
        let totales = [];
        let nombre_cluster = [];
        for (var i = 0; i < numeroCluster; i++) {
          let registro_nombre_cluster = { "codigo": i, "nombre": "Cluster " + i }
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterMediosPublicacionReferencias(totales);
        setDetalleDatosClusterMediosPublicacionRef(value);
        setLoading(false);
      }
    })
    setResultadoClusterRevNumCit(resultadoRevNumCit);

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

  async function handleSeleccionarDatosClusterAreas() {
    setLoading(true);
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterAreas');
    let idCluster = document.getElementById("idClusterAreas").value;
    if (idCluster == 'N') {
      console.log('No  ha seleccionado el cluster')
    } else {
      for (var i = 0; i < numero_cluster; i++) {
        if (idCluster == i) {
          await handleValoresUnicosAreas(detalleDatosClusterAreas[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
            setLoading(false)
          })
        }
      }
    }

    await tablaPaginacionService.paginacion('#dataClusterAreas');
  }

  async function handleSeleccionarDatosClusterAreasCuartil() {
    setLoading(true);
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterAreasCuartil');
    let idCluster = document.getElementById("idClusterAreas").value;
    if (idCluster == 'N') {
      console.log('No  ha seleccionado el cluster')
    } else {
      for (var i = 0; i < numero_cluster; i++) {
        if (idCluster == i) {
          setDetalleDatosClusterEsp(detalleDatosClusterAreasCuartil[i][i])
          setLoading(false)
        }
      }
    }

    await tablaPaginacionService.paginacion('#dataClusterAreasCuartil');
  }
  async function handleSeleccionarDatosClusterMediosPublicacion() {
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterMediosPublicacion');
    let idCluster = document.getElementById("idClusterMediosPublicacion").value;
    if (idCluster == 'N') {
      console.log('No  ha seleccionado el cluster')
    } else {
      for (var i = 0; i < numero_cluster; i++) {
        if (idCluster == i) {
          await handleValoresUnicosMediosPublicacion(detalleDatosClusterMediosPublciacion[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
          })
        }
      }
    }
    await tablaPaginacionService.paginacion('#dataClusterMediosPublicacion');
  }

  async function handleSeleccionarDatosClusterMediosPublicacionRef() {
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterMediosPublicacionRef');
    let idCluster = document.getElementById("idClusterMediosPublicacionRef").value;
    if (idCluster == 'N') {
      console.log('No  ha seleccionado el cluster')
    } else {
      for (var i = 0; i < numero_cluster; i++) {
        if (idCluster == i) {
          await handleValoresUnicosMediosPublicacion(detalleDatosClusterMediosPublciacionRef[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
          })
        }
      }
    }
    await tablaPaginacionService.paginacion('#dataClusterMediosPublicacionRef');
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
          if (idAnio == 0 && idAreaFrascati == 0 && idAreaFrascati == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringAreas(numeroCluster);
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaFrascati == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringAreasPorAnio(idAnio, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
        }

        if (idCampo == 2) {
          if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAut(numeroCluster);
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAutPorAnio(idAnio, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAutPorAreaFrascati(idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAutPorAreaUnesco(idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAutPorAreaFraYAñoPub(idAnio, idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringMedPubOrdAutPorAreaUneYAñoPub(idAnio, idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
            notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
          }
        }

        if (idCampo == 3) {
          if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCit(numeroCluster);
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCitPorAnio(idAnio, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCitPorAreFra(idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCitPorAreUne(idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCitPorAreFraYAniPub(idAnio, idAreaFrascati, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringRevNumCitPorAreUneYAniPub(idAnio, idAreaUnesco, numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
          else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
            notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
          }
        }
        if (idCampo == 4) {
          if (idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
            if (validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster)) {
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringCuartilAreasUnesco(numeroCluster)
            } else {
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
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

  /**Muestra los filtros de areas*/
  async function mostrarFiltroAreas() {
    let idCampo = document.getElementById("idCampo").value;
    if (idCampo == 1) {
      document.getElementById("idAreaFrascati").value = "0";
      document.getElementById("idAreaFrascati").disabled = true;
      document.getElementById("idAreaUnesco").value = "0";
      document.getElementById("idAreaUnesco").disabled = true;
    } else {
      document.getElementById("idAreaFrascati").disabled = false;
      document.getElementById("idAreaUnesco").disabled = false;
    }
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
                          <option value="1">Cluster</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Campo</label>
                      <Form.Row>
                        <select className="form-control" id="idCampo" onClick={mostrarFiltroAreas}>
                          <option value="0">Seleccione</option>
                          <option value="1">Áreas</option>
                          <option value="2">Medios Publicacion (Publicaciones)</option>
                          <option value="3">Medios Publicacion (Referencias)</option>
                          <option value="4">Cuartil</option>
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
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Area Frascati</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaFrascati" disabled={filtroPorArea}>
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
                        <select className="form-control" id="idAreaUnesco" disabled={filtroPorArea}>
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
                      <label>NUMERO CLUSTER</label>
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
                {resultadoClusterAreas.length !== 0 && (
                  <ChartClusterAreasUF data={resultadoClusterAreas} w={w} h={h} af={numeroAreaFrascatti} au={numeroAreaUnesco} totales={totalClusterAreas}></ChartClusterAreasUF>
                )}
                {resultadoClusterMediosPublicacionOrdenAutor.length !== 0 && (
                  <ChartClusterMedPubOrdAut data={resultadoClusterMediosPublicacionOrdenAutor} w={w} h={h} mp={numeroMediosPublicacion} oa={ordenAutor} totales={totalClusterMediosPublicacion}></ChartClusterMedPubOrdAut>
                )}
                {resultadoClusterRevNumCit.length !== 0 && (
                  <ChartClusterRevNumCit data={resultadoClusterRevNumCit} w={w} h={h} nr={num_revistas} nc={num_citations} totales={totalClusterMediosPublicacionReferencias}></ChartClusterRevNumCit>
                )}
                {resultadoClusterCuartilAreas.length !== 0 && (
                  <ChartClusterCuartilAreUne data={resultadoClusterCuartilAreas} w={w} h={h} nc={num_cuartil} au={numeroAreaUnesco} totales={totalClusterAreasCuartil}></ChartClusterCuartilAreUne>
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
          {resultadoClusterAreas.length !== 0 && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">DETALLE DE LOS RESULTADOS</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Cluster</label>
                      <Form.Row>
                        <select className="form-control" id="idClusterAreas" onClick={handleSeleccionarDatosClusterAreas}>
                          <option value="N">Seleccione el Cluster</option>
                          {nombre_cluster.map(item => (
                            <option value={item.codigo} key={item.codigo}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <table className="table table-bordered table-hover" id="dataClusterAreas" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>AREA FRASCATI</th>
                        <th>AREA UNESCO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleDatosClusterEsp.map(item => (
                        <tr className="small" key={item.id_articulo}>
                          <td width="15%">{item.areaFrascati}</td>
                          <td width="20%">{item.areaUnesco}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {resultadoClusterMediosPublicacionOrdenAutor.length !== 0 && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">DETALLE DE LOS RESULTADOS</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Cluster</label>
                      <Form.Row>
                        <select className="form-control" id="idClusterMediosPublicacion" onClick={handleSeleccionarDatosClusterMediosPublicacion}>
                          <option value="N">Seleccione el Cluster</option>
                          {nombre_cluster.map(item => (
                            <option value={item.codigo} key={item.codigo}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <table className="table table-bordered table-hover" id="dataClusterMediosPublicacion" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>MEDIO PUBLICACION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleDatosClusterEsp.map(item => (
                        <tr className="small" key={item.id_articulo}>
                          <td width="15%">{item.medioPublicacion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {resultadoClusterRevNumCit.length !== 0 && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">DETALLE DE LOS RESULTADOS</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Cluster</label>
                      <Form.Row>
                        <select className="form-control" id="idClusterMediosPublicacionRef" onClick={handleSeleccionarDatosClusterMediosPublicacionRef}>
                          <option value="N">Seleccione el Cluster</option>
                          {nombre_cluster.map(item => (
                            <option value={item.codigo} key={item.codigo}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <table className="table table-bordered table-hover" id="dataClusterMediosPublicacionRef" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>MEDIO PUBLICACION REFERENCIAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleDatosClusterEsp.map(item => (
                        <tr className="small" key={item.id_referencia}>
                          <td width="15%">{item.medioPublicacion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {resultadoClusterCuartilAreas.length !== 0 && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">DETALLE DE LOS RESULTADOS</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Cluster</label>
                      <Form.Row>
                        <select className="form-control" id="idClusterAreas" onClick={handleSeleccionarDatosClusterAreasCuartil}>
                          <option value="N">Seleccione el Cluster</option>
                          {nombre_cluster.map(item => (
                            <option value={item.codigo} key={item.codigo}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <table className="table table-bordered table-hover" id="dataClusterAreasCuartil" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>AREA UNESCO</th>
                        <th>CUARTIL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleDatosClusterEsp.map(item => (
                        <tr className="small" key={item.id_articulo}>
                          <td width="20%">{item.areaUnesco}</td>
                          <td width="15%">{item.cuartil}</td>
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
