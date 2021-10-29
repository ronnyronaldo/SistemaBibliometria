import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { autorService } from '../_services/autor.service';
import { articuloAutorService } from '../_services/articuloAutor.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { FormGroup } from "reactstrap";
import *as XLSX from 'xlsx';
import * as FileSaver from "file-saver";

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
  Modal
} from "react-bootstrap";
function Autores() {
  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [nuevosAutores, setNuevosAutores] = React.useState([]);
  const [modalIsOpenPublicaciones, setModalIsOpenPublicaciones] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [autorObj, setAutorObj] = React.useState({
    id_autor: 0,
    nombre: ""
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
  const [autores, setAutores] = React.useState([]);
  const [nombreAutor, setNombreAutor] = React.useState("");
  const [publicaciones, setPublicaciones] = React.useState([]);
  async function handleCargarAutores() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataAutores');
    await autorService.listar().then(value => {
      setAutores(value.autor);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataAutores');
  }
  const handleEliminarArticuloDelAutor = (id_articulo_autor, id_autor) => {
    setLoading(true);
    articuloAutorService.eliminar(id_articulo_autor).then(value => {
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleVerPublicacionesPorAutor(id_autor);
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleVerPublicacionesPorAutor = async (id_autor) => {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataPublicaciones');
    await articuloAutorService.listarArticulosPorIdAutor(id_autor).then(value => {
      setPublicaciones(value.publicaciones);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataPublicaciones');
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
  async function handleIngresarPublicaciones() {
    if (nuevosAutores.length != 0) {
      setLoading(true)
      articuloAutorService.insertar(nuevosAutores).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          if (value.respuesta.mensajes.length > 0) {
            exportToCSV(value.respuesta.mensajes, "observacionesIngresoAutoresPublicaciones");
            notify("tc", "Revise las observaciones colocadas en el archivo de excel del ingreso de las autores por publicaciones.", "primary");
          }
        }
        handleCargarAutores();
      })
    }
  }
  function closeModalPublicaciones() {
    setNombreAutor("");
    setModalIsOpenPublicaciones(false);
  }

  function openModalPublicaciones(id_autor, nombre) {
    handleVerPublicacionesPorAutor(id_autor);
    setNombreAutor(nombre);
    setModalIsOpenPublicaciones(true);
  }
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function handleCargarDetalleAutor(id_autor, nombre) {
    setAutorObj({
      id_autor: id_autor,
      nombre: nombre
    });
    openModal()
  }

  function actualizarAutor() {
    let id_autor = document.getElementById("idAutorText").value;
    let nombre_autor =  document.getElementById("nombreAutorText").value;
    if(validacionInputService.campoVacio(id_autor) && validacionInputService.campoVacio(nombre_autor)){
      autorService.actualizar({
        id_autor : id_autor,
        nombre : nombre_autor
      }).then(value => {
        if(value.respuesta.error== "False"){
          notify("tr", value.respuesta.valor, "primary");
          handleCargarAutores();
        }
        closeModal();
      })
    }else{
      notify("tr", 'Existen campos sin llenar.', "danger");
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
                <Card.Title as="h4">Autores</Card.Title>
                <p className="card-category">
                  Autores de las publicaciones
                </p>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="5">
                        <Form.Group>
                          <label>INGRESE EL ARCHIVO .XLSX CON LOS DATOS DE LOS AUTORES Y SUS RESPECTIVAS PUBLICACIONES</label>
                          <FormGroup>
                            <input type='file' onChange={(e) => {
                              const file = e.target.files[0];
                              handleReadExcel(file)
                            }} className="col-sm-12 col-md-8"></input>
                            <Link to="#" id="ingresarPublicacion" className="link col-sm-12 col-md-3" onClick={handleIngresarPublicaciones}><Button variant="primary">Ingresar <i className="fas fa-file-upload fa-2x" /></Button></Link>
                          </FormGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                  </Form>
                </Card.Body>
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
                        <td width="20%"><i className="fas fa-user"></i> {item.id_autor}</td>
                        <td width="70%">{item.nombre}</td>
                        <td width="10%">
                          <div class="btn-group-vertical" role="group" aria-label="Basic example">
                            <Button id="verPublicacionesAutor" className="btn-sm active" type="button" variant="success" onClick={() => openModalPublicaciones(item.id_autor, item.nombre)}>Ver Publicaciones</Button>
                            <Button id="actualizarAutor" className="btn-sm active" type="button" variant="info" onClick={() => handleCargarDetalleAutor(item.id_autor, item.nombre)} >Editar</Button>
                          </div>
                        </td>
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
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenPublicaciones}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Publicaciones</p>
        </Modal.Body>
        <Modal.Body className="text-left">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>AUTOR</label>
              <Form.Control
                defaultValue={nombreAutor}
                disabled
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataPublicaciones" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>PUBLICACION</th>
                      <th>ENLACE</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones.map(item => (
                      <tr className="small" key={item.id_articulo_autor}>
                        <td width="85%">{item.titulo}</td>
                        <td width="5%">
                          <a href={item.enlace_documento != null ? item.enlace_documento : item.url_dspace} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a>
                        </td>
                        <td width="10%">
                          <div class="btn-group-vertical" role="group" aria-label="Basic example">
                            <Button id="eliminarAutor" className="btn-sm active" type="button" variant="danger" onClick={() => handleEliminarArticuloDelAutor(item.id_articulo_autor, item.id_autor)} >Eliminar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Modal.Body>

        <div className="modal-footer">
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalPublicaciones()}
          >
            Regresar
          </Button>
        </div>
      </Modal>
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
          <p>Actualizar Autor</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>ID</label>
              <Form.Control
                id="idAutorText"
                defaultValue={autorObj.id_autor}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>NOMBRE</label>
              <Form.Control
                id="nombreAutorText"
                defaultValue={autorObj.nombre}
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
            onClick={() => actualizarAutor()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Autores;
