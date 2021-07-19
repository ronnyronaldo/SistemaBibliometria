import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { autorService } from '../_services/autor.service';
import { FormGroup } from "reactstrap";
import *as XLSX from 'xlsx';

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
  const [nuevosAutores, setNuevosAutores] = React.useState([]);
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
      setAutores(value.autor);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataAutores');
  }
  const handleEliminarAutor = (id_autor) => {
    setLoading(true);
    autorService.eliminar(id_autor).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleCargarAutores();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  async function handleReadExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[1];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevosAutores(data);
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
  async function handleIngresarAutores() {
    if (nuevosAutores.length != 0) {
      setLoading(true)
      autorService.insertar(nuevosAutores).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          handleCargarAutores();
          notify("tr", /*nuevoIngreso.titulo + '(' + nuevoIngreso.anio_publicacion + ')' + ': ' + */value.respuesta.valor, "primary");
        } else {
          notify("tr", /*nuevoIngreso.titulo + '(' + nuevoIngreso.anio_publicacion + ')' + ' : ' + */value.respuesta.valor , "danger");
        }
      })

      /*for (var i = 0; i < nuevosAutores.length; i++) {
        setLoading(true)
        let nuevoIngreso = nuevosAutores[i];
        autorService.insertar({
          "nombre_base_datos_digital": nuevoIngreso.nombre != undefined ? nuevoIngreso.nombre : "",
          "titulo": nuevoIngreso.titulo != undefined ? nuevoIngreso.titulo : "",
          "titulo_alternativo": nuevoIngreso.titulo_alternativo != undefined ? nuevoIngreso.titulo_alternativo : "",
          "anio_publicacion": nuevoIngreso.anio_publicacion != undefined ? nuevoIngreso.anio_publicacion : "",
          "autor_identificación": nuevoIngreso.autor_identificación != undefined ? nuevoIngreso.autor_identificación : "",
          "orden_autor": nuevoIngreso.orden_autor != undefined ? nuevoIngreso.orden_autor : "",
          "nombres": nuevoIngreso.nombres != undefined ? nuevoIngreso.nombres : ""
        }).then(value => {
          setLoading(false);
          if (value.respuesta.error == "False") {
            notify("tr", nuevoIngreso.titulo + '(' + nuevoIngreso.anio_publicacion + ')' + ': ' + value.respuesta.valor, "primary");
          } else {
            notify("tr", nuevoIngreso.titulo + '(' + nuevoIngreso.anio_publicacion + ')' + ' : ' + value.respuesta.valor , "danger");
          }
        })
      }*/
    }
  }
  React.useEffect(() => {
    handleCargarAutores();
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
                <Card.Title as="h4">Ingreso de Articulo - Autor</Card.Title>
                <p className="card-category">
                  Ingreso de todos los autores por articulo
                </p>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>INGRESE EL ARCHIVO .XLSX CON LOS DATOS DE LOS AUTORES </label>
                        <FormGroup>
                          <input type='file' onChange={(e) => {
                            const file = e.target.files[0];
                            handleReadExcel(file)
                          }} className="col-sm-12 col-md-8"></input>
                          <Link to="#" id="ingresarPublicacion" className="link col-sm-12 col-md-3" onClick={handleIngresarAutores}><Button variant="primary">Ingresar <i className="fas fa-file-upload fa-2x" /></Button></Link>
                        </FormGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                </Form>
              </Card.Body>
            </Card>
          </Col>
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
                      <th>NOMBRE PUBLICACION</th>
                      <th>IDENTIFICACIÓN</th>
                      <th>NOMBRE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autores.map(item => (
                      <tr className="small" key={item.id_autor}>
                        <td>{item.titulo}</td>
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
