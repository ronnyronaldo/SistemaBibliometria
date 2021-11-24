import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { areaSJRService } from "_services/areaSJR.service";
import { parametroService } from "_services/parametro.service";
import { validacionInputService } from '../_services/validacionInput.service';
import { equivalenciaAreaUnescoService } from "_services/equivalenciaAreaUnesco.service";
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
  Modal,
  ModalBody,
  ModalFooter
} from "react-bootstrap";
function Parametro() {

  const [showModal, setShowModal] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [opcionPantalla, setOpcionPantalla] = React.useState("p");
  const [areasSJR, setAreasSJR] = React.useState([]);
  const [equivalenciaPorAreaUnesco, setEquivalenciaPorAreaUnesco] = React.useState([]);
  const [parametroObj, setParametroObj] = React.useState({
    id_parametro: 0,
    nombre: "",
    valor: "",
    codigo_parametro: ""
  });
  const [idEliminarParametro, setIdEliminarParametro] = React.useState('');
  const [modalIsOpenEliminar, setModalIsOpenEliminar] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
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

  const [parametros, setParametros] = React.useState([]);

  async function handleListaParametro() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableParametro');
    await parametroService.listaParametro().then(value => {
      setParametros(value.parametro);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableParametro');
  }

  const handleEliminarParametro = (id_parametro) => {
    setLoading(true);
    parametroService.eliminar(id_parametro).then(value => {
      setLoading(false);
      closeModalEliminar();
      if (value.respuesta.error == "False") {
        handleListaParametro();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarParametro = (event) => {
    let nombre = document.getElementById("nombreText").value;
    let valor = document.getElementById("valorText").value;
    let codigo_parametro = document.getElementById("codigoParametroText").value;

    if (validacionInputService.campoVacio(nombre)) {
      if (validacionInputService.campoVacio(valor)) {
        if (validacionInputService.campoVacio(codigo_parametro)) {
          setLoading(true);
          parametroService.insertar({
            "nombre": nombre,
            "valor": valor,
            "codigo_parametro": codigo_parametro
          }).then(value => {
            setLoading(false);
            if (value.respuesta.error == "False") {
              handleListaParametro();
              notify("tr", value.respuesta.valor, "primary");
            } else {
              notify("tr", value.respuesta.valor, "danger");
            }
          })
        } else {
          notify("tr", 'No ha ingresado el código del parámetro.', "danger");
        }
      } else {
        notify("tr", 'No ha ingresado el valor del parámetro.', "danger");
      }
    } else {
      notify("tr", 'No ha ingresado el nombre del parámetro.', "danger");
    }
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function handleCargarDetalleParametro(id_parametro, nombre, valor, codigo_parametro) {
    setParametroObj({
      id_parametro: id_parametro,
      nombre: nombre,
      valor: valor,
      codigo_parametro: codigo_parametro
    });
    openModal()
  }

  function actualizarParametro() {
    let id_parametro = parametroObj.id_parametro;
    let nombre = document.getElementById("nombreDetText").value;
    let valor = document.getElementById("valorDetText").value;
    let codigo_parametro = document.getElementById("codigoParametroDetText").value;

    if (validacionInputService.campoVacio(nombre) && validacionInputService.campoVacio(valor) && validacionInputService.campoVacio(codigo_parametro)) {
      parametroService.actualizar({
        "id_parametro": id_parametro,
        "nombre": nombre,
        "valor": valor,
        "codigo_parametro": codigo_parametro
      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleListaParametro();
        }
        closeModal();
      })
    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }
  function closeModalEliminar() {
    setModalIsOpenEliminar(false);
  }

  function openModalEliminar(id_parametro) {
    setIdEliminarParametro(id_parametro);
    setModalIsOpenEliminar(true);
  }

  async function handleAreasUnesco() {
    setLoading(true);
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
  }

  async function handleAreasSJR() {
    setLoading(true);
    await areaSJRService.listaAreasSJR().then(value => {
      setAreasSJR(value.area_sjr);
      setLoading(false);
    });
  }

  async function handleEquivalenciaPorAreaUnesco() {
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataEquivalenciaAreaUnesco');
    await equivalenciaAreaUnescoService.listaEquivalenciaAreaUnesco(idAreaUnesco).then(value => {
      setEquivalenciaPorAreaUnesco(value.datos);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataEquivalenciaAreaUnesco');
  }

  const handleAgregarEquivalenciaAreaUnesco = (event) => {
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaSJR = parseInt(document.getElementById("idAreaSJR").value);

    if (idAreaUnesco != "0") {
      if (idAreaSJR != "0") {
        setLoading(true);
        equivalenciaAreaUnescoService.insertar({
          "id_area_unesco": idAreaUnesco,
          "id_area_sjr": idAreaSJR,
        }).then(value => {
          setLoading(false);
          if (value.respuesta.error == "False") {
            handleEquivalenciaPorAreaUnesco();
            notify("tr", value.respuesta.valor, "primary");
          } else {
            notify("tr", value.respuesta.valor, "danger");
          }
        })
      } else {
        notify("tr", "No ha seleccionado el área sjr", "danger");
      }
    } else {
      notify("tr", "No ha seleccionado el área unesco", "danger");
    }

  }

  const handleEliminarEquivalenciaPorAreaUnesco = (id_equivalencia_area_unesco) => {
    setLoading(true);
    equivalenciaAreaUnescoService.eliminar(id_equivalencia_area_unesco).then(value => {
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleEquivalenciaPorAreaUnesco();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }
  function handleOpcionPantalla(opcion) { // Cargo los datos en Pantalla
    setOpcionPantalla(opcion);
    if (opcion == "p") {
      handleListaParametro();
    } else {
      setEquivalenciaPorAreaUnesco([]);
    }
  }

  React.useEffect(() => {
    handleListaParametro();
    handleAreasUnesco();
    handleAreasSJR();
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
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("p")}>Parámetro</a>
                    <a className="nav-item nav-link" onClick={() => handleOpcionPantalla("e")}>Equivalencias</a>
                  </div>
                </div>
              </nav>
            </Card>
          </Col>
        </Row>
        <Row>
          {opcionPantalla === 'p' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Parámetro</Card.Title>
                  <p className="card-category">
                    Características Específicas del Sistema
                  </p>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>CÓDIGO PARÁMETRO</label>
                        <Form.Control
                          id="codigoParametroText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label>NOMBRE</label>
                        <Form.Control
                          id="nombreText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label>VALOR</label>
                        <Form.Control
                          id="valorText"
                          defaultValue=""
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="1">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="AGREGAR"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleAgregarParametro}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataTableParametro" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>CÓDIGO PARÁMETRO</th>
                        <th>NOMBRE</th>
                        <th>VALOR</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parametros.map(item => (
                        <tr className="small" key={item.id_parametro}>
                          <td width="25%">{item.codigo_parametro}</td>
                          <td width="25%">{item.nombre}</td>
                          <td width="25%">{item.valor}</td>
                          <td width="5%">
                            <div className="btn-group-vertical" role="group" aria-label="Basic example" size={10}>
                              <Button id="actualizarParametro" className="btn btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleParametro(item.id_parametro, item.nombre, item.valor, item.codigo_parametro)} >Editar</Button>
                              <Button id="eliminarParametro" className="btn-sm active" type="button" variant="danger" onClick={() => openModalEliminar(item.id_parametro)}>Eliminar</Button>
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
          {opcionPantalla === 'e' && (
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Equivalencia Area Unesco</Card.Title>
                  <p className="card-category">
                    Equivalencia Area Unesco y Area SJR
                  </p>
                  <Row>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label></label>
                        <select className="form-control" id="idAreaUnesco" onClick={handleEquivalenciaPorAreaUnesco}>
                          <option value="0">Seleccione el área unesco</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label></label>
                        <select className="form-control" id="idAreaSJR">
                          <option value="0">Seleccione el área sjr</option>
                          {areasSJR.map(item => (
                            <option value={item.id_area_sjr} key={item.id_area_sjr}>{item.nombre}</option>
                          ))}
                        </select>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="3">
                      <Form.Group>
                        <label></label>
                        <Form.Control
                          defaultValue="AGREGAR"
                          type="button"
                          className="btn-outline-success"
                          onClick={handleAgregarEquivalenciaAreaUnesco}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered table-hover" id="dataEquivalenciaAreaUnesco" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>NOMBRE AREA SJR</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equivalenciaPorAreaUnesco.map(item => (
                        <tr className="small" key={item.id_equivalencia_area}>
                          <td width="25%">{item.areaSJR}</td>
                          <td width="5%">
                            <Button id="eliminarEquivalenciaAreaUnesco" className="btn-sm active" type="button" variant="danger" onClick={() => handleEliminarEquivalenciaPorAreaUnesco(item.id_equivalencia_area)} >Eliminar</Button>
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
        show={modalIsOpen}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-grid-45"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Actualizar Parámetro</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>CÓDIGO PARÁMETRO</label>
              <Form.Control
                id="codigoParametroDetText"
                defaultValue={parametroObj.codigo_parametro}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>NOMBRE</label>
              <Form.Control
                id="nombreDetText"
                defaultValue={parametroObj.nombre}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>VALOR</label>
              <Form.Control
                id="valorDetText"
                defaultValue={parametroObj.valor}
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
            id="actualizar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => actualizarParametro()}
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
          <p>¿ Esta seguro de eliminar el parámetro ?</p>
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
            onClick={() => handleEliminarParametro(idEliminarParametro)}
          >
            SI
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Parametro;
