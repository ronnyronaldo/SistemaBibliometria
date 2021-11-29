import React from "react";
import { baseDatosDigitalService } from '../_services/baseDatosDigital.service';
import { estadisticasUsoService } from '../_services/estadisticasUso.service';
import { validacionInputService } from '../_services/validacionInput.service';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { JournalService } from '../_services/journal.service';
import * as FileSaver from "file-saver";
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
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
function BaseDatosDigital() {
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [opcionPantalla, setOpcionPantalla] = React.useState("bd");
  const [journalBaseDatosDigital, setJournalBaseDatosDigital] = React.useState([]);
  const [nuevosJournal, setNuevosJournal] = React.useState([]);
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
  const [baseDatosDigital, setBaseDatosDigital] = React.useState([]);
  const [etiquetas, setEtiquetas] = React.useState([]);
  const [datos, setDatos] = React.useState([]);
  const [nombreBaseDatosDigital, setNombreBaseDatosDigital] = React.useState('');
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

  const [baseDatosDigitalObj, setBaseDatosDigitalObj] = React.useState({
    id_base_datos_digital: 0,
    nombre: "",
    proveedor: "",
    costo_actual: 0,
    suscripcion_descripcion: "",
    area_servicio: ""
  })

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

  async function handleAgregarBaseDatosDigitales() {
    let nombreBaseDatos = document.getElementById("nombreBaseDatosText").value;
    let nombreProveedor = document.getElementById("nombreProveedorText").value;
    let costoActual = document.getElementById("costoActualText").value;
    let suscripcionDescripcion = document.getElementById("suscripcionDescripcionText").value;
    let areaServicio = document.getElementById("areaServicioText").value;
    if (validacionInputService.campoVacio(nombreBaseDatos)) {
      if (validacionInputService.campoVacio(nombreProveedor)) {
        if (validacionInputService.campoVacio(suscripcionDescripcion)) {
          if (validacionInputService.campoVacio(areaServicio)) {
            if (validacionInputService.campoVacio(costoActual)) {
              if (validacionInputService.esDecimal(costoActual)) {
                setLoading(true);
                baseDatosDigitalService.insertar({
                  "nombre_base_datos_digital": nombreBaseDatos,
                  "proveedor": nombreProveedor,
                  "costo_actual": costoActual,
                  "suscripcion_descripcion": suscripcionDescripcion,
                  "area_servicio": areaServicio,
                  "esUtilizadaEstudio": 0
                }).then(value => {
                  setLoading(false);
                  if (value.respuesta.error == "False") {
                    handleCargarBaseDatosDigitales();
                    notify("tr", value.respuesta.valor, "primary");
                  } else {
                    notify("tr", value.respuesta.valor, "danger");
                  }
                })
              } else {
                notify("tr", 'El valor que ingreso es incorrecto.', "danger");
              }
            } else {
              notify("tr", 'No ha ingresado el costo actual.', "danger");
            }
          } else {
            notify("tr", 'No ha ingresado el área o servicio.', "danger");
          }
        } else {
          notify("tr", 'No ha ingresado la suscripción o descripción.', "danger");
        }
      } else {
        notify("tr", 'No ha ingresado el nombre del Proveedor.', "danger");
      }
    } else {
      notify("tr", 'No ha ingresado el nombre de la Base de Datos Digital.', "danger");
    }
  }
  const handleEliminarBaseDatosDigital = (id_base_datos_digital) => {
    setLoading(true);
    baseDatosDigitalService.eliminar(id_base_datos_digital).then(value => {
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleCargarBaseDatosDigitales();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }
  function handleCargarDetalleBaseDatosDigital(id_base_datos_digital, nombre_base_datos_digital, proveedor, costo_actual, suscripcion_descripcion, area_servicio) {
    setBaseDatosDigitalObj({
      id_base_datos_digital: id_base_datos_digital,
      nombre: nombre_base_datos_digital,
      proveedor: proveedor,
      costo_actual: costo_actual,
      suscripcion_descripcion: suscripcion_descripcion,
      area_servicio: area_servicio
    });
    openModal()
  }

  function actualizarBaseDatosDigital() {
    let id_base_datos_digital = baseDatosDigitalObj.id_base_datos_digital;
    let nombreBaseDatosDigital = document.getElementById("nombreBaseDatosDigitalActText").value;
    let nombreProveedor = document.getElementById("proveedorActText").value;
    let costo_actual = document.getElementById("costoActualActText").value;
    let suscripcion_descripcion = document.getElementById("suscripcionDescripcionActText").value;
    let area_servicio = document.getElementById("areaServicioActText").value;

    if (validacionInputService.campoVacio(nombreBaseDatosDigital) && validacionInputService.campoVacio(nombreProveedor) && validacionInputService.campoVacio(suscripcion_descripcion) && validacionInputService.campoVacio(area_servicio) & validacionInputService.campoVacio(costo_actual) & validacionInputService.esDecimal(costo_actual)) {
      baseDatosDigitalService.actualizar({
        "id_base_datos_digital": id_base_datos_digital,
        "nombre": nombreBaseDatosDigital,
        "nombreProveedor": nombreProveedor,
        "costo_actual": costo_actual,
        "suscripcion_descripcion": suscripcion_descripcion,
        "area_servicio": area_servicio

      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleCargarBaseDatosDigitales();
        }
        closeModal();
      })

    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

  async function handleCargarJournalPorBaseDatosDigital() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataJournalPorBaseDigital');
    let id_base_datos_digital = document.getElementById("idBaseDatosDigitalIngresoJournal").value;
    if (id_base_datos_digital !== 0) {
      await JournalService.listarJournalPorBaseDatosDigital(id_base_datos_digital).then(value => {
        setJournalBaseDatosDigital(value.datos_journal);
        setLoading(false);
      });
    } else {
      notify("tr", 'No ha seleccionado la base de datos digital.', "danger");
    }
    await tablaPaginacionService.paginacion('#dataJournalPorBaseDigital');
  }

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
              handleCargarJournalPorBaseDatosDigital();
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
              handleCargarJournalPorBaseDatosDigital();
            }
          })
        } else if (idBaseDatosDigital == 1) {
          setLoading(true)
          JournalService.insertarScopus({ "nuevasJournal": nuevosJournal, "idBaseDatosDigital": idBaseDatosDigital }).then(value => {
            setLoading(false);
            if (value.respuesta.error == "False") {
              notify("tc", "Proceso terminado.", "primary");
              if (value.respuesta.mensajes.length > 0) {
                exportToCSV(value.respuesta.mensajes, "observacionesIngresoJournalBD");
                notify("tc", "Revise las observaciones colocadas en el archivo de excel del ingreso de journal por base de datos digital.", "primary");
              }
              handleCargarJournalPorBaseDatosDigital();
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
    } else if(idBaseDatosDigital == 1){
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
  function handleOpcionPantallaBD(opcion) {
    setOpcionPantalla(opcion);
    if (opcion == "bd") {
      handleCargarBaseDatosDigitales();
    } else {
      setJournalBaseDatosDigital([]);
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
              <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <div className="navbar-nav">
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantallaBD("bd")}>Base Datos Digital</a>
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantallaBD("jdb")}>Journal - Database</a>
                  </div>
                </div>
              </nav>
            </Card>
          </Col>
        </Row>
        <Row>
          {opcionPantalla === 'bd' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Ingreso Base Datos Digital</Card.Title>
                  <Row>

                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label>NOMBRE BASE DATOS DIGITAL</label>
                        <Form.Control
                          id="nombreBaseDatosText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                        <label>NOMBRE DEL PROVEEDOR</label>
                        <Form.Control
                          id="nombreProveedorText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                        <label>COSTO ACTUAL</label>
                        <Form.Control
                          id="costoActualText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label>SUSCRIPCIÓN/DESCRIPCIÓN</label>
                        <Form.Control
                          id="suscripcionDescripcionText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                        <label>AREA/SERVICIO</label>
                        <Form.Control
                          id="areaServicioText"
                          defaultValue=""
                          cols="80"
                          rows="4"
                          as="textarea"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="AGREGAR"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleAgregarBaseDatosDigitales}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
            </Col>
          )}
          {opcionPantalla === 'bd' && (
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
                        <th>ACCIONES</th>
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
                          <td width="5%">
                            <div className="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="actualizarBaseDatosDigital" className="btn btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleBaseDatosDigital(item.id_base_datos_digital, item.nombre_base_datos_digital, item.proveedor, item.costo_actual, item.suscripcion_descripcion, item.area_servicio)} >Editar</Button>
                              <Button id="eliminarBaseDatosDigital" className="btn btn-sm active" type="button" variant="danger" onClick={() => handleEliminarBaseDatosDigital(item.id_base_datos_digital)}>Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {opcionPantalla === 'jdb' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Ingreso Base Datos Digital - Journal</Card.Title>
                  <Row>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label>BASE DATOS DIGITAL</label>
                        <Form.Row>
                          <select className="form-control" id="idBaseDatosDigitalIngresoJournal" onChange={handleCargarJournalPorBaseDatosDigital}>
                            <option value="0">Seleccione</option>
                            {baseDatosDigital.map(item => (
                              <option value={item.id_base_datos_digital} key={item.id_base_datos_digital}>{item.nombre_base_datos_digital}</option>
                            ))}
                          </select>
                        </Form.Row>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>INGRESE EL ARCHIVO .XLSX CON LA INFORMACIÓN DE LAS BASES DE DATOS DIGITALES</label>
                        <FormGroup>
                          <input type='file' onChange={(e) => {
                            const file = e.target.files[0];
                            handleReadExcel(file)
                          }} className="col-sm-12 col-md-8"></input>
                        </FormGroup>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="INGRESAR"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleIngresarJournals}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
            </Col>
          )}
          {opcionPantalla === 'jdb' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Journal - Database</Card.Title>
                  <p className="card-category">
                    Universidad de Cuenca
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataJournalPorBaseDigital" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>TITULO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalBaseDatosDigital.map(item => (
                        <tr className="small" key={item.id_base_datos_digital_journal}>
                          <td >{item.titulo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      <Modal
        className="modal modal-primary"
        show={modalIsOpen}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-grid-45"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Actualizar Base Datos Digital</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>NOMBRE</label>
              <Form.Control
                id="nombreBaseDatosDigitalActText"
                defaultValue={baseDatosDigitalObj.nombre}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>PROVEEDOR</label>
              <Form.Control
                id="proveedorActText"
                defaultValue={baseDatosDigitalObj.proveedor}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>COSTO ACTUAL</label>
              <Form.Control
                id="costoActualActText"
                defaultValue={baseDatosDigitalObj.costo_actual}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>SUSCRIPCION/DESCRIPCION</label>
              <Form.Control
                id="suscripcionDescripcionActText"
                defaultValue={baseDatosDigitalObj.suscripcion_descripcion}
                cols="80"
                rows="4"
                as="textarea"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>AREA/SERVICIO</label>
              <Form.Control
                id="areaServicioActText"
                defaultValue={baseDatosDigitalObj.area_servicio}
                cols="80"
                rows="4"
                as="textarea"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModal()}
          >
            Regresar
          </Button>
          <Button
            id="grabar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => actualizarBaseDatosDigital()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default BaseDatosDigital;
