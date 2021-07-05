import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { publicacionService } from '../_services/publicacion.service';
import { Link } from "react-router-dom";
import { referenciaService } from '../_services/referencia.service';

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
function Referencias() {
  const [publicaciones, setPublicaciones] = React.useState([]);
  const [referencias, setReferencias] = React.useState([]);

  async function handleCargarReferencias(id_articulo, titulo, autor, anio_publicacion) {
    await tablaPaginacionService.destruirTabla('#dataTableReferencias');
    await referenciaService.listarReferenciasNoEcontradasPorIdArticulo(id_articulo).then(value => {
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferencias');
  }

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
              <table className="table table-bordered table-hover" id="dataTablePublicaciones" width="100%" cellSpacing="0">
                <thead className="thead-dark">
                  <tr>
                    <th>AUTOR</th>
                    <th>TITULO</th>
                    <th>AÑO</th>
                    <th>TIPO PUBLICACIÓN</th>
                    <th>MEDIO PUBLICACIÓN</th>
                    <th>AREA UNESCO</th>
                    <th>AREA FRASCATI</th>
                    <th>FUENTE</th>
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map(item => (
                    <tr className="small" key={item.id_articulo} onClick={() => handleCargarReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion)}>
                      <td width="15%">{item.nombres}</td>
                      <td width="20%">{item.titulo}</td>
                      <td width="5%">{item.anio_publicacion}</td>
                      <td width="7%">{item.tipo_publicacion}</td>
                      <td width="20%">{item.nombre}</td>
                      <td width="5%">{item.descripcion_unesco}</td>
                      <td width="5%">{item.descripcion}</td>
                      <td width="5%">{item.nombre_base_datos_digital}</td>
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
              <Card.Title as="h4">Referencias Pendiente Obtención Detalle</Card.Title>
              <p className="card-category">
                Titulo de la Publicacion
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-3">
              <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                <thead className="thead-dark">
                  <tr>
                    <th>ID REFERENCIA</th>
                    <th>REFERENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {referencias.map(item => (
                    <tr className="small" key={item.id_referencia}>
                      <td width="10%">{item.id_referencia}</td>
                      <td>{item.referencia}</td>
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

export default Referencias;
