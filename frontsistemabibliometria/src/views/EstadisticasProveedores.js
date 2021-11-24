import React from "react";
import { baseDatosDigitalService } from '../_services/baseDatosDigital.service';
import { estadisticasUsoService } from '../_services/estadisticasUso.service';
import { estadisticasJournalService } from '../_services/estadisticasJournal.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { JournalService } from '../_services/journal.service';
import { Bar } from 'react-chartjs-2';
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
  FormGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
function EstadisticasProveedores() {
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [opcionPantalla, setOpcionPantalla] = React.useState("td");
  const notify = (place, mensaje, type) => {
    //var color = Math.floor(Math.random() * 5 + 1);
    //var type = "danger";
    /*switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }*/
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
  const [baseDatosDigital, setBaseDatosDigital] = React.useState([]);
  const [etiquetas, setEtiquetas] = React.useState([]);
  const [datos, setDatos] = React.useState([]);
  const [datosEstadisticasUso, setDatosEstadisticasUso] = React.useState([]);
  const [journalBaseDatosDigitalEstadisticas, setJournalBaseDatosDigitalEstadisticas] = React.useState([]);
  const data = {
    labels: etiquetas,
    datasets: [{
      label: 'Número de búsquedas',
      backgroundColor: '#081F2E',
      borderColor: 'black',
      borderWidth: 1,
      hoverBackgroundColor: '#0C4E78',
      hoverBorderColor: 'white',
      data: datos
    }]
  }
  const opciones = {
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

  async function handleCargarEstadisticasUso() {
    handleCargarJournal();
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataEstadisticasUso');
    let id_base_datos_digital = document.getElementById("idBaseDatosDigital").value;
    let id_journal = document.getElementById("idJournal").value;
    if (id_base_datos_digital !== 0) {
      await estadisticasUsoService.listarEstadisticasUsoPorId(id_base_datos_digital).then(value => {
        var estadisticas_uso = value.estadisticas_uso
        setDatosEstadisticasUso(estadisticas_uso);
        let etiquetas = []
        let datos = []
        for (var i = 0; i < estadisticas_uso.length; i++) {
          etiquetas.push(estadisticas_uso[i].mes + '-' + estadisticas_uso[i].año)
          datos.push(estadisticas_uso[i].numero_busquedas)
        }
        setEtiquetas(etiquetas)
        setDatos(datos)
        setLoading(false);
      });
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
    await tablaPaginacionService.paginacion('#dataEstadisticasUso');
  }
  async function handleCargarEstadisticasJournal() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataEstadisticasUso');
    let id_base_datos_digital = document.getElementById("idBaseDatosDigital").value;
    let id_journal = document.getElementById("idJournal").value;
    if (id_base_datos_digital !== 0) {
      if (id_journal !== 0) {
        await estadisticasJournalService.listarEstadisticasJournalPorId(id_base_datos_digital, id_journal).then(value => {
          var estadisticas_uso = value.estadisticas_uso_journal
          setDatosEstadisticasUso(estadisticas_uso);
          let etiquetas = []
          let datos = []
          for (var i = 0; i < estadisticas_uso.length; i++) {
            etiquetas.push(estadisticas_uso[i].mes + '-' + estadisticas_uso[i].año)
            datos.push(estadisticas_uso[i].numero_busquedas)
          }
          setEtiquetas(etiquetas)
          setDatos(datos)
          setLoading(false);
        });
      }
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
    await tablaPaginacionService.paginacion('#dataEstadisticasUso');
  }

  async function handleCargarJournal() {
    setLoading(true);
    let id_base_datos_digital = document.getElementById("idBaseDatosDigital").value;
    if (id_base_datos_digital !== 0) {
      await JournalService.listarJournalPorBaseDatosDigital(id_base_datos_digital).then(value => {
        setJournalBaseDatosDigitalEstadisticas(value.datos_journal);
        setLoading(false);
      });
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
  }

  const handleCargarEstadisticas = () => {
    let idBaseDatosDigital = document.getElementById("idBaseDatosDigital").value;
    let idJournal = document.getElementById("idJournal").value;
    let anio = document.getElementById("anioText").value;
    let mes = document.getElementById("idMes").value;
    let numero_busquedas = document.getElementById("numeroBusquedaText").value;
    if (idBaseDatosDigital != 0) {
      if (validacionInputService.campoVacio(anio) && validacionInputService.esNumero(anio)) {
        if (mes != 0) {
          if (validacionInputService.campoVacio(numero_busquedas)) {
            if (idJournal == 0) {
              setLoading(true);
              estadisticasUsoService.insertar({
                "id_base_datos_digital": idBaseDatosDigital,
                "año": anio,
                "mes": mes,
                "numero_busquedas": numero_busquedas,
                "id_mes": numeroMes(mes)
              }).then(value => {
                setLoading(false);
                if (value.respuesta.error == "False") {
                  handleCargarEstadisticasUso();
                  notify("tr", value.respuesta.valor, "primary");
                } else {
                  notify("tr", value.respuesta.valor, "danger");
                }
              })
            } else {
              setLoading(true);
              estadisticasJournalService.insertar({
                "id_base_datos_digital": idBaseDatosDigital,
                "id_journal": idJournal,
                "año": anio,
                "mes": mes,
                "numero_busquedas": numero_busquedas,
                "id_mes": numeroMes(mes)
              }).then(value => {
                setLoading(false);
                if (value.respuesta.error == "False") {
                  handleCargarEstadisticasJournal();
                  notify("tr", value.respuesta.valor, "primary");
                } else {
                  notify("tr", value.respuesta.valor, "danger");
                }
              })
            }
          } else {
            notify("tr", 'Número de búsquedas ingresadas incorrectamente.', "danger");
          }
        } else {
          notify("tr", 'No ha seleccionado el mes.', "danger");
        }
      } else {
        notify("tr", 'Año ingresado incorrectamente.', "danger");
      }
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
  }
  const handleEliminarEstadisticasUso = (id_estadisticas_uso) => {
    let idBaseDatosDigital = document.getElementById("idBaseDatosDigital").value;
    let idJournal = document.getElementById("idJournal").value;
    if (idBaseDatosDigital != 0) {
      if (idJournal == 0) {
        setLoading(true);
        estadisticasUsoService.eliminar(id_estadisticas_uso).then(value => {
          setLoading(false);
          if (value.respuesta.error == "False") {
            handleCargarEstadisticasUso();
            notify("tr", value.respuesta.valor, "primary");
          } else {
            notify("tr", value.respuesta.valor, "danger");
          }
        });
      } else {
        setLoading(true);
        estadisticasJournalService.eliminar(id_estadisticas_uso).then(value => {
          setLoading(false);
          if (value.respuesta.error == "False") {
            handleCargarEstadisticasJournal();
            notify("tr", value.respuesta.valor, "primary");
          } else {
            notify("tr", value.respuesta.valor, "danger");
          }
        });
      }
    }

  }

  const numeroMes = (mes) => {
    if (mes == 'Enero') return 1;
    if (mes == 'Febrero') return 2;
    if (mes == 'Marzo') return 3;
    if (mes == 'Abril') return 4;
    if (mes == 'Mayo') return 5;
    if (mes == 'Junio') return 6;
    if (mes == 'Julio') return 7;
    if (mes == 'Agosto') return 8;
    if (mes == 'Septiembre') return 9;
    if (mes == 'Octubre') return 10;
    if (mes == 'Noviembre') return 11;
    if (mes == 'Diciembre') return 12;
  }

  function handleOpcionPantalla(opcion) { // Cargo los datos en Pantalla
    if (opcion == "td") {
      let idBaseDatosDigital = document.getElementById("idBaseDatosDigital").value;
      let idJournal = document.getElementById("idJournal").value;
      if (idJournal == 0) {
        handleCargarEstadisticasUso();
      } else {
        handleCargarEstadisticasJournal();
      }
    }
    setOpcionPantalla(opcion);
  }

  React.useEffect(() => {
    handleCargarBaseDatosDigitales();
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
              <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <div className="navbar-nav">
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("td")}>Tabla Datos</a>
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("g")}>Gráfico</a>
                  </div>
                </div>
              </nav>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ingreso Estadísticas Base Datos Digital</Card.Title>
                <Row>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>BASE DATOS DIGITAL</label>
                      <Form.Row>
                        <select className="form-control" onChange={handleCargarEstadisticasUso} id="idBaseDatosDigital">
                          <option value="0">Seleccione</option>
                          {baseDatosDigital.map(item => (
                            <option value={item.id_base_datos_digital} key={item.id_base_datos_digital}>{item.nombre_base_datos_digital}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>JOURNAL</label>
                      <Form.Row>
                        <select className="form-control" id="idJournal" onChange={handleCargarEstadisticasJournal}>
                          <option value="0">Seleccione</option>
                          {journalBaseDatosDigitalEstadisticas.map(item => (
                            <option value={item.id_journal} key={item.id_journal}>{item.titulo}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO</label>
                      <Form.Control
                        id="anioText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>MES</label>
                      <Form.Row>
                        <select className="form-control" id="idMes">
                          <option value="Enero">Enero</option>
                          <option value="Febrero">Febrero</option>
                          <option value="Marzo">Marzo</option>
                          <option value="Abril">Abril</option>
                          <option value="Mayo">Mayo</option>
                          <option value="Junio">Junio</option>
                          <option value="Julio">Julio</option>
                          <option value="Agosto">Agosto</option>
                          <option value="Septiembre">Septiembre</option>
                          <option value="Octubre">Octubre</option>
                          <option value="Noviembre">Noviembre</option>
                          <option value="Diciembre">Diciembre</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label># BÚSQUEDAS</label>
                      <Form.Control
                        id="numeroBusquedaText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="AGREGAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleCargarEstadisticas}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </Col>
          {opcionPantalla === 'td' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Base de Datos Digitales</Card.Title>
                  <p className="card-category">
                    Universidad de Cuenca
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataEstadisticasUso" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>AÑO</th>
                        <th>MES</th>
                        <th>NÚMERO DE BÚSQUEDAS</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosEstadisticasUso.map(item => (
                        <tr className="small" key={item.id_estadisticas_uso}>
                          <td >{item.año}</td>
                          <td >{item.mes}</td>
                          <td >{item.numero_busquedas}</td>
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="eliminarEstadisticasUso" className="btn btn-sm active" type="button" variant="danger" onClick={() => handleEliminarEstadisticasUso(item.id_estadisticas_uso)}>Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>)}
          {opcionPantalla === 'g' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Estadísticas de Búsqueda</Card.Title>
                  <p className="card-category">
                    Universidad de Cuenca
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <div style={{ width: '100%', height: '400px' }}>
                    <Bar data={data} options={opciones}></Bar>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default EstadisticasProveedores;
