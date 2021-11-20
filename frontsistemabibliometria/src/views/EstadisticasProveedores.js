import React from "react";
import { baseDatosDigitalService } from '../_services/baseDatosDigital.service';
import { estadisticasUsoService } from '../_services/estadisticasUso.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { JournalService } from '../_services/journal.service';
import { Bar } from 'react-chartjs-2';
import * as FileSaver from "file-saver";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import *as XLSX from 'xlsx';

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
  const [nuevosJournal, setNuevosJournal] = React.useState([]);
  const [etiquetas, setEtiquetas] = React.useState([]);
  const [datos, setDatos] = React.useState([]);
  const [datosEstadisticasUso, setDatosEstadisticasUso] = React.useState([]);
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
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataEstadisticasUso');
    let id_base_datos_digital = document.getElementById("idBaseDatosDigital").value;
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

  const handleCargarEstadisticas = () => {
    let idBaseDatosDigital = document.getElementById("idBaseDatosDigital").value;
    let anio = document.getElementById("anioText").value;
    let mes = document.getElementById("idMes").value;
    let numero_busquedas = document.getElementById("numeroBusquedaText").value;
    if (idBaseDatosDigital != 0) {
      if (validacionInputService.campoVacio(anio) && validacionInputService.esNumero(anio)) {
        if (mes != 0) {
          if (validacionInputService.campoVacio(numero_busquedas)) {
            setLoading(true);
            estadisticasUsoService.insertar({
              "id_base_datos_digital": idBaseDatosDigital,
              "año": anio,
              "mes": mes,
              "numero_busquedas": numero_busquedas
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
    setLoading(true);
    estadisticasUsoService.eliminar(id_estadisticas_uso).then(value => {
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleCargarEstadisticasUso();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }
  async function handleReadExcelScienceDirect(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[1];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevosJournal(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error)
      };
    })
    promise.then(value => {
      console.log(value)
    })
  }
  async function handleReadExcelEbsco(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevosJournal(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error)
      };
    })
    promise.then(value => {
      console.log(value)
    })
  }
  async function handleReadExcel(file) {
    let idBaseDatosDigital = document.getElementById("idBaseDatosDigitalIngresoJournal").value;
    if (idBaseDatosDigital == 11) {
      handleReadExcelScienceDirect(file);
    } else if (idBaseDatosDigital == 3) {
      handleReadExcelEbsco(file);
    }
  }
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  async function handleIngresarJournals() {
    let idBaseDatosDigital = document.getElementById("idBaseDatosDigitalIngresoJournal").value;
    if (idBaseDatosDigital != 0) {
      if (nuevosJournal.length != 0) {
        if (idBaseDatosDigital == 11) {
          setLoading(true)
          JournalService.insertarScienceDirect({ "nuevasJournal": nuevosJournal, "idBaseDatosDigital": idBaseDatosDigital }).then(value => {
            setLoading(false);
            if (value.respuesta.error == "False") {
              notify("tc", "Proceso terminado.", "primary");
              if (value.respuesta.mensajes.length > 0) {
                exportToCSV(value.respuesta.mensajes, "observacionesIngresoJournalBD");
                notify("tc", "Revise las observaciones colocadas en el archivo de excel del ingreso de journal por base de datos digital.", "primary");
              }
            }
          })
        } else if (idBaseDatosDigital == 3) {
          setLoading(true)
          JournalService.insertarEbsco({ "nuevasJournal": nuevosJournal, "idBaseDatosDigital": idBaseDatosDigital }).then(value => {
            setLoading(false);
            if (value.respuesta.error == "False") {
              notify("tc", "Proceso terminado.", "primary");
              if (value.respuesta.mensajes.length > 0) {
                exportToCSV(value.respuesta.mensajes, "observacionesIngresoJournalBD");
                notify("tc", "Revise las observaciones colocadas en el archivo de excel del ingreso de journal por base de datos digital.", "primary");
              }
            }
          })
        } else {
          notify("tr", 'No es posible ingresar datos correspondientes a la base de datos seleccionada.', "danger");
        }
      } else {
        notify("tr", 'Ingrese el archivo con la información.', "danger");
      }
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
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
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>AÑO</label>
                      <Form.Control
                        id="anioText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="2">
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
                  <Col className="pr-1" md="2">
                    <Form.Group>
                      <label>NÚMERO DE BÚSQUEDAS</label>
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
                        <td width="5%"><Link to="#" id="eliminarEstadisticasUso" className="link col-sm-12 col-md-3" onClick={() => handleEliminarEstadisticasUso(item.id_estadisticas_uso)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ingreso Journal-Estadísticas Base de Datos Digitales</Card.Title>
                <Row>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>BASE DATOS DIGITAL</label>
                      <Form.Row>
                        <select className="form-control" id="idBaseDatosDigitalIngresoJournal">
                          <option value="0">Seleccione</option>
                          {baseDatosDigital.map(item => (
                            <option value={item.id_base_datos_digital} key={item.id_base_datos_digital}>{item.nombre_base_datos_digital}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="9">
                    <Form>
                      <Row>
                        <Col className="pr-1" md="12">
                          <Form.Group>
                            <label>INGRESE EL ARCHIVO .XLSX CON LA INFORMACIÓN DE LAS BASES DE DATOS DIGITALES</label>
                            <FormGroup>
                              <input type='file' onChange={(e) => {
                                const file = e.target.files[0];
                                handleReadExcel(file)
                              }} className="col-sm-12 col-md-8"></input>
                              <Link to="#" id="ingresarPublicacion" className="link col-sm-12 col-md-3"><Button variant="primary" onClick={handleIngresarJournals}>Ingresar <i className="fas fa-file-upload fa-2x" /></Button></Link>
                            </FormGroup>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default EstadisticasProveedores;
