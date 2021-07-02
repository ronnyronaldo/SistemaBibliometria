import React from "react";
import {publicacionService} from '../_services/publicacion.service';
import {referenciaService} from '../_services/referencia.service';
import {publicacionObj} from "../utils/types";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import {
  Alert,
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Form,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { FormGroup } from "reactstrap";
import *as XLSX from 'xlsx';
function Publicaciones() {
  /**Variables y funciones para mostrar alertas al usuario */
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);

  const notify = (place, mensaje) => {
    //var color = Math.floor(Math.random() * 5 + 1);
    var type = "primary";
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
  /**Fin  de las variables y funciones para mostrar alertas al usuario */
  const [publicaciones, setPublicaciones] = React.useState([]);
  const [publicacion, setPublicacion] = React.useState(publicacionObj);
  const [referencias, setReferencias] = React.useState([]);
  const [tituloPublicacion, setTituloPublicacion] = React.useState("");
  const [nuevasPublicaciones, setNuevasPublicaciones] = React.useState([]);
  async function handleReadExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) =>{
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray,{type:"buffer"});
        const wsname = wb.SheetNames[2];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevasPublicaciones(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error)
      };
    })
    promise.then(value =>{
      console.log(value)
    })
  }

  async function handleCargarDatosPublicaciones() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicaciones');
    await publicacionService.listar().then(value => {
      setPublicaciones(value.articulos);
    });
    await tablaPaginacionService.paginacion('#dataTablePublicaciones');
  }

  async function handleCargarReferencias(id_articulo, titulo) {
    setTituloPublicacion(titulo);
    await tablaPaginacionService.destruirTabla('#dataTableReferencias');
    await referenciaService.listarReferenciasPorIdArticulo(id_articulo).then(value => {
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferencias');
  }

  async function handleIngresarPublicaciones() {
    if(nuevasPublicaciones.length != 0){
      for(var i = 0; i<nuevasPublicaciones.length; i++){
        console.log(nuevasPublicaciones[i])
      }
    }else{
      notify("tr", 'No ha ingresado el archivo o no existen datos para cargar.');
    }
  }


  React.useEffect(() => {
    handleCargarDatosPublicaciones();
  }, []);
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
        <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ingreso Publicaciones</Card.Title>
                <p className="card-category">
                  Investigadores con filiación a la Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>INGRESE EL ARCHIVO .XLSX CON LOS DATOS DE LAS PUBLICACIONES </label>
                        <FormGroup>
                          <input type='file' onChange={(e) =>{
                              const file = e.target.files[0];
                              handleReadExcel(file)
                          }} className="col-sm-12 col-md-8"></input> 
                           <Link to="#" id="ingresarPublicacion" className="link col-sm-12 col-md-2" onClick={handleIngresarPublicaciones}><Button variant="primary">Ingresar <i className="fas fa-file-upload fa-2x"/></Button></Link>
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
                <Card.Title as="h4">Publicaciones</Card.Title>
                <p className="card-category">
                  Investigadores con filiación a la Universidad de Cuenca
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTablePublicaciones" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>AUTOR</th>
                      <th>TITULO</th>
                      <th>AÑO</th>
                      <th>TIPO PUBLICACIÓN</th>
                      <th>MEDIO PUBLICACIÓN</th>
                      <th>AREA UNESCO</th>
                      <th>AREA FRASCATI</th>
                      <th>FUENTE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones.map(item => (
                      <tr className="small" key={item.id_articulo} onClick={() => handleCargarReferencias(item.id_articulo, item.titulo)}>
                        <td width="15%">{item.nombres}</td>
                        <td width="20%">{item.titulo}</td>
                        <td width="5%">{item.anio_publicacion}</td>
                        <td width="7%">{item.tipo_publicacion}</td>
                        <td width="20%">{item.nombre}</td>
                        <td width="5%">{item.descripcion_unesco}</td>
                        <td width="5%">{item.descripcion}</td>
                        <td width="5%">{item.nombre_base_datos_digital}</td> 
                        <td width="5%">
                          <a href={item.url_dspace} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Referencias</Card.Title>
                <p className="card-category">
                  {tituloPublicacion}
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID REFERENCIA</th>
                      <th>REFERENCIA</th>
                    </tr>
                  </thead>
                  <tbody>
                      {referencias.map(item => (
                        <tr className="small" key={item.id_referencia}>
                          <td width="10%">{item.id_referencia}</td>
                          <td>{item.referencia}</td>
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

export default Publicaciones;
