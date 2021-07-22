import React from "react";
import { clusteringService } from '../_services/clustering.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import Chart1 from './Chart1';
import ChartCluster from './ChartCluster';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import ChartClusterAreas from './ChartClusterAreas';
import ChartClusterAreasUF from './ChartClusterAreasUF';
import ChartClusterMedPubOrdAut from './ChartClusterMedPubOrdAut';
import ChartClusterRevNumCit from './ChartClusterRevNumCit';
import {medioPublicacionService} from '../_services/medio_publicacion.service';
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
  const [detalleDatosClusterMediosPublciacion, setDetalleDatosClusterMediosPublicacion] = React.useState([]);
  const [tituloGrafico, setTituloGrafico] = React.useState('');
  const [detalleDatosClusterEsp, setDetalleDatosClusterEsp] = React.useState([]);
  const [resultadoClusterAreas, setResultadoClusterAreas] = React.useState([]);
  const [numeroAreaFrascatti, setNumeroAreaFrascatti] = React.useState(0);
  const [numeroAreaUnesco, setNumeroAreaUnesco] = React.useState(0);
  const [totalClusterAreas, setTotalClusterAreas] = React.useState([]);
  const [totalClusterMediosPublicacion, setTotalClusterMediosPublicacion] = React.useState([]);
  const [resultadoClusterMediosPublicacionOrdenAutor, setResultadoClusterMediosPublicacionOrdenAutor] = React.useState([]);
  const [numeroMediosPublicacion, setNumeroMediosPublicacion] = React.useState(0);
  const [resultadoClusterRevNumCit, setResultadoClusterRevNumCit] = React.useState([]);
  const ordenAutor = 19;
  const num_citations = 300000;
  const num_revistas = 6000;


  async function handleEjecutarClusteringAreas(numeroCluster) { 
    setTituloGrafico('PRODUCTIVIDAD POR ÁREAS');
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarClusterAreas(numeroCluster).then(value => {
      handleProcesarDatosClusteringAreas(value, numeroCluster);
    });
  }

  async function handleEjecutarClusteringAreasPorAnio(anio, numeroCluster) { 
    setTituloGrafico('PRODUCTIVIDAD POR ÁREAS');
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarclusteringAreasPorAnio(anio, numeroCluster).then(async(value) => {
      handleProcesarDatosClusteringAreas(value, numeroCluster);
    });
  }

  async function handleProcesarDatosClusteringAreas(value, numeroCluster) { 
    var objeto = JSON.parse(value);
    var id_area_frascati = objeto.id_area_frascati;
    var id_area_unesco = objeto.id_area_unesco;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaAreaFrascati= Object.values(id_area_frascati)
    var listaAreaUnesco= Object.values(id_area_unesco)
    var listaKMeans_Clusters= Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var resultadoAreas = []
    var resultadoArticuloCluster = []
    for (var i = 0; i<listaAreaFrascati.length; i++){
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


    await publicacionService.obtenerDetalleClusterAreasPub(resultadoArticuloCluster).then( value => {
      if(value.length != 0){
        let totales = [];
        let nombre_cluster = [];
        for (var i=0; i < numeroCluster ; i++){
          let registro_nombre_cluster = {"codigo" : i , "nombre" : "Cluster "+ i}
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterAreas(totales);
        setDetalleDatosClusterAreas(value)
      }
    })

    areaFrascatiService.listaAreasFrascati().then(value => {
      setNumeroAreaFrascatti(value.area_frascati.length)
      areaUnescoService.listaAreasUnesco().then(value => {
        setNumeroAreaUnesco(value.area_unesco.length)
        setResultadoClusterAreas(resultadoAreas);
      });
    });
  }
 

  async function handleEjecutarClusteringMedPubOrdAut(numeroCluster) {
    setTituloGrafico('PRODUCTIVIDAD POR MEDIOS PUBLICACIÓN');
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarClusterMediosPublicacionOrden(numeroCluster).then(value => {
      handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster );
    })
  }

  async function handleProcesarDatosClusteringMediosPublicacion(value, numeroCluster) { 
    var objeto = JSON.parse(value);
    var id_medio_publicacion = objeto.id_medio_publicacion;
    var orden_autor = objeto.orden_autor;
    var KMeans_Clusters = objeto.KMeans_Clusters
    var id_articulo = objeto.id_articulo
    var listaMedioPublicacion= Object.values(id_medio_publicacion)
    var listaOrdenAutor= Object.values(orden_autor)
    var listaKMeans_Clusters= Object.values(KMeans_Clusters)
    var listaArticulo = Object.values(id_articulo)
    var resultadoMedioPublicacion = []
    var resultadoMedioPublicacionCluster = []
    for (var i = 0; i<listaMedioPublicacion.length; i++){
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
      resultadoMedioPublicacionCluster.push(idArticuloCluster )
      resultadoMedioPublicacion.push(registro)
    }

    await publicacionService.obtenerDetalleClusterMediosPublicacion(resultadoMedioPublicacionCluster).then( value => {
      //console.log(value)
      if(value.length != 0){
        let totales = [];
        let nombre_cluster = [];
        for (var i=0; i < numeroCluster ; i++){
          let registro_nombre_cluster = {"codigo" : i , "nombre" : "Cluster "+ i}
          nombre_cluster.push(registro_nombre_cluster)
          totales.push(value[i][i].length)
        }
        setNombreCluster(nombre_cluster);
        setTotalClusterMediosPublicacion(totales);
        setDetalleDatosClusterMediosPublicacion(value)
      }
    })

    medioPublicacionService.listar().then(value => {
      setNumeroMediosPublicacion(value.mediosPublicacion.length);
      setResultadoClusterMediosPublicacionOrdenAutor(resultadoMedioPublicacion);
    });     
  }

  async function handleEjecutarClusteringRevNumCit() { 
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterAreas([]);
    await clusteringService.ejecutarclusteringRevRefNumCit().then(value => {
      //console.log(value)
      var objeto = JSON.parse(value);
      console.log(objeto);
      var revista = objeto.revista;
      var num_citations = objeto.num_citations;
      var KMeans_Clusters = objeto.KMeans_Clusters
      var listaRevista= Object.values(revista)
      var listaNumCit= Object.values(num_citations)
      var listaKMeans_Clusters= Object.values(KMeans_Clusters)
      var resultadoRevNumCit = []
      for (var i = 0; i<listaRevista.length; i++){
        const registro = {
          revista: listaRevista[i],
          num_citations: listaNumCit[i],
          id_cluster: listaKMeans_Clusters[i]
        }
        resultadoRevNumCit.push(registro)
      }
      setResultadoClusterRevNumCit(resultadoRevNumCit);
      
      
    });
  }
  async function handleValoresUnicosAreas(cluster) { 
      let unicos = [];
      for(var i = 0; i < cluster.length; i++) {
        const valor = cluster[i];
        const found = unicos.find(element => element.areaFrascati == valor.areaFrascati && element.areaUnesco == valor.areaUnesco );
        if(found == undefined){
          unicos.push(valor)
        }
      }
      return unicos;
    }
  
  async function handleValoresUnicosMediosPublicacion(cluster) { 
    let unicos = [];
    for(var i = 0; i < cluster.length; i++) {
      const valor = cluster[i];
      const found = unicos.find(element => element.medioPublicacion == valor.medioPublicacion);
      if(found == undefined){
        unicos.push(valor)
      }
    }
    return unicos;
  }
  
  async function handleSeleccionarDatosClusterAreas() { 
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterAreas');
    let idCluster = document.getElementById("idClusterAreas").value;
    if(idCluster == 'N'){
      console.log('No  ha seleccionado el cluster')
    }else{
      for (var i = 0; i < numero_cluster; i++){
        if(idCluster == i){
          //console.log(detalleDatosClusterAreas[i][i])
          await handleValoresUnicosAreas(detalleDatosClusterAreas[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
          })
        }
      }
    }
    await tablaPaginacionService.paginacion('#dataClusterAreas');
  }

  async function handleSeleccionarDatosClusterMediosPublicacion() { 
    setDetalleDatosClusterEsp([]);
    await tablaPaginacionService.destruirTabla('#dataClusterMediosPublicacion');
    let idCluster = document.getElementById("idClusterMediosPublicacion").value;
    if(idCluster == 'N'){
      console.log('No  ha seleccionado el cluster')
    }else{
      for (var i = 0; i < numero_cluster; i++){
        if(idCluster == i){
          //console.log(detalleDatosClusterMediosPublciacion[i][i])
          await handleValoresUnicosMediosPublicacion(detalleDatosClusterMediosPublciacion[i][i]).then(value => {
            setDetalleDatosClusterEsp(value)
          })
        }
      }
    }
    await tablaPaginacionService.paginacion('#dataClusterMediosPublicacion');
  }
  
  async function handleEjecutarOperacion() { 
    setDetalleDatosClusterEsp([]);
    setNombreCluster([]);
    let idOperacion = document.getElementById("idOperacion").value;
    let idCampo = document.getElementById("idCampo").value;
    let idFiltro = document.getElementById("idFiltro").value;
    let idAnio = parseInt(document.getElementById("idAnio").value);
    let numeroCluster = parseInt(document.getElementById("numeroClusterText").value);
    if(idOperacion != 0){
      if(idCampo != 0){
        if(idCampo == 1){
          if(idFiltro != 0){
            if(idFiltro == 'Anio'){
              if(idAnio != 0){
                setNumeroCluster(numeroCluster);
                handleEjecutarClusteringAreasPorAnio(idAnio, numeroCluster)
              }else{
                notify("tr", 'Seleccione el Año.', "danger");
              }
            }
          }else{
            if(validacionInputService.esNumero(numeroCluster) && validacionInputService.campoVacio(numeroCluster) ){
              setNumeroCluster(numeroCluster);
              handleEjecutarClusteringAreas(numeroCluster);
            }else{
              notify("tr", 'El número de cluster ingresado no es válido.', "danger");
            }
          }
        }
        if(idCampo == 2){
          handleEjecutarClusteringMedPubOrdAut(numeroCluster)
          setNumeroCluster(numeroCluster)
        }
      }
      else{
        notify("tr", 'Seleccione el campo.', "danger");
      }
    }else{
      notify("tr", 'Seleccione la operación.', "danger");
    }

  }

  const w = 900;
  const h = 500;
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
              <Card.Header>
                <Card.Title as="h4">MINERÍA DE DATOS</Card.Title>
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
                          <select className="form-control" id="idCampo">
                            <option value="0">Seleccione</option>
                            <option value="1">Áreas</option>
                            <option value="2">Medios Publicacion</option>
                          </select>
                        </Form.Row>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label>Filtro</label>
                        <Form.Row>
                          <select className="form-control" id="idFiltro">
                            <option value="0">Ninguno</option>
                            <option value="Anio">Año</option>
                          </select>
                        </Form.Row>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="1">
                      <Form.Group>
                        <label>Anio</label>
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
                    <Col className="pr-1" md="1">
                      <Form.Group>
                        <label>NUMERO CLUSTER</label>
                        <Form.Control
                          id="numeroClusterText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
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
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">{tituloGrafico}</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                {resultadoClusterAreas.length !== 0 && (
                  <ChartClusterAreasUF data={resultadoClusterAreas} w={w} h={h} af={numeroAreaFrascatti} au={numeroAreaUnesco} totales={totalClusterAreas}></ChartClusterAreasUF>
                )}
                {resultadoClusterMediosPublicacionOrdenAutor.length !== 0 && (
                  <ChartClusterMedPubOrdAut data={resultadoClusterMediosPublicacionOrdenAutor} w={w} h={h} mp={numeroMediosPublicacion} oa = {ordenAutor} totales={totalClusterMediosPublicacion}></ChartClusterMedPubOrdAut>
                )}
                {resultadoClusterRevNumCit.length !== 0 && (
                  <ChartClusterRevNumCit data={resultadoClusterRevNumCit} w={w} h={h} nr={num_revistas} nc = {num_citations} ></ChartClusterRevNumCit>
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
                          <select className="form-control" id="idClusterAreas" onClick = {handleSeleccionarDatosClusterAreas}>
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
                          <select className="form-control" id="idClusterMediosPublicacion" onClick = {handleSeleccionarDatosClusterMediosPublicacion}>
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
        </Row>
      </Container>
    </>
  );
}

export default AnalisisDataMining;
