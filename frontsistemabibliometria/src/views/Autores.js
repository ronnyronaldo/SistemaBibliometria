import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { autorService } from '../_services/autor.service';
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
  Form
} from "react-bootstrap";
function Autores() {
  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

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
  const [autores, setAutores] = React.useState([]);
  async function handleCargarAutores() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataAutores');
    await autorService.listar().then(value => {
      setAutor(value.autor);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataAutores');
  }
  const handleEliminarAutor = (id_autor) => {
    /*setLoading(true);
    medioPublicacionService.eliminar(id_medio_publicacion).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleCargarMediosPublicacion();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })*/
  }
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
                <Card.Title as="h4">Autores</Card.Title>
                <p className="card-category">
                  Autores de las publicaciones
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataAutores" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>IDENTIFICACIÓN</th>
                      <th>NOMBRE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autores.map(item => (
                      <tr className="small" key={item.id_autor}>
                        <td>{item.identificacion}</td>
                        <td>{item.nombre}</td>
                        <td width="5%"><Link to="#" id="eliminarAutor" className="link col-sm-12 col-md-3" onClick={() => handleEliminarAutor(item.id_autor)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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

export default Autores;
