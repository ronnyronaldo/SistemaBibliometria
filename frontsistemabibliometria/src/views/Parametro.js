import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { parametroService } from "_services/parametro.service";
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
  Modal,
  ModalBody,
  ModalFooter
} from "react-bootstrap";
function Parametro() {

  const [showModal, setShowModal] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [parametroObj, setParametroObj] = React.useState({
    id_parametro:0, 
    nombre: "", 
    valor: "",
    codigo_parametro: ""
  })

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
      if(value.respuesta.error == "False"){
        handleListaParametro();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarParametro = (event) => {
    let nombre = document.getElementById("nombreText").value;
    let valor = document.getElementById("valorText").value;
    let codigo_parametro = document.getElementById("codigoParametroText").value;
   
    if(validacionInputService.campoVacio(nombre)){
      if(validacionInputService.campoVacio(valor)){
        if(validacionInputService.campoVacio(codigo_parametro)){
          setLoading(true);
          parametroService.insertar({
            "nombre": nombre,
            "valor": valor,
            "codigo_parametro": codigo_parametro
          }).then(value =>{
            setLoading(false);
            if(value.respuesta.error == "False"){
              handleListaParametro();
              notify("tr", value.respuesta.valor, "primary");
            }else{
              notify("tr", value.respuesta.valor, "danger");
            }
          })
        }else{
          notify("tr", 'No ha ingresado el código del parámetro.', "danger");
        }
      }else{
        notify("tr", 'No ha ingresado el valor del parámetro.', "danger");
      }
    }else{
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
      id_parametro:id_parametro, 
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

    if(validacionInputService.campoVacio(nombre) && validacionInputService.campoVacio(valor) && validacionInputService.campoVacio(codigo_parametro)){
      parametroService.actualizar({
        "id_parametro": id_parametro,
        "nombre": nombre,
        "valor": valor,
        "codigo_parametro": codigo_parametro
      }).then(value => {
        if(value.respuesta.error== "False"){
          notify("tr", value.respuesta.valor, "primary");
          handleListaParametro();
        }
        closeModal();
      })
    }else{
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

  React.useEffect(() => {
    handleListaParametro();
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
                <Card.Title as="h4">Parámetro</Card.Title>
                <p className="card-category">
                  Características Específicas del Sistema
                </p>
                <Row>
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
                      <th>NOMBRE</th>
                      <th>VALOR</th>
                      <th>CÓDIGO PARÁMETRO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parametros.map(item => (
                      <tr className="small" key={item.id_parametro}>
                        <td>{item.nombre}</td>
                        <td>{item.valor}</td>
                        <td>{item.codigo_parametro}</td>
                        <td width="5%"><Link to="#" id="actualizarParametro" className="link col-sm-12 col-md-3" onClick={() => handleCargarDetalleParametro(item.id_parametro, item.nombre, item.valor, item.codigo_parametro)} ><i className="fas fa-pen-square fa-2x"></i></Link>
                        <Link to="#" id="eliminarParametro" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarParametro(item.id_parametro)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
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
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => closeModal()}
            >
              Regresar
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => actualizarParametro()}
            >
              Grabar
            </Button>
          </div>
        </Modal>
    </>
  );
}

export default Parametro;
