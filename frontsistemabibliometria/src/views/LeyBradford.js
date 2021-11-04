import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { validacionInputService } from '../_services/validacionInput.service';
import { medioPublicacionService } from '../_services/medio_publicacion.service';
import { leyBradfordService } from '../_services/ley_bradford.service';
import { Link } from "react-router-dom";
import logo from '../images/formula.PNG';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";


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
  Form,
  Modal
} from "react-bootstrap";
function LeyBradford() {
  const notificationAlertRef = React.useRef(null);
  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [datosLeyBradford, setDatosLeyBradford] = React.useState([]);
  const notify = (place, mensaje, type) => {
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
  /** Carga las areas frascati para el filtro*/
  async function handleAreasFrascati() {
    setLoading(true);
    await areaFrascatiService.listaAreasFrascati().then(value => {
      setAreasFrascati(value.area_frascati);
      setLoading(false);
    });
  }
  /**Carga las areas unesco para el filtro */
  async function handleAreasUnesco() {
    setLoading(true);
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
  }
  async function handleCargarDatosLeyBradford() {
    setDatosLeyBradford([]);
    let idAnioDesde = parseInt(document.getElementById("idAnioDesde").value);
    let idAnioHasta = parseInt(document.getElementById("idAnioHasta").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);

    if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacion().then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacion().then(value => {
          console.log(value);
          setLoading(false);
        });
      });

    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAnio(idAnioDesde, idAnioHasta).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAnio(idAnioDesde, idAnioHasta).then(value => {
          console.log(value);
          setLoading(false);
        });
      });

    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascati(idAreaFrascati).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascati(idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnesco(idAreaUnesco).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnesco(idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
      notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
    }
    await handleListarDatosLeyBradford();
  }
  async function handleListarDatosLeyBradford() {
    await tablaPaginacionService.destruirTabla('#dataTableLeyBradford');
    await leyBradfordService.listar().then(value => {
      if (value.respuesta.error == "False") {
        //notify("tr", value.respuesta.valor, "primary");
        setDatosLeyBradford(value.datos);
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
    await tablaPaginacionService.paginacion('#dataTableLeyBradford');
  }
  React.useEffect(() => {
    handleListarDatosLeyBradford();
    handleAreasUnesco();
    handleAreasFrascati();
  }, []);
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
                <Card.Title as="h4"><img src={logo} alt="logo" /></Card.Title>
                <p className="card-category">
                  Medios de Publicación núcleo de cada Área
                </p>
                <Row>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO DESDE</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioDesde">
                          <option value="0">Seleccione</option>
                          <option value="2016">2016</option>
                          <option value="2017">2017</option>
                          <option value="2018">2018</option>
                          <option value="2019">2019</option>
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO HASTA</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioHasta">
                          <option value="0">Seleccione</option>
                          <option value="2016">2016</option>
                          <option value="2017">2017</option>
                          <option value="2018">2018</option>
                          <option value="2019">2019</option>
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>Area Frascati</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaFrascati">
                          <option value="0">Seleccione</option>
                          {areasFracati.map(item => (
                            <option value={item.id_area_frascati} key={item.id_area_frascati}>{item.descripcion}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>Area Unesco</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaUnesco">
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="EJECUTAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleCargarDatosLeyBradford}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableLeyBradford" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>MEDIO PUBLICACION</th>
                      <th>NUMERO PUBLICACIONES</th>
                      <th>NUMERO CITAS</th>
                      <th>SJR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosLeyBradford.map((item, index, elements) => (
                      <tr className="small" key={item.nombre}>
                        <td>{item.nombre}</td>
                        <td>{'P1 ('+item.pesoPublicacion +'%) * P ('+item.numero_publicaciones+')'}</td>
                        <td>{'P2 ('+item.pesoCitacion +'%) * C ('+item.numero_citas+')'}</td>
                        <td>{'P5 ('+item.pesoSJR +'%) * SJR ('+item.sjr+')'}</td>
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

export default LeyBradford;
