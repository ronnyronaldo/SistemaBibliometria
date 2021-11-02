import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { validacionInputService } from '../_services/validacionInput.service';
import { Link } from "react-router-dom";

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
function Areas() {

  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [modalIsOpenEliminarAF, setModalIsOpenEliminarAF] = React.useState(false);
  const [modalIsOpenEliminarAU, setModalIsOpenEliminarAU] = React.useState(false);
  const [filtroAreas, setFiltroAreas] = React.useState('AF');
  const [idAreaFrascatiEliminar, setIdAreaFrascatiEliminar] = React.useState('');
  const [idAreaUnescoEliminar, setIdAreaUnescoEliminar] = React.useState('');
  const [modalIsOpenActualizarAF, setModalIsOpenActualizarAF] = React.useState(false);
  const [modalIsOpenActualizarAU, setModalIsOpenActualizarAU] = React.useState(false);
  const [areaFrascatiObj, setAreaFrascatiObj] = React.useState({
    id_area_frascati: 0,
    descripcion: ""
  });
  const [areaUnescoObj, setAreaUnescoObj] = React.useState({
    id_area_unesco: 0,
    descripcion_unesco: ""
  });
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

  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);

  async function handleAreasFrascati() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableAreasFrascati');
    await areaFrascatiService.listaAreasFrascati().then(value => {
      setAreasFrascati(value.area_frascati);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableAreasFrascati');
  }

  async function handleAreasUnesco() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableAreasUnesco');
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableAreasUnesco');
  }
  const handleEliminarAreaFrascati = (id_area_frascati) => {
    setLoading(true);
    areaFrascatiService.eliminar(id_area_frascati).then(value => {
      setLoading(false);
      closeModalEliminarAF();
      if (value.respuesta.error == "False") {
        handleAreasFrascati();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleEliminarAreaUnesco = (id_area_unesco) => {
    setLoading(true);
    areaUnescoService.eliminar(id_area_unesco).then(value => {
      setLoading(false);
      closeModalEliminarAU();
      if (value.respuesta.error == "False") {
        handleAreasUnesco();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarAreaFrascati = (event) => {
    let nombreAreaFrascati = document.getElementById("areaFrascatiText").value;
    let estado = validacionInputService.campoVacio(nombreAreaFrascati);
    if (estado == true) {
      setLoading(true);
      areaFrascatiService.insertar({
        "descripcion": nombreAreaFrascati
      }).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          handleAreasFrascati();
          notify("tr", value.respuesta.valor, "primary");
        } else {
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    }
    else {
      notify("tr", 'No ha ingresado el nombre del Área de Tipo Frascati.', "danger");
    }
  }
  const handleAgregarAreaUnesco = (event) => {
    let nombreAreaUnesco = document.getElementById("areaUnescoText").value;
    let estado = validacionInputService.campoVacio(nombreAreaUnesco);
    if (estado == true) {
      setLoading(true);
      areaUnescoService.insertar({
        "descripcion_unesco": nombreAreaUnesco
      }).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          handleAreasUnesco();
          notify("tr", value.respuesta.valor, "primary");
        } else {
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    }
    else {
      notify("tr", 'No ha ingresado el nombre del Área de Tipo Unesco.', "danger");
    }
  }
  async function handleCargarDatosAreasPorFiltro() {
    let filtroAreas = document.getElementById("filtroOpcionesAreas").value;
    setFiltroAreas(filtroAreas);
    if (filtroAreas == 'AF') {
      await handleAreasFrascati();
    } else if (filtroAreas == 'AU') {
      await handleAreasUnesco();
    }
  }
  function closeModalEliminarAF() {
    setModalIsOpenEliminarAF(false);
  }

  function openModalEliminarAF(id_area_frascati) {
    setIdAreaFrascatiEliminar(id_area_frascati);
    setModalIsOpenEliminarAF(true);
  }

  function closeModalEliminarAU() {
    setModalIsOpenEliminarAU(false);
  }

  function openModalEliminarAU(id_area_unesco) {
    setIdAreaUnescoEliminar(id_area_unesco);
    setModalIsOpenEliminarAU(true);
  }

  function closeModalActualizarAF() {
    setModalIsOpenActualizarAF(false);
  }

  function openModalActualizarAF() {
    setModalIsOpenActualizarAF(true);
  }

  function closeModalActualizarAU() {
    setModalIsOpenActualizarAU(false);
  }

  function openModalActualizarAU() {
    setModalIsOpenActualizarAU(true);
  }

  function actualizarAreaFrascati() {
    let id_area_frascati = document.getElementById("idAreaFrascatiText").value;
    let descripcion = document.getElementById("descripcionAreaFrascatiText").value;
    if (validacionInputService.campoVacio(id_area_frascati) && validacionInputService.campoVacio(descripcion)) {
      areaFrascatiService.actualizar({
        id_area_frascati: id_area_frascati,
        descripcion: descripcion
      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleAreasFrascati();
        }
        closeModalActualizarAF();
      })
    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

  function actualizarAreaUnesco() {
    let id_area_unesco = document.getElementById("idAreaFrascatiText").value;
    let descripcion_unesco = document.getElementById("descripcionAreaFrascatiText").value;
    if (validacionInputService.campoVacio(id_area_unesco) && validacionInputService.campoVacio(descripcion_unesco)) {
      areaUnescoService.actualizar({
        id_area_unesco: id_area_unesco,
        descripcion_unesco: descripcion_unesco
      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleAreasUnesco();
        }
        closeModalActualizarAU();
      })
    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

  function handleCargarDetalleAreaFrascati(id_area_frascati, descripcion) {
    setAreaFrascatiObj({
      id_area_frascati: id_area_frascati,
      descripcion: descripcion
    });
    openModalActualizarAF()
  }

  function handleCargarDetalleAreaUnesco(id_area_unesco, descripcion) {
    setAreaUnescoObj({
      id_area_unesco: id_area_unesco,
      descripcion_unesco: descripcion
    });
    openModalActualizarAU()
  }

  React.useEffect(() => {
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
              <Card.Body className="table-full-width table-responsive px-3">
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label>Áreas</label>
                      <Form.Row>
                        <select className="form-control" id="filtroOpcionesAreas" onChange={handleCargarDatosAreasPorFiltro}>
                          <option value="AF">Ingreso área frascati</option>
                          <option value="AU">Ingreso área unesco</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {filtroAreas === 'AF' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Area Frascati</Card.Title>
                  <p className="card-category">
                    Ingresa y Lista Areas Frascati a la que pertenecen los documentos publicados
                  </p>
                  <Row>
                    <Col className="pr-1" md="9">
                      <Form.Group>
                        <label>NOMBRE DEL ÁREA</label>
                        <Form.Control
                          id="areaFrascatiText"
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
                          onClick={handleAgregarAreaFrascati}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableAreasFrascati" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areasFracati.map(item => (
                        <tr className="small" key={item.id_area_frascati}>
                          <td>{item.id_area_frascati}</td>
                          <td>{item.descripcion}</td>
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="actualizarAreaFrascati" className="btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleAreaFrascati(item.id_area_frascati, item.descripcion)} >Editar</Button>
                              <Button id="eliminarAreaFrascati" className="btn-sm active" type="button" variant="danger" onClick={() => openModalEliminarAF(item.id_area_frascati)} >Eliminar</Button>
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
          {filtroAreas === 'AU' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Area Unesco</Card.Title>
                  <p className="card-category">
                    Ingresa y Lista Areas Unesco a la que pertenecen los documentos publicados
                  </p>
                  <Row>
                    <Col className="pr-1" md="9">
                      <Form.Group>
                        <label>NOMBRE DEL ÁREA</label>
                        <Form.Control
                          id="areaUnescoText"
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
                          onClick={handleAgregarAreaUnesco}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableAreasUnesco" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areasUnesco.map(item => (
                        <tr className="small" key={item.id_area_unesco}>
                          <td>{item.id_area_unesco}</td>
                          <td>{item.descripcion_unesco}</td>
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="actualizarAreaUnesco" className="btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleAreaUnesco(item.id_area_unesco, item.descripcion_unesco)} >Editar</Button>
                              <Button id="eliminarAreaUnesco" className="btn-sm active" type="button" variant="danger" onClick={() => openModalEliminarAU(item.id_area_unesco)} >Eliminar</Button>
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
        </Row>
      </Container>
      <Modal
        className="modal modal-primary"
        show={modalIsOpenEliminarAF}
        size="xl"
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>¿ Esta seguro de eliminar el área frascati ?</p>
        </Modal.Body>
        <div className="modal-footer">
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalEliminarAF()}
          >
            Regresar
          </Button>
          <Button
            id="eliminar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => handleEliminarAreaFrascati(idAreaFrascatiEliminar)}
          >
            SI
          </Button>
        </div>
      </Modal>
      <Modal
        className="modal modal-primary"
        show={modalIsOpenEliminarAU}
        size="xl"
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>¿ Esta seguro de eliminar el área unesco ?</p>
        </Modal.Body>
        <div className="modal-footer">
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalEliminarAU()}
          >
            Regresar
          </Button>
          <Button
            id="eliminar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => handleEliminarAreaUnesco(idAreaUnescoEliminar)}
          >
            SI
          </Button>
        </div>
      </Modal>
      <Modal
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenActualizarAF}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-grid-45"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Actualizar Área Frascati</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>ID</label>
              <Form.Control
                id="idAreaFrascatiText"
                defaultValue={areaFrascatiObj.id_area_frascati}
                type="text"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>DESCRIPCION</label>
              <Form.Control
                id="descripcionAreaFrascatiText"
                defaultValue={areaFrascatiObj.descripcion}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalActualizarAF()}
          >
            Regresar
          </Button>
          <Button
            id="grabar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => actualizarAreaFrascati()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
      <Modal
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenActualizarAU}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-grid-45"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Actualizar Área Unesco</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>ID</label>
              <Form.Control
                id="idAreaFrascatiText"
                defaultValue={areaUnescoObj.id_area_unesco}
                type="text"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>DESCRIPCION</label>
              <Form.Control
                id="descripcionAreaFrascatiText"
                defaultValue={areaUnescoObj.descripcion_unesco}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalActualizarAU()}
          >
            Regresar
          </Button>
          <Button
            id="grabar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => actualizarAreaUnesco()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Areas;
