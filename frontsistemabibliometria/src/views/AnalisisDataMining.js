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
function AnalisisDataMining() {
  
  const [resultadoClusterAreas, setResultadoClusterAreas] = React.useState([]);
  const [numeroAreaFrascatti, setNumeroAreaFrascatti] = React.useState(0);
  const [numeroAreaUnesco, setNumeroAreaUnesco] = React.useState(0);
  const [resultadoClusterMediosPublicacionOrdenAutor, setResultadoClusterMediosPublicacionOrdenAutor] = React.useState([]);
  const [numeroMediosPublicacion, setNumeroMediosPublicacion] = React.useState(0);
  const [resultadoClusterRevNumCit, setResultadoClusterRevNumCit] = React.useState([]);
  const ordenAutor = 19;
  const num_citations = 300000;
  const num_revistas = 6000;


  async function handleEjecutarClustering() { 
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
  const w = 600;
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
                <Card.Title as="h4">Resultados</Card.Title>
                <p className="card-category">
                  Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                {resultadoClusterAreas.length !== 0 && (
                  <ChartClusterAreasUF data={resultadoClusterAreas} w={w} h={h} af={numeroAreaFrascatti} au={numeroAreaUnesco}></ChartClusterAreasUF>
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
        </Row>
      </Container>
    </>
  );
}

export default AnalisisDataMining;
