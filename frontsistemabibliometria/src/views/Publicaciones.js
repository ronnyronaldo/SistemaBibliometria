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
    id_articulo:0, 
    nombres: "", 
    titulo: "", 
    anio_publicacion: "", 
    tipo_publicacion: "", 
    cuartil:""
  })

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
  /**Fin  de las variables y funciones para mostrar alertas al usuario */
  const [publicaciones, setPublicaciones] = React.useState([]);
  const [publicacion, setPublicacion] = React.useState({});
  const [referencias, setReferencias] = React.useState([]);
  const [detalleReferencias, setDetalleReferencias] = React.useState([]);
  const [tipoIngresoReferencias, setTipoIngresoReferencias] = React.useState({
    ingresoManual: true,
    ingresoAutomatico: false
  });

  const [publicacionSeleccionada, setPublicacionSeleccionada] = React.useState({
    titulo_publicacion: "",
    autor: "",
    anio_publicacion: "",
    nombre_base_datos_digital: ""
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
    document.getElementById("referenciaText").value = "";

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
    await referenciaService.listarReferenciasPorIdArticulo(id_articulo).then(async(value) => {
      setLoading(false);
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferencias');
    await tablaPaginacionService.destruirTabla('#dataTableDetalleReferencias');
      await detalleReferenciaService.detalleReferenciaPorIdArticulo(id_articulo).then(value => {
        setLoading(false);
        setDetalleReferencias(value.detalleReferencia);
      });
    await tablaPaginacionService.paginacion('#dataTableDetalleReferencias');
  }

  const handleOnChangeIngresoManual = (event) => {
    setTipoIngresoReferencias({
      ...tipoIngresoReferencias,
      ingresoManual: true,
      ingresoAutomatico: false
    })
  }

  const handleOnChangeIngresoAutomatico = (event) => {
    setTipoIngresoReferencias({
      ...tipoIngresoReferencias,
      ingresoManual: false,
      ingresoAutomatico: true
    })
  }

  const handleCargarRefAutomatica = (event) => {
    setLoading(true)
    if(datoReferencia.idArticulo != 0){
      console.log("Cargar datos de referencias automatica....")
      referenciaService.insertarAutomaticoScopus({
        "id_articulo": datoReferencia.idArticulo,
        "nombre_base_datos_digital": publicacionSeleccionada.nombre_base_datos_digital
      }).then(value =>{
        setLoading(false);
        if (value.respuesta.error == "False") {
          if(value.respuesta.mensajes.length > 0){
            for( var i = 0; i< value.respuesta.mensajes.length; i++){
              if(value.respuesta.mensajes[i].error== "False"){
                notify("tr", value.respuesta.mensajes[i].mensaje, "primary");
              }else{
                notify("tr", value.respuesta.mensajes[i].mensaje, "danger");
              }
            }
          }
        } 
      })
    }else {
      notify("tr", 'No ha seleccionado ninguna publicación.', "danger");
    }
    setLoading(false)
  }

  const handleCargarRefManual = (event) => {
    let referencia = document.getElementById("referenciaText").value;
    let estado = validacionInputService.campoVacio(referencia)
    //console.log(datoReferencia.idArticulo)
    if (datoReferencia.idArticulo != 0) {
      if (estado == true) {
        referenciaService.insertarManual({
          "id_articulo": datoReferencia.idArticulo,
          "referencia": referencia
        }).then(value =>{
          if(value.respuesta.error == "False"){
            handleCargarReferencias(datoReferencia.idArticulo, publicacionSeleccionada.titulo_publicacion, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion, publicacionSeleccionada.nombre_base_datos_digital);
            notify("tr", value.respuesta.valor, "primary");
          }else{
            notify("tr", value.respuesta.valor, "danger");
          }
        })
      } else {
        notify("tr", 'No ha ingresado la referencia.', "danger");
      }
    } else {
      notify("tr", 'No ha seleccionado ninguna publicación.', "danger");
    }
  }

  const handleEliminarReferencia = (id_referencia) => {
    setLoading(true);
    referenciaService.eliminar(id_referencia).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleCargarReferencias(datoReferencia.idArticulo, publicacionSeleccionada.titulo_publicacion, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion, publicacionSeleccionada.nombre_base_datos_digital);
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  const handleEliminarArticulo = (id_articulo) => {
    setLoading(true);
    publicacionService.eliminar(id_articulo).then(value => {
      setLoading(false);
      if(value.respuesta.error == "False"){
        handleCargarDatosPublicaciones();
        notify("tr", value.respuesta.valor, "primary");
      }else{
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  async function handleIngresarPublicaciones() {
    setLoading(true);
    if (nuevasPublicaciones.length != 0) {
      publicacionService.insertar({nuevasPublicaciones}).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          if(value.respuesta.mensajes.length > 0){
            for( var i = 0; i< value.respuesta.mensajes.length; i++){
              if(value.respuesta.mensajes[i].error== "False"){
                notify("tr", value.respuesta.mensajes[i].mensaje, "primary");
              }else{
                notify("tr", value.respuesta.mensajes[i].mensaje, "danger");
              }
            }
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

  function handleCargarDetallePublicacion(id_articulo, nombres, titulo, anio_publicacion, tipo_publicacion, cuartil) {
    setPublicacionObj({
      id_articulo:id_articulo, 
      nombres: nombres, 
      titulo: titulo, 
      anio_publicacion: anio_publicacion, 
      tipo_publicacion: tipo_publicacion, 
      cuartil:cuartil
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

    if(validacionInputService.campoVacio(autor) && validacionInputService.campoVacio(titulo) && validacionInputService.campoVacio(anio) && validacionInputService.campoVacio(tipoPublicacion)){
      publicacionService.actualizar({
        "id_articulo": id_articulo,
        "autor": autor,
        "titulo": titulo,
        "anio": anio,
        "tipoPublicacion": tipoPublicacion,
        "cuartil": cuartil

      }).then(value => {
        if(value.respuesta.error== "False"){
          notify("tr", value.respuesta.valor, "primary");
          handleCargarDatosPublicaciones();
        }
        closeModal();
      })
     
    }else{
      notify("tr", 'Existen campos sin llenar.', "danger");
    }
  }

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
                      <th>ENLACE DOCUMENTO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones.map(item => (
                      <tr className="small" key={item.id_articulo} onClick={() => handleCargarReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion, item.nombre_base_datos_digital)}>
                        <td width="15%">{item.nombres}</td>
                        <td width="15%">{item.titulo}</td>
                        <td width="5%">{item.anio_publicacion}</td>
                        <td width="7%">{item.tipo_publicacion}</td>
                        <td width="20%">{item.nombre}</td>
                        <td width="5%">{item.descripcion_unesco}</td>
                        <td width="5%">{item.descripcion}</td>
                        <td width="5%">{item.nombre_base_datos_digital}</td>
                        <td width="5%">{item.cuartil}</td>
                        <td width="5%">
                          <a href={item.enlace_documento != null ? item.enlace_documento : item.url_dspace} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a>
                        </td>
                        <td width="5%"><Link to="#" id="actualizarPublicacion" className="link col-sm-12 col-md-3" onClick={() => handleCargarDetallePublicacion(item.id_articulo, item.nombres, item.titulo, item.anio_publicacion, item.tipo_publicacion, item.cuartil)} ><i className="fas fa-pen-square fa-2x"></i></Link>
                        <Link to="#" id="eliminarArticulo" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarArticulo(item.id_articulo)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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
                <Card.Title as="h4">Ingreso Referencias</Card.Title>
                <Row>
                  <Col className="pr-1" md="5">
                    <Form.Group>
                      <label>TITULO PUBLICACION</label>
                      <Form.Control
                        defaultValue={publicacionSeleccionada.titulo_publicacion}
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="2">
                    <Form.Group>
                      <label>AUTOR AFILIADO</label>
                      <Form.Control
                        defaultValue={publicacionSeleccionada.autor}
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="2">
                    <Form.Group>
                      <label>AÑO DE PUBLICACION</label>
                      <Form.Control
                        defaultValue={publicacionSeleccionada.anio_publicacion}
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="1">
                    <Form.Group>
                      <label>MANUAL</label>
                      <Form.Control
                        id="ingresoManual"
                        type="radio"
                        onChange={handleOnChangeIngresoManual}
                        checked={tipoIngresoReferencias.ingresoManual}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="1">
                    <Form.Group>
                      <label>AUTOMÁTICO</label>
                      <Form.Control
                        id="ingresoAutomatico"
                        type="radio"
                        onChange={handleOnChangeIngresoAutomatico}
                        checked={tipoIngresoReferencias.ingresoAutomatico}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="5">
                    <Form.Group>
                      <label>INGRESE LA REFERENCIA</label>
                      <Form.Control
                        id="referenciaText"
                        defaultValue=""
                        type="text"
                        disabled={tipoIngresoReferencias.ingresoAutomatico}
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
                        onClick={handleCargarRefManual}
                        disabled={tipoIngresoReferencias.ingresoAutomatico}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        value="CARGAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleCargarRefAutomatica}
                        disabled={tipoIngresoReferencias.ingresoManual}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label> </label>
                        <FormGroup>
                        </FormGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Referencias</Card.Title>
                <p className="card-category">
                  {publicacionSeleccionada.titulo_publicacion}
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID REFERENCIA</th>
                      <th>REFERENCIA</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referencias.map(item => (
                      <tr className="small" key={item.id_referencia}>
                        <td width="10%">{item.id_referencia}</td>
                        <td>{item.referencia}</td>
                        <td width="5%"><Link to="#" id="eliminarReferencia" className="link col-sm-12 col-md-3" onClick={()=>handleEliminarReferencia(item.id_referencia)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
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
                <Card.Title as="h4">Detalle Referencias</Card.Title>
                <p className="card-category">
                  {publicacionSeleccionada.titulo_publicacion}
                </p>
              </Card.Header>
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
          </Col>
        </Row>
      </Container>
      <Modal
          className="modal modal-primary"
          show={modalIsOpen}
        >
          <Modal.Header className="justify-content-center">
            <div className="modal-profile">
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
                  cols="80"
                  rows="4"
                  as="textarea"
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
              onClick={() => actualizarPublicacion()}
            >
              Grabar
            </Button>
          </div>
        </Modal>
    </>
  );
}

export default Publicaciones;
