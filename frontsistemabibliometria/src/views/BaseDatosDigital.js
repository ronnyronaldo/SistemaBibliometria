import React from "react";
import { baseDatosDigitalService } from '../_services/baseDatosDigital.service';
import { estadisticasUsoService } from '../_services/estadisticasUso.service';
import { validacionInputService } from '../_services/validacionInput.service';
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
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
function BaseDatosDigital() {
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
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
    id_base_datos_digital:0, 
    nombre: "", 
    proveedor: "", 
    costo_actual: 0, 
    suscripcion_descripcion: "", 
    area_servicio:""
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
                  "nombre_base_datos_digital" : nombreBaseDatos,
                  "proveedor": nombreProveedor,
                  "costo_actual": costoActual,
                  "suscripcion_descripcion": suscripcionDescripcion,
                  "area_servicio": areaServicio,
                  "esUtilizadaEstudio" : 0
                }).then(value =>{
                  setLoading(false);
                  if(value.respuesta.error == "False"){
                    handleCargarBaseDatosDigitales();
                    notify("tr", value.respuesta.valor, "primary");
                  }else{
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
      if(value.respuesta.error == "False"){
        handleCargarBaseDatosDigitales();
        notify("tr", value.respuesta.valor, "primary");
      }else{
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
      id_base_datos_digital:id_base_datos_digital, 
      nombre: nombre_base_datos_digital, 
      proveedor: proveedor, 
      costo_actual: costo_actual, 
      suscripcion_descripcion: suscripcion_descripcion, 
      area_servicio:area_servicio
    });
    openModal()
  }

  function actualizarBaseDatosDigital() {
    let id_base_datos_digital = baseDatosDigitalObj.id_base_datos_digital;
    let nombreBaseDatosDigital =  document.getElementById("nombreBaseDatosDigitalActText").value;
    let nombreProveedor =  document.getElementById("proveedorActText").value;
    let costo_actual =  document.getElementById("costoActualActText").value;
    let suscripcion_descripcion =  document.getElementById("suscripcionDescripcionActText").value;
    let area_servicio =  document.getElementById("areaServicioActText").value;

    if(validacionInputService.campoVacio(nombreBaseDatosDigital) && validacionInputService.campoVacio(nombreProveedor) && validacionInputService.campoVacio(suscripcion_descripcion) && validacionInputService.campoVacio(area_servicio) & validacionInputService.campoVacio(costo_actual) & validacionInputService.esDecimal(costo_actual)){
      baseDatosDigitalService.actualizar({
        "id_base_datos_digital": id_base_datos_digital,
        "nombre": nombreBaseDatosDigital,
        "nombreProveedor": nombreProveedor,
        "costo_actual": costo_actual,
        "suscripcion_descripcion": suscripcion_descripcion,
        "area_servicio": area_servicio

      }).then(value => {
        if(value.respuesta.error== "False"){
          notify("tr", value.respuesta.valor, "primary");
          handleCargarBaseDatosDigitales();
        }
        closeModal();
      })
     
    }else{
      notify("tr", 'Existen campos sin llenar.', "danger");
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
                <Card.Title as="h4">Ingreso Base Datos Digital</Card.Title>
                <Row>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>NOMBRE BASE DATOS DIGITAL</label>
                      <Form.Control
                        id="nombreBaseDatosText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>NOMBRE DEL PROVEEDOR</label>
                      <Form.Control
                        id="nombreProveedorText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>COSTO ACTUAL</label>
                      <Form.Control
                        id="costoActualText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>SUSCRIPCIÓN/DESCRIPCIÓN</label>
                      <Form.Control
                        id="suscripcionDescripcionText"
                        defaultValue=""
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="4">
                    <Form.Group>
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
                  <Col className="pr-1" md="4">
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
                        <td width="5%"><Link to="#" id="actualizarPublicacion" className="link col-sm-12 col-md-3" onClick={() => handleCargarDetalleBaseDatosDigital(item.id_base_datos_digital, item.nombre_base_datos_digital, item.proveedor, item.costo_actual, item.suscripcion_descripcion, item.area_servicio)} ><i className="fas fa-pen-square fa-2x"></i></Link>
                        <Link to="#" id="eliminarBaseDatosDigital" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarBaseDatosDigital(item.id_base_datos_digital)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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
