import React from "react";
import {medioPublicacionService} from '../_services/medio_publicacion.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
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
function MedioPublicacion() {
  const [mediosPublicacion, setMediosPublicacion] = React.useState([]);

  async function handleCargarMediosPublicacion() {
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacion');
    await medioPublicacionService.listar().then(value => {
      setMediosPublicacion(value.mediosPublicacion);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacion');
  }
  React.useEffect(() => {
    handleCargarMediosPublicacion();
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
        <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Medios de Publicación</Card.Title>
                <p className="card-category">
                  Medios de Publicación donde se encuentran publicados los documentos de los investigadores con filiacion a la Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableMediosPublicacion" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>NOMBRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediosPublicacion.map(item => (
                      <tr className="small" key={item.id_medio_publicacion}>
                        <td>{item.id_medio_publicacion}</td>
                        <td>{item.nombre}</td>
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

export default MedioPublicacion;
