import React from "react";
import { clusteringService } from '../_services/clustering.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import Chart1 from './Chart1';
import ChartCluster from './ChartCluster';
import ChartClusterAreas from './ChartClusterAreas';
import ChartClusterAreasV2 from './ChartClusterAreasV2';
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

  async function handleEjecutarClustering() {
    await clusteringService.clusterAreas().then(value => {
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
      setResultadoClusterAreas(resultadoAreas);
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
                          defaultValue="CLUSTERING"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleEjecutarClustering}
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
                  <ChartClusterAreasV2 data={resultadoClusterAreas} w={w} h={h}></ChartClusterAreasV2>
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
