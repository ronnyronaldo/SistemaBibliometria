import React from "react";
import { publicacionService } from '../_services/publicacion.service';
import { referenciaService } from '../_services/referencia.service';
import { validacionInputService } from '../_services/validacionInput.service';
import { detalleReferenciaService } from '../_services/detalle_referencia.service';
import { publicacionObj } from "../utils/types";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

/**Spinner */
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
/**Spinner */
const custom = {
  width: "78px !important"
}

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
import * as FileSaver from "file-saver";
import { baseDatosDigitalService } from "_services/baseDatosDigital.service";
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { medioPublicacionService } from "_services/medio_publicacion.service";
/** Spinner */
const override = css`
  display: block;
  margin: 0 auto;
  border-color: #212F3C;
`;

/**Spinner */

function Publicaciones() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalIsOpenEliminar, setModalIsOpenEliminar] = React.useState(false);
  const [modalIsOpenReferencias, setModalIsOpenReferencias] = React.useState(false);
  const [modalIsOpenDetReferencias, setModalIsOpenDetReferencias] = React.useState(false);
  const [idArticuloEliminar, setIdArticuloEliminar] = React.useState('');

  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

  /**Variables y funciones para mostrar alertas al usuario */
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [datoReferencia, setDatoReferencia] = React.useState({
    idArticulo: 0,
    referencia: ""
  });

  const [publicacionObj, setPublicacionObj] = React.useState({
    id_articulo: 0,
    nombres: "",
    titulo: "",
    anio_publicacion: "",
    tipo_publicacion: "",
    cuartil: "",
    doi: ""
  })

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
  /**Fin  de las variables y funciones para mostrar alertas al usuario */
  const [publicaciones, setPublicaciones] = React.useState([]);
  const [referencias, setReferencias] = React.useState([]);
  const [detalleReferencias, setDetalleReferencias] = React.useState([]);

  const [publicacionSeleccionada, setPublicacionSeleccionada] = React.useState({
    titulo_publicacion: "",
    autor: "",
    anio_publicacion: "",
    nombre_base_datos_digital: "",
    doi: ""
  });

  const [nuevasPublicaciones, setNuevasPublicaciones] = React.useState([]);
  async function handleReadExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setNuevasPublicaciones(data);
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

  async function handleCargarDatosPublicaciones() {
    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      titulo_publicacion: "",
      autor: "",
      anio_publicacion: "",
      nombre_base_datos_digital: ""
    })

    setDatoReferencia({
      ...datoReferencia,
      idArticulo: 0
    })

    await tablaPaginacionService.destruirTabla('#dataTablePublicaciones');
    setLoading(true)
    await publicacionService.listar().then(value => {
      setPublicaciones(value.articulos);
      setLoading(false)
    });
    await tablaPaginacionService.paginacion('#dataTablePublicaciones');
  }

  async function handleCargarReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital) {

    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      titulo_publicacion: titulo,
      autor: autor,
      anio_publicacion: anio_publicacion,
      nombre_base_datos_digital: nombre_base_datos_digital
    })

    setDatoReferencia({
      ...datoReferencia,
      idArticulo: id_articulo
    })
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableReferencias');
    await referenciaService.listarReferenciasPorIdArticulo(id_articulo).then(async (value) => {
      setLoading(false);
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferencias');
  }

  async function handleCargarDetReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital) {

    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      titulo_publicacion: titulo,
      autor: autor,
      anio_publicacion: anio_publicacion,
      nombre_base_datos_digital: nombre_base_datos_digital
    })

    setDatoReferencia({
      ...datoReferencia,
      idArticulo: id_articulo
    })
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableDetalleReferencias');
    await detalleReferenciaService.detalleReferenciaPorIdArticulo(id_articulo).then(value => {
      setLoading(false);
      setDetalleReferencias(value.detalleReferencia);
    });
    await tablaPaginacionService.paginacion('#dataTableDetalleReferencias');
  }

  const handleEliminarArticulo = (id_articulo) => {
    setLoading(true);
    publicacionService.eliminar(id_articulo).then(value => {
      closeModalEliminar();
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleCargarDatosPublicaciones();
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  async function handleIngresarPublicaciones() {
    setLoading(true);
    if (nuevasPublicaciones.length != 0) {
      publicacionService.insertar({ nuevasPublicaciones }).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          if (value.respuesta.mensajes.length > 0) {
            exportToCSV(value.respuesta.mensajes, "observacionesIngresoPublicaciones");
            notify("tc", "Revise las observaciones colocadas en el archivo de excel del ingreso de las publicaciones.", "primary");
          }
        }
        handleCargarDatosPublicaciones();
      })
    } else {
      notify("tr", 'No ha ingresado el archivo o no existen datos para cargar.', "danger");
    }
    setLoading(false)
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalDetReferencias() {
    setModalIsOpenDetReferencias(false);
  }

  function openModalDetReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital) {
    handleCargarDetReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital);
    setModalIsOpenDetReferencias(true);
  }

  function closeModalReferencias() {
    setModalIsOpenReferencias(false);
  }

  function openModalReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital) {
    handleCargarReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital);
    setModalIsOpenReferencias(true);
  }

  function closeModalEliminar() {
    setModalIsOpenEliminar(false);
  }

  function openModalEliminar(id_articulo) {
    setIdArticuloEliminar(id_articulo);
    setModalIsOpenEliminar(true);
  }

  function handleCargarDetallePublicacion(id_articulo, nombres, titulo, anio_publicacion, tipo_publicacion, cuartil, doi) {
    setPublicacionObj({
      id_articulo: id_articulo,
      nombres: nombres,
      titulo: titulo,
      anio_publicacion: anio_publicacion,
      tipo_publicacion: tipo_publicacion,
      cuartil: cuartil,
      doi: doi
    })
    openModal()
  }

  function actualizarPublicacion() {
    let id_articulo = publicacionObj.id_articulo;
    let autor = document.getElementById("autorText").value;
    let titulo = document.getElementById("tituloText").value;
    let anio = document.getElementById("anioText").value;
    let tipoPublicacion = document.getElementById("tipoPublicacionText").value;
    let cuartil = document.getElementById("cuartilText").value;
    let doi = document.getElementById("doiText").value;

    if (validacionInputService.campoVacio(autor) && validacionInputService.campoVacio(titulo) && validacionInputService.campoVacio(anio) && validacionInputService.campoVacio(tipoPublicacion)) {
      publicacionService.actualizar({
        "id_articulo": id_articulo,
        "autor": autor,
        "titulo": titulo,
        "anio": anio,
        "tipoPublicacion": tipoPublicacion,
        "cuartil": cuartil,
        "doi": doi

      }).then(value => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
          handleCargarDatosPublicaciones();
        }
        closeModal();
      })

    } else {
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
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

  React.useEffect(() => {
    handleCargarDatosPublicaciones();
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
                      <th>CUARTIL</th>
                      <th>DOI</th>
                      <th>ENLACE DOCUMENTO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones.map(item => (
                      <tr className="small" key={item.id_articulo}>
                        <td width="15%">{item.nombres}</td>
                        <td width="15%">{item.titulo}</td>
                        <td width="5%">{item.anio_publicacion}</td>
                        <td width="7%">{item.tipo_publicacion}</td>
                        <td width="20%">{item.nombre}</td>
                        <td width="5%">{item.descripcion_unesco}</td>
                        <td width="5%">{item.descripcion}</td>
                        <td width="5%">{item.nombre_base_datos_digital}</td>
                        <td width="1%">{item.cuartil}</td>
                        <td width="5%">{item.doi}</td>
                        <td width="5%">
                          <a href={item.enlace_documento != null ? item.enlace_documento : item.url_dspace} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a>
                        </td>
                        <td width="25%">
                          <div class="btn-group-vertical" role="group" aria-label="Basic example">
                            <Button id="actualizarPublicacion" className="btn btn-sm active" type="button" variant="info" onClick={() => handleCargarDetallePublicacion(item.id_articulo, item.nombres, item.titulo, item.anio_publicacion, item.tipo_publicacion, item.cuartil, item.doi)} >Editar</Button>
                            <Button id="referencias" className="btn btn-sm active" type="button" variant="warning" onClick={() => openModalReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion, item.nombre_base_datos_digital)} >Referencias</Button>
                            <Button id="detalleReferencias" className="btn-sm active" type="button" variant="success" onClick={() => openModalDetReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion, item.nombre_base_datos_digital)} >Det. Referencias</Button>
                            <Button id="eliminarArticulo" className="btn-sm active" type="button" variant="danger" onClick={() => openModalEliminar(item.id_articulo)} >Eliminar</Button>
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
        className="modal modal-primary"
        show={modalIsOpen}
        size="xl"
      >
        <Card className="strpied-tabled-with-hover">
          <Modal.Header className="justify-content-center">
            <div className="modal-profile ">
              <i className="nc-icon nc-single-copy-04"></i>
            </div>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Actualizar Publicación</p>
          </Modal.Body>
          <div className="modal-footer">
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>AUTOR</label>
                <Form.Control
                  id="autorText"
                  defaultValue={publicacionObj.nombres}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>TITULO</label>
                <Form.Control
                  id="tituloText"
                  defaultValue={publicacionObj.titulo}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>AÑO PUBLICACION</label>
                <Form.Control
                  id="anioText"
                  defaultValue={publicacionObj.anio_publicacion}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>TIPO PUBLICACIÓN</label>
                <Form.Control
                  id="tipoPublicacionText"
                  defaultValue={publicacionObj.tipo_publicacion}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>CUARTIL</label>
                <Form.Control
                  id="cuartilText"
                  defaultValue={publicacionObj.cuartil}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1" md="12">
              <Form.Group>
                <label>DOI</label>
                <Form.Control
                  id="doiText"
                  defaultValue={publicacionObj.doi}
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
              onClick={() => actualizarPublicacion()}
            >
              Grabar
            </Button>
          </div>
        </Card>
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
          <p>¿ Esta seguro de eliminar la publicación ?</p>
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
            onClick={() => handleEliminarArticulo(idArticuloEliminar)}
          >
            SI
          </Button>
        </div>
      </Modal>

      <Modal
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenReferencias}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Referencias</p>
        </Modal.Body>
        <Modal.Body className="text-left">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>PUBLICACION</label>
              <Form.Control
                defaultValue={publicacionSeleccionada.titulo_publicacion + " (" + publicacionSeleccionada.autor + ", " + publicacionSeleccionada.anio_publicacion + " )"}
                disabled
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>REFERENCIA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referencias.map(item => (
                      <tr className="small" key={item.id_referencia}>
                        <td>{item.referencia}</td>
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
            onClick={() => closeModalReferencias()}
          >
            Regresar
          </Button>
        </div>
      </Modal>
      <Modal
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenDetReferencias}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Detalle Referencias</p>
        </Modal.Body>
        <Modal.Body className="text-left">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>PUBLICACION</label>
              <Form.Control
                defaultValue={publicacionSeleccionada.titulo_publicacion + " (" + publicacionSeleccionada.autor + ", " + publicacionSeleccionada.anio_publicacion + " )"}
                disabled
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card className="card-plain table-plain-bg">
                <Card.Body className="table-full-width table-responsive px-3">
                  <table className="table table-bordered" id="dataTableDetalleReferencias" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th>ID REFERENCIA</th>
                        <th>TITULO</th>
                        <th>AUTOR</th>
                        <th>AÑO</th>
                        <th>MEDIO PUBLICACION</th>
                        <th>NUMERO CITACIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleReferencias.map(item => (
                        <tr className="small" key={item.id_referencia}>
                          <td width="10%">{item.id_referencia}</td>
                          <td>{item.title}</td>
                          <td>{item.author}</td>
                          <td>{item.pub_year}</td>
                          <td>{item.venue}</td>
                          <td>{item.num_citations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Card>
          </Col>
        </Modal.Body>

        <div className="modal-footer">
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalDetReferencias()}
          >
            Regresar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Publicaciones;
