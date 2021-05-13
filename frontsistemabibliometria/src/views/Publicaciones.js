import React from "react";
import {publicacionService} from '../_services/publicacion.service';
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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
function TableList() {
  const [publicaciones, setPublicaciones] = React.useState([]);

  async function handleCargarDatosPublicaciones() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicaciones');
    await publicacionService.listar().then(value => {
      setPublicaciones(value.articulos);
    });
    await tablaPaginacionService.paginacion('#dataTablePublicaciones');
  }
  React.useEffect(() => {
    handleCargarDatosPublicaciones();
  }, []);
  return (
    <>

      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Publicaciones</Card.Title>
                <p className="card-category">
                  Investigadores con filiación a la Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTablePublicaciones" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>AUTOR</th>
                      <th>TITULO</th>
                      <th>AÑO</th>
                      <th>TITULO FUENTE</th>
                      <th>NRO CITACIONES</th>
                      <th>DOI</th>
                      <th>TIPO DOCUMENTO</th>
                      <th>ACCESO ABIERTO</th>
                      <th>BASE DE DATOS FUENTE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones.map(item => (
                      <tr className="small" key={item.id_article}>
                        <td width="20%">{item.Authors}</td>
                        <td width="20%">{item.Title}</td>
                        <td width="3%">{item.Year}</td>
                        <td width="15%">{item.Source_Title}</td>
                        <td width="5%">{item.Cited_by}</td>
                        <td width="15%">{item.DOI}</td>
                        <td>{item.Document_Type}</td>
                        <td>{item.Open_Access}</td>
                        <td>{item.Source}</td>
                        <td><a href={item.Link} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Referencias</Card.Title>
                <p className="card-category">
                  Publicaciones de los investigadores de la Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>AUTOR</th>
                      <th>TITULO</th>
                      <th>AÑO</th>
                      <th>TITULO FUENTE</th>
                      <th>NRO CITACIONES</th>
                      <th>DOI</th>
                      <th>TIPO DOCUMENTO</th>
                      <th>ACCESO ABIERTO</th>
                      <th>BASE DE DATOS FUENTE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
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

export default TableList;
