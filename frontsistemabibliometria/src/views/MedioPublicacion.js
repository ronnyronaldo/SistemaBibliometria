import React from "react";
import { medioPublicacionService } from '../_services/medio_publicacion.service';
import { SJRService } from '../_services/sjr_service.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { validacionInputService } from '../_services/validacionInput.service';

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

/**Spinner */
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
import { Link } from "react-router-dom";
import *as XLSX from 'xlsx';
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

import { FormGroup } from "reactstrap";
function MedioPublicacion() {

  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalIsOpenEliminar, setModalIsOpenEliminar] = React.useState(false);
  const [idMedioPublicacionEliminar, setIdMedioPublicacionEliminar] = React.useState('');
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

  const [mediosPublicacion, setMediosPublicacion] = React.useState([]);
  const [mediosPublicacionPublicacion, setMediosPublicacionPublicacion] = React.useState([]);
  const [mediosPublicacionCitacion, setMediosPublicacionCitacion] = React.useState([]);
  const [mediosPublicacionSJR, setMediosPublicacionSJR] = React.useState([]);
  const [filtroPublicaciones, setFiltroPublicaciones] = React.useState('I');
  const [medioPublicacionObj, setMedioPublicacionObj] = React.useState({
    id_medio_publicacion: 0,
    nombre: ""
  });
  async function handleCargarMediosPublicacion() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacion');
    await medioPublicacionService.listar().then(value => {
      setMediosPublicacion(value.mediosPublicacion);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacion');
  }

  async function handleCargarMediosPublicacionPublicacion() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionPublicacion');
    await medioPublicacionService.listarMediosPublicacionPublicacion().then(value => {
      setMediosPublicacionPublicacion(value.mediosPublicacionPublicacion);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacionPublicacion');
  }

  async function handleCargarMediosPublicacionCitacion() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionCitacion');
    await medioPublicacionService.listarMediosPublicacionCitacion().then(value => {
      setMediosPublicacionCitacion(value.mediosPublicacionCitacion);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacionCitacion');
  }

  async function handleCargarSJR() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionSJR');
    await SJRService.listar().then(value => {
      setMediosPublicacionSJR(value.sjr);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacionSJR');
  }

  const handleEliminarMedioPublicacion = (id_medio_publicacion) => {
    setLoading(true);
    medioPublicacionService.eliminar(id_medio_publicacion).then(value => {
      setLoading(false);
      closeModalEliminar();
      if (value.respuesta.error == "False") {
        handleCargarMediosPublicacion();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarMedioPublicacion = (event) => {
    let nombreMedioPublicacion = document.getElementById("medioPublicacionText").value;
    let estado = validacionInputService.campoVacio(nombreMedioPublicacion);
    if (estado == true) {
      setLoading(true);
      medioPublicacionService.insertar({
        "nombre": nombreMedioPublicacion
      }).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          handleCargarMediosPublicacion();
          notify("tr", value.respuesta.valor, "primary");
        } else {
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    }
    else {
      notify("tr", 'No ha ingresado el nombre del Medio de Publicación.', "danger");
    }
  }

  async function handleIngresarSJR() {
    if (nuevasSJR.length != 0) {
      setLoading(true);
      SJRService.insertar({ nuevasSJR }).then(value => {
        setLoading(false);
        if (value.error == "False") {
          notify("tc", "Registros SJR ingresadas correctamente.", "primary");
          handleCargarSJR();
        } else {
          notify("tc", "No se pudo ingresar los registros SJR.", "danger");
        }
      })
    } else {
      notify("tr", 'No ha ingresado el archivo o no existen datos para cargar.', "danger");
    }
  }

  const [nuevasSJR, setNuevasSJR] = React.useState([]);
  async function handleReadExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevasSJR(data);
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
  async function handleCargarDatosPublicacionesPorFiltro() {
    let filtroPublicaciones = document.getElementById("filtroPublicaciones").value;
    setFiltroPublicaciones(filtroPublicaciones);
    if (filtroPublicaciones == 'P') {
      await handleCargarMediosPublicacionPublicacion();
    } else if (filtroPublicaciones == 'C') {
      await handleCargarMediosPublicacionCitacion();
    } else if (filtroPublicaciones == 'SJR') {
      await handleCargarSJR();
    } else if (filtroPublicaciones == 'I') {
      await handleCargarMediosPublicacion();
    }
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalEliminar() {
    setModalIsOpenEliminar(false);
  }

  function openModalEliminar(id_medio_publicacion) {
    setIdMedioPublicacionEliminar(id_medio_publicacion);
    setModalIsOpenEliminar(true);
  }

  function handleCargarDetalleMedioPublicacion(id_medio_publicacion, nombre) {
    setMedioPublicacionObj({
      id_medio_publicacion: id_medio_publicacion,
      nombre: nombre
    });
    openModal()
  }

  function actualizarMedioPublicacion() {
    let id_medio_publicacion = document.getElementById("idMedioPublicacionText").value;
    let nombre_medio_publicacion = document.getElementById("nombreMedioPublicacionText").value;
    if (validacionInputService.campoVacio(id_medio_publicacion) && validacionInputService.campoVacio(nombre_medio_publicacion)) {
      medioPublicacionService.actualizar({
        id_medio_publicacion: id_medio_publicacion,
        nombre: nombre_medio_publicacion
      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleCargarMediosPublicacion();
        }
        closeModal();
      })
    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

  React.useEffect(() => {
    handleCargarMediosPublicacion();
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
              <Card.Body className="table-full-width table-responsive px-3">
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label>Medios de Publicación</label>
                      <Form.Row>
                        <select className="form-control" id="filtroPublicaciones" onChange={handleCargarDatosPublicacionesPorFiltro}>
                          <option value="I">Ingreso medios de publicación</option>
                          <option value="P">Ranking Medio Publicación</option>
                          <option value="C">Ranking Medio Citación</option>
                          <option value="SJR">Factor de Impacto SJR</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {filtroPublicaciones === 'I' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Medios de Publicación</Card.Title>
                  <p className="card-category">
                    Medios de Publicación donde se encuentran publicados los documentos de los investigadores con filiacion a la Universidad de Cuenca
                  </p>
                  <Row>
                    <Col className="pr-1" md="8">
                      <Form.Group>
                        <label>NOMBRE MEDIO PUBLICACIÓN</label>
                        <Form.Control
                          id="medioPublicacionText"
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
                          onClick={handleAgregarMedioPublicacion}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableMediosPublicacion" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediosPublicacion.map(item => (
                        <tr className="small" key={item.id_medio_publicacion}>
                          <td>{item.id_medio_publicacion}</td>
                          <td>{item.nombre}</td>
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="actualizarMedioPublicacion" className="btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleMedioPublicacion(item.id_medio_publicacion, item.nombre)} >Editar</Button>
                              <Button id="eliminarMedioPublicacion" className="btn-sm active" type="button" variant="danger" onClick={() => openModalEliminar(item.id_medio_publicacion)} >Eliminar</Button>
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
          {filtroPublicaciones === 'P' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Ranking Medios de Publicación | Publicaciones</Card.Title>
                  <p className="card-category">
                    Medios de Publicación más atractivas donde publican los investigadores con filiacion a la Universidad de Cuenca
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableMediosPublicacionPublicacion" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>NOMBRE</th>
                        <th>NUMERO PUBLICACIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediosPublicacionPublicacion.map(item => (
                        <tr className="small" key={item.id_medio_publicacion}>
                          <td>{item.nombre}</td>
                          <td>{item.numero_publicaciones}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {filtroPublicaciones === 'C' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Ranking Medios de Publicación | Citaciones</Card.Title>
                  <p className="card-category">
                    Medios de Publicación más atractivas de donde citan los investigadores con filiacion a la Universidad de Cuenca
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableMediosPublicacionCitacion" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>NOMBRE</th>
                        <th>NUMERO CITAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediosPublicacionCitacion.map(item => (
                        <tr className="small" key={item.id_medio_publicacion}>
                          <td>{item.nombre}</td>
                          <td>{item.numero_citas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {filtroPublicaciones === 'SJR' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Ranking | Scimago Journal And Country Rank</Card.Title>
                  <p className="card-category">
                    SCImago Journal Rank proporciona datos acerca de la influencia científica de las revistas académicas según el número de citas en otros medios y periódicos o revistas de importancia.
                  </p>

                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>INGRESE EL ARCHIVO .XLSX CON LOS DATOS DEL SJR </label>
                        <FormGroup>
                          <input type='file' onChange={(e) => {
                            const file = e.target.files[0];
                            handleReadExcel(file)
                          }} className="col-sm-12 col-md-8"></input>
                          <Link to="#" id="ingresarSJR" className="link col-sm-12 col-md-3"><Button variant="primary" onClick={handleIngresarSJR}>Ingresar <i className="fas fa-file-upload fa-2x" /></Button></Link>
                        </FormGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableMediosPublicacionSJR" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>RANK</th>
                        <th>ID RECURSO</th>
                        <th>TITULO</th>
                        <th>TIPO</th>
                        <th>ISNN</th>
                        <th>SJR</th>
                        <th>SJR BEST QUARTILE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediosPublicacionSJR.map(item => (
                        <tr className="small" key={item.id_sjr}>
                          <td width="10%">{item.rank}</td>
                          <td width="10%">{item.id_recurso}</td>
                          <td width="30%">{item.titulo}</td>
                          <td width="10%">{item.tipo}</td>
                          <td width="10%">{item.isnn}</td>
                          <td width="10%">{item.sjr}</td>
                          <td width="10%">{item.quartil}</td>
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
        size="xl"
        className="modal modal-primary"
        show={modalIsOpen}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-grid-45"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Actualizar Medio Publicacion</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>ID</label>
              <Form.Control
                id="idMedioPublicacionText"
                defaultValue={medioPublicacionObj.id_medio_publicacion}
                type="text"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>NOMBRE</label>
              <Form.Control
                id="nombreMedioPublicacionText"
                defaultValue={medioPublicacionObj.nombre}
                type="text"
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
            onClick={() => actualizarMedioPublicacion()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
      <Modal
        className="modal modal-primary"
        show={modalIsOpenEliminar}
        size="xl"
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>¿ Esta seguro de eliminar el medio de publicación ?</p>
        </Modal.Body>
        <div className="modal-footer">
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalEliminar()}
          >
            Regresar
          </Button>
          <Button
            id="eliminar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => handleEliminarMedioPublicacion(idMedioPublicacionEliminar)}
          >
            SI
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default MedioPublicacion;
