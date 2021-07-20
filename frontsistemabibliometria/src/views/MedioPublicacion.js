import React from "react";
import {medioPublicacionService} from '../_services/medio_publicacion.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { validacionInputService } from '../_services/validacionInput.service';

// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

/**Spinner */
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
import { Link } from "react-router-dom";
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
} from "react-bootstrap";
function MedioPublicacion() {

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

  const [mediosPublicacion, setMediosPublicacion] = React.useState([]);
  async function handleCargarMediosPublicacion() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacion');
    await medioPublicacionService.listar().then(value => {
      setMediosPublicacion(value.mediosPublicacion);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableMediosPublicacion');
  }
  const handleEliminarMedioPublicacion = (id_medio_publicacion) => {
    setLoading(true);
    medioPublicacionService.eliminar(id_medio_publicacion).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleCargarMediosPublicacion();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarMedioPublicacion = (event) => {
    let nombreMedioPublicacion = document.getElementById("medioPublicacionText").value;
    let estado = validacionInputService.campoVacio(nombreMedioPublicacion);
    if(estado == true){
      setLoading(true);
      medioPublicacionService.insertar({
        "nombre": nombreMedioPublicacion 
      }).then(value =>{
        setLoading(false);
        if(value.respuesta.error == "False"){
          handleCargarMediosPublicacion();
          notify("tr", value.respuesta.valor, "primary");
        }else{
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    } 
    else {
      notify("tr", 'No ha ingresado el nombre del Medio de Publicación.', "danger");
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
              <Card.Header>
                <Card.Title as="h4">Ingreso Medio Publicación</Card.Title>
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
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Medios de Publicación</Card.Title>
                <p className="card-category">
                  Medios de Publicación donde se encuentran publicados los documentos de los investigadores con filiacion a la Universidad de Cuenca
                </p>
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
                        <td width="5%"><Link to="#" id="eliminarMedioPublicacion" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarMedioPublicacion(item.id_medio_publicacion)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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

export default MedioPublicacion;
