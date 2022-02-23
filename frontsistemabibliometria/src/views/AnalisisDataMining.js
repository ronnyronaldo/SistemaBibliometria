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
  const [opcionPantalla, setOpcionPantalla] = React.useState("tabla");

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


  function graficarCluster(){
    Highcharts.chart({

      chart: {
              renderTo: "redes-autores-grafo"
          },
      title: {
          text: 'Predicción del numero de búsquedas de los siguientes 6 meses'
      },
      yAxis: {
          title: {
              text: 'Número de Búsquedas'
          }
      },
      xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar','Apr'],
          accessibility: {
              rangeDescription: 'Meses'
          }
      },
  
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },
  
      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
          }
      },
  
      series: [{
          name: 'Predicción',
          data: ['','','','','','','','','','',8561, 7400, 8371, 6352, 5002, 6798]
      }, {
          name: 'Número de búsquedas',
          data: [5957, 1481, 924, 2147, 2537, 1196, 3841, 3650, 3100, 10392]
      // }, {
      //     name: 'Sales & Distribution',
      //     data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      // }, {
      //     name: 'Project Development',
      //     data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
      // }, {
      //     name: 'Other',
      //     data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
      // }
      }],
  
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
      }
  
  });
    // Highcharts.chart({
    //   chart: {
    //       type: 'scatter',
    //       zoomType: 'xy',
    //       renderTo: "redes-autores-grafo"
    //   },
    //   title: {
    //       text: 'Numero de citas Versus Numero de busquedas de Medios de publicacion por Nombre de Pub'
    //   },
    //   subtitle: {
    //       text: 'Num Citas vs Num Busquedas'
    //   },
    //   credits:{
    //     enabled :false
    //   },
    //   xAxis: {
    //       title: {
    //           enabled: true,
    //           text: 'Numero de citas'
    //       },
    //       startOnTick: true,
    //       endOnTick: true,
    //       showLastLabel: true
    //   },
    //   yAxis: {
    //       title: {
    //           text: 'Numero de busquedas'
    //       }
    //   },
    //   legend: {
    //       layout: 'vertical',
    //       align: 'left',
    //       verticalAlign: 'top',
    //       x: 100,
    //       y: 70,
    //       floating: true,
    //       backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
    //       borderWidth: 1
    //   },
    //   plotOptions: {
    //       scatter: {
    //           marker: {
    //               radius: 5,
    //               states: {
    //                   hover: {
    //                       enabled: true,
    //                       lineColor: 'rgb(100,100,100)'
    //                   }
    //               }
    //           },
    //           states: {
    //               hover: {
    //                   marker: {
    //                       enabled: false
    //                   }
    //               }
    //           },
    //           tooltip: {
    //               headerFormat: '<b>{series.name}</b><br>',
    //               pointFormat: '{point.x} cm, {point.y} kg'
    //           }
    //       }
    //   },
    //   series: [{
    //       name: 'Journal Y',
    //       color: 'rgba(223, 83, 83, .5)',
    //       data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
    //           [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
    //           [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
    //           [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
    //           [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
    //           [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
    //           [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
    //           [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
    //           [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
    //           [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
    //           [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
    //           [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
    //           [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
    //           [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
    //           [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
    //           [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
    //           [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
    //           [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
    //           [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
    //           [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
    //           [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
    //           [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
    //           [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
    //           [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
    //           [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
    //           [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
    //           [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
    //           [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
    //           [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
    //           [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
    //           [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
    //           [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
    //           [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
    //           [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
    //           [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
    //           [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
    //           [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
    //           [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
    //           [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
    //           [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
    //           [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
    //           [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
    //           [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
    //           [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
    //           [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
    //           [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
    //           [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
    //           [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
    //           [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
    //           [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
    //           [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
    //           [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]
  
    //   }, {
    //       name: 'Journal X',
    //       color: 'rgba(119, 152, 191, .5)',
    //       data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
    //           [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
    //           [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
    //           [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
    //           [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
    //           [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
    //           [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
    //           [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
    //           [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
    //           [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
    //           [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
    //           [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
    //           [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
    //           [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
    //           [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
    //           [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
    //           [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
    //           [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
    //           [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
    //           [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
    //           [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
    //           [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
    //           [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
    //           [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
    //           [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
    //           [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
    //           [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
    //           [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
    //           [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
    //           [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
    //           [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
    //           [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
    //           [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
    //           [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
    //           [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
    //           [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
    //           [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
    //           [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
    //           [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
    //           [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
    //           [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
    //           [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
    //           [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
    //           [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
    //           [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
    //           [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
    //           [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
    //           [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
    //           [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
    //           [180.3, 83.2], [180.3, 83.2]]
    //   }]
    // });
  }

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

  async function handleGraficoCluster() {
    setLoading(true);
    graficarCluster();
    setLoading(false);
  }
  async function handleOpcionPantalla(opcion) { // Cargo los datos en Pantalla
    if(opcionPantalla == "graficot"){
      await handleGraficoCluster();
    }
    // if (opcionPantalla == "grafico") {
    //   await handleEjecutarOperacion();
    // } else if ((opcionPantalla == "tabla")) {
    //   await handleEjecutarOperacionEstadistica();
    // }
    
    await setOpcionPantalla(opcion);
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
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <div className="navbar-nav">
                    {/* <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("tabla")}>Agrupamiento</a> */}
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("grafico")}>Estadísticas de los datos</a>
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("graficot")}>Predicción</a>
                  </div>
                </div>
              </nav>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* {opcionPantalla === 'tabla' && (
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">AGRUPAMIENTO</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="6">
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
                  <Col className="pr-1" md="12">
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
        )} */}
        {opcionPantalla === 'grafico'&& (
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">ESTADISTICAS DE LOS DATOS</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="6">
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
          
        )}
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
          
      {opcionPantalla === 'graficot' && (
        <Col md="12">
            <Card>
                <Card.Header>
                  <Card.Title as="h4">PREDICCIÓN</Card.Title>
                  <div id="redes-autores-grafo"></div>
                </Card.Header>
              <Col className="pr-1" md="12">
                
              </Col>
                
            </Card>
          </Col>
      )}
      </Row>
      </Container>
    </>
  );
}

export default AnalisisDataMining;
