import React from "react";
import { clusteringService } from '../_services/clustering.service';
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
  
  const [detalleDatosClusterAreas, setDetalleDatosClusterAreas] = React.useState([]);
  const [tituloGrafico, setTituloGrafico] = React.useState('');
  const [detalleDatosClusterEspAreas, setDetalleDatosClusterEspAreas] = React.useState([]);
  const [resultadoClusterAreas, setResultadoClusterAreas] = React.useState([]);
  const [numeroAreaFrascatti, setNumeroAreaFrascatti] = React.useState(0);
  const [numeroAreaUnesco, setNumeroAreaUnesco] = React.useState(0);
  const [totalClusterAreasPorAnio, setTotalClusterAreasPorAnio] = React.useState([]);
  const [resultadoClusterMediosPublicacionOrdenAutor, setResultadoClusterMediosPublicacionOrdenAutor] = React.useState([]);
  const [numeroMediosPublicacion, setNumeroMediosPublicacion] = React.useState(0);
  const [resultadoClusterRevNumCit, setResultadoClusterRevNumCit] = React.useState([]);
  const ordenAutor = 19;
  const num_citations = 300000;
  const num_revistas = 6000;


  async function handleEjecutarClustering() { 
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarClusterAreas().then(value => {
      //console.log(value)
      var objeto = JSON.parse(value);
      var id_area_frascati = objeto.id_area_frascati;
      var id_area_unesco = objeto.id_area_unesco;
      var KMeans_Clusters = objeto.KMeans_Clusters
      var listaAreaFrascati= Object.values(id_area_frascati)
      var listaAreaUnesco= Object.values(id_area_unesco)
      var listaKMeans_Clusters= Object.values(KMeans_Clusters)
      var resultadoAreas = []
      for (var i = 0; i<listaAreaFrascati.length; i++){
        const registro = {
          id_area_frascati: listaAreaFrascati[i],
          id_area_unesco: listaAreaUnesco[i],
          id_cluster: listaKMeans_Clusters[i]
        }
        resultadoAreas.push(registro)
      }
     
      areaFrascatiService.listaAreasFrascati().then(value => {
        setNumeroAreaFrascatti(value.area_frascati.length)
        areaUnescoService.listaAreasUnesco().then(value => {
          setNumeroAreaUnesco(value.area_unesco.length)
          setResultadoClusterAreas(resultadoAreas);
        });
      });
      
      
    });
  }

  async function handleEjecutarClusteringAreasPorAnio() { 
    setTituloGrafico('PRODUCTIVIDAD POR AREAS');
    setResultadoClusterAreas([]);
    setResultadoClusterMediosPublicacionOrdenAutor([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarclusteringAreasPorAnio(2018).then(async(value) => {
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
          id_articulo: listaArticulo[i]
        }
        resultadoArticuloCluster.push(idArticuloCluster)
        resultadoAreas.push(registro)
      }

  
      await publicacionService.obtenerDetalleClusterAreasPub(resultadoArticuloCluster).then( value => {
        let totales = [value[0].cluster1.length, value[0].cluster2.length, value[0].cluster3.length, value[0].cluster4.length, value[0].cluster5.length, value[0].cluster6.length, value[0].cluster7.length]
        setTotalClusterAreasPorAnio(totales);
        if(value.length != 0){
          setDetalleDatosClusterAreas(value[0])
        }
      })

      areaFrascatiService.listaAreasFrascati().then(value => {
        setNumeroAreaFrascatti(value.area_frascati.length)
        areaUnescoService.listaAreasUnesco().then(value => {
          setNumeroAreaUnesco(value.area_unesco.length)
          setResultadoClusterAreas(resultadoAreas);
        });
      });
    });
  }

  async function handleEjecutarClusteringMedPubOrdAut() {
    setResultadoClusterAreas([]);
    setResultadoClusterRevNumCit([]);
    await clusteringService.ejecutarClusterMediosPublicacionOrden().then(value => {
      //console.log(value)
      var objeto = JSON.parse(value);
      var id_medio_publicacion = objeto.id_medio_publicacion;
      var orden_autor = objeto.orden_autor;
      var KMeans_Clusters = objeto.KMeans_Clusters
      var listaMedioPublicacion= Object.values(id_medio_publicacion)
      var listaOrdenAutor= Object.values(orden_autor)
      var listaKMeans_Clusters= Object.values(KMeans_Clusters)
      var resultadoMedioPublicacion = []
      for (var i = 0; i<listaMedioPublicacion.length; i++){
        const registro = {
          id_medio_publicacion: listaMedioPublicacion[i],
          orden_autor: listaOrdenAutor[i],
          id_cluster: listaKMeans_Clusters[i]
        }
        resultadoMedioPublicacion.push(registro)
      }
      medioPublicacionService.listar().then(value => {
        setNumeroMediosPublicacion(value.mediosPublicacion.length);
        setResultadoClusterMediosPublicacionOrdenAutor(resultadoMedioPublicacion);
      });     
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
  async function handleValoresUnicos(cluster) { 
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
  
  async function handleSeleccionarDatosCluster() { 
    setDetalleDatosClusterEspAreas([]);
    await tablaPaginacionService.destruirTabla('#dataClusterAreas');
    let idCluster = document.getElementById("idCluster").value;
    if(idCluster == 0){
      console.log('No  ha seleccionado el cluster')
    }
    if(idCluster == 1){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster1).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 2){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster2).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 3){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster3).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 4){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster4).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 5){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster5).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 6){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster6).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    if(idCluster == 7){
      await handleValoresUnicos(detalleDatosClusterAreas.cluster7).then(value => {
        setDetalleDatosClusterEspAreas(value)
      })
    }
    await tablaPaginacionService.paginacion('#dataClusterAreas');
  }
  const w = 900;
  const h = 500;
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Operaciones</Card.Title>
                <p className="card-category">
                  Técnicas de Minería de Datos
                </p>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="CLUSTERING AREAS"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleEjecutarClustering}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="CLUSTERING AREAS"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleEjecutarClusteringAreasPorAnio}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="CLUSTERING M. DE PUBLICACION"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleEjecutarClusteringMedPubOrdAut}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="CLUSTERING REVISTAS REFERENCIAS"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleEjecutarClusteringRevNumCit}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
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
                  <ChartClusterAreasUF data={resultadoClusterAreas} w={w} h={h} af={numeroAreaFrascatti} au={numeroAreaUnesco} totales={totalClusterAreasPorAnio}></ChartClusterAreasUF>
                )}
                {resultadoClusterMediosPublicacionOrdenAutor.length !== 0 && (
                  <ChartClusterMedPubOrdAut data={resultadoClusterMediosPublicacionOrdenAutor} w={w} h={h} mp={numeroMediosPublicacion} oa = {ordenAutor} ></ChartClusterMedPubOrdAut>
                )}
                {resultadoClusterRevNumCit.length !== 0 && (
                  <ChartClusterRevNumCit data={resultadoClusterRevNumCit} w={w} h={h} nr={num_revistas} nc = {num_citations} ></ChartClusterRevNumCit>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Datos</Card.Title>
                <p className="card-category">
                  Detalle de los resultados de cada cluster
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>Cluster</label>
                      <Form.Row>
                        <select className="form-control" id="idCluster" onClick = {handleSeleccionarDatosCluster}>
                          <option value="0">Seleccione el Cluster</option>
                          <option value="1">Cluster 1</option>
                          <option value="2">Cluster 2</option>
                          <option value="3">Cluster 3</option>
                          <option value="4">Cluster 4</option>
                          <option value="5">Cluster 5</option>
                          <option value="6">Cluster 6</option>
                          <option value="7">Cluster 7</option>
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
                    {detalleDatosClusterEspAreas.map(item => (
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
        </Row>
      </Container>
    </>
  );
}

export default AnalisisDataMining;
