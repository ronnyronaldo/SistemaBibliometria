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
} from "react-bootstrap";
function Areas() {

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
      if(value.respuesta.error == "False"){
        handleAreasFrascati();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleEliminarAreaUnesco = (id_area_unesco) => {
    setLoading(true);
    areaUnescoService.eliminar(id_area_unesco).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleAreasUnesco();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleAgregarAreaFrascati = (event) => {
    let nombreAreaFrascati = document.getElementById("areaFrascatiText").value;
    let estado = validacionInputService.campoVacio(nombreAreaFrascati);
    if(estado == true){
      setLoading(true);
      areaFrascatiService.insertar({
        "descripcion": nombreAreaFrascati 
      }).then(value =>{
        setLoading(false);
        if(value.respuesta.error == "False"){
          handleAreasFrascati();
          notify("tr", value.respuesta.valor, "primary");
        }else{
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
    if(estado == true){
      setLoading(true);
      areaUnescoService.insertar({
        "descripcion_unesco": nombreAreaUnesco 
      }).then(value =>{
        setLoading(false);
        if(value.respuesta.error == "False"){
          handleAreasUnesco();
          notify("tr", value.respuesta.valor, "primary");
        }else{
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    } 
    else {
      notify("tr", 'No ha ingresado el nombre del Área de Tipo Unesco.', "danger");
    }
  }
  React.useEffect(() => {
    handleAreasFrascati();
    handleAreasUnesco();
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
                        <td width="5%"><Link to="#" id="eliminarAreaFrascati" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarAreaFrascati(item.id_area_frascati)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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
                        <td width="5%"><Link to="#" id="eliminarAreaUnesco" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarAreaUnesco(item.id_area_unesco)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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

export default Areas;
