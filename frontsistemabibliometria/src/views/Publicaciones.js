import React from "react";

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
  const datos =
    [{
      autores: "García-Ávila F., Avilés-Añazco A., Ordoñez-Jara J., Guanuchi-Quezada C., Flores del Pino L., Ramos-Fernández L.",
      año: "2021",
      titulo: "Modeling of residual chlorine in a drinking water network in times of pandemic of the SARS-CoV-2 (COVID-19)",
      tituloFuente: "Sustainable Environment Research",
      nroCitaciones: "0",
      doi: "10.1186/s42834-021-00084-w",
      link: "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85102279757&doi=10.1186%2fs42834-021-00084-w&partnerID=40&md5=35c88168053f290b54868b14232e0a1b",
      tipoDocumento: "Article",
      accesoAbierto: "SI",
      baseDatosFuente: "Scopus"
    }, {
      autores: "García-Ávila F., Avilés-Añazco A., Ordoñez-Jara J., Guanuchi-Quezada C., Flores del Pino L., Ramos-Fernández L.",
      año: "2021",
      titulo: "Modeling of residual chlorine in a drinking water network in times of pandemic of the SARS-CoV-2 (COVID-19)",
      tituloFuente: "Sustainable Environment Research",
      nroCitaciones: "0",
      doi: "10.1186/s42834-021-00084-w",
      link: "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85102279757&doi=10.1186%2fs42834-021-00084-w&partnerID=40&md5=35c88168053f290b54868b14232e0a1b",
      tipoDocumento: "Article",
      accesoAbierto: "SI",
      baseDatosFuente: "Scopus"
    },
    {
      autores: "García-Ávila F., Avilés-Añazco A., Ordoñez-Jara J., Guanuchi-Quezada C., Flores del Pino L., Ramos-Fernández L.",
      año: "2021",
      titulo: "Modeling of residual chlorine in a drinking water network in times of pandemic of the SARS-CoV-2 (COVID-19)",
      tituloFuente: "Sustainable Environment Research",
      nroCitaciones: "0",
      doi: "10.1186/s42834-021-00084-w",
      link: "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85102279757&doi=10.1186%2fs42834-021-00084-w&partnerID=40&md5=35c88168053f290b54868b14232e0a1b",
      tipoDocumento: "Article",
      accesoAbierto: "SI",
      baseDatosFuente: "Scopus"
    },
    {
      autores: "García-Ávila F., Avilés-Añazco A., Ordoñez-Jara J., Guanuchi-Quezada C., Flores del Pino L., Ramos-Fernández L.",
      año: "2021",
      titulo: "Modeling of residual chlorine in a drinking water network in times of pandemic of the SARS-CoV-2 (COVID-19)",
      tituloFuente: "Sustainable Environment Research",
      nroCitaciones: "0",
      doi: "10.1186/s42834-021-00084-w",
      link: "https://www.scopus.com/inward/record.uri?eid=2-s2.0-85102279757&doi=10.1186%2fs42834-021-00084-w&partnerID=40&md5=35c88168053f290b54868b14232e0a1b",
      tipoDocumento: "Article",
      accesoAbierto: "SI",
      baseDatosFuente: "Scopus"
    }]
  async function handleCargarDatosPublicaciones() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicaciones');
    await setPublicaciones(datos);
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
                      <tr className="small">
                        <td width="20%">{item.autores}</td>
                        <td width="20%">{item.titulo}</td>
                        <td width="3%">{item.año}</td>
                        <td width="15%">{item.tituloFuente}</td>
                        <td width="5%">{item.nroCitaciones}</td>
                        <td width="15%">{item.doi}</td>
                        <td>{item.tipoDocumento}</td>
                        <td>{item.accesoAbierto}</td>
                        <td>{item.baseDatosFuente}</td>
                        <td><a href={item.link} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a></td>
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
                    {publicaciones.map(item => (
                      <tr className="small">
                        <td width="20%">{item.autores}</td>
                        <td width="20%">{item.titulo}</td>
                        <td width="3%">{item.año}</td>
                        <td width="15%">{item.tituloFuente}</td>
                        <td width="5%">{item.nroCitaciones}</td>
                        <td width="15%">{item.doi}</td>
                        <td>{item.tipoDocumento}</td>
                        <td>{item.accesoAbierto}</td>
                        <td>{item.baseDatosFuente}</td>
                        <td><a href={item.link} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a></td>
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

export default TableList;
