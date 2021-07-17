import React from "react";
import {baseDatosDigitalService} from '../_services/baseDatosDigital.service';
import {estadisticasUsoService} from '../_services/estadisticasUso.service';
import {Bar} from 'react-chartjs-2';

/**Spinner */
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
function EstadisticasProveedores() {
  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */
  const [baseDatosDigital, setBaseDatosDigital] = React.useState([]);
  const [etiquetas, setEtiquetas] = React.useState([]);
  const [datos, setDatos] = React.useState([]);
  const [nombreBaseDatosDigital, setNombreBaseDatosDigital] = React.useState('');
  const data = {
    labels: etiquetas,
    datasets:[{
      label:'Número de búsquedas',
      backgroundColor: '#081F2E',
      borderColor: 'black',
      borderWidth: 1,
      hoverBackgroundColor: '#0C4E78',
      hoverBorderColor: 'white',
      data:datos
    }]
  }
  const opciones={
    maintainAspectRatio: false,
    responsive: true,
  }

  async function handleCargarBaseDatosDigitales() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableBaseDatosDigitales');
    await baseDatosDigitalService.listar().then(value => {
      setBaseDatosDigital(value.base_datos_digital);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableBaseDatosDigitales');
  }

  async function handleCargarEstadisticasUso(id_base_datos_digital, nombre_base_datos_digital) {
    setLoading(true);
    setNombreBaseDatosDigital(nombre_base_datos_digital)
    await estadisticasUsoService.listarEstadisticasUsoPorId(id_base_datos_digital).then(value => {
      var estadisticas_uso = value.estadisticas_uso
      let etiquetas = []
      let datos = []
      for (var i=0; i<estadisticas_uso.length;i++) {
        etiquetas.push(estadisticas_uso[i].mes+'-'+estadisticas_uso[i].año) 
        datos.push(estadisticas_uso[i].numero_busquedas)
      }
      setEtiquetas(etiquetas)
      setDatos(datos)
      setLoading(false);
    });   
  }

  React.useEffect(() => {
    handleCargarBaseDatosDigitales();
  }, []);
  return (
    <>
      <FadeLoader loading={loading} css={override} size={50} />
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
                    </tr>
                  </thead>
                  <tbody>
                    {baseDatosDigital.map(item => (
                      <tr className="small" key={item.id_base_datos_digital} onClick={() => handleCargarEstadisticasUso(item.id_base_datos_digital, item.nombre_base_datos_digital)}>
                        <td >{item.id_base_datos_digital}</td>
                        <td >{item.nombre_base_datos_digital}</td>
                        <td >{item.proveedor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Estadísticas de Búsqueda {nombreBaseDatosDigital.toUpperCase() }</Card.Title>
                <p className="card-category">
                  Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <div style={{width:'100%', height:'400px'}}>
                  <Bar data={data} options={opciones}></Bar>
                </div>
               
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default EstadisticasProveedores;
