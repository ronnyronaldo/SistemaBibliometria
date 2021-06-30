import React from "react";
import {baseDatosDigitalService} from '../_services/baseDatosDigital.service';
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
function BaseDatosDigital() {
  const [baseDatosDigital, setBaseDatosDigital] = React.useState([]);
  
  async function handleCargarBaseDatosDigitales() {
    await tablaPaginacionService.destruirTabla('#dataTableBaseDatosDigitales');
    await baseDatosDigitalService.listar().then(value => {
      console.log(value)
      setBaseDatosDigital(value.base_datos_digital);
    });
    await tablaPaginacionService.paginacion('#dataTableBaseDatosDigitales');
  }

  React.useEffect(() => {
    handleCargarBaseDatosDigitales();
  }, []);
  return (
    <>

      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Base de Datos Digitales</Card.Title>
                <p className="card-category">
                  Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableBaseDatosDigitales" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>NOMBRE</th>
                      <th>PROVEEDOR</th>
                      <th>COSTO ACTUAL</th>
                      <th>SUSCRIPCION/DESCRIPCION</th>
                      <th>AREA/SERVICIO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baseDatosDigital.map(item => (
                      <tr className="small" key={item.id_base_datos_digital}>
                        <td >{item.id_base_datos_digital}</td>
                        <td >{item.nombre_base_datos_digital}</td>
                        <td >{item.proveedor}</td>
                        <td >{item.costo_actual}</td>
                        <td >{item.suscripcion_descripcion}</td>
                        <td >{item.area_servicio}</td>
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

export default BaseDatosDigital;
