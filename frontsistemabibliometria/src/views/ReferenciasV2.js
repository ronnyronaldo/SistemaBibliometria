import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { publicacionService } from '../_services/publicacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { detalleReferenciaService } from "_services/detalle_referencia.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { validacionInputService } from '../_services/validacionInput.service';
import { Link } from "react-router-dom";
import { referenciaService } from '../_services/referencia.service';
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
  ModalTitle,
  ModalBody,
  ModalFooter,
  FormGroup
} from "react-bootstrap";
function Referencias() {

  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [datosDetalleReferencia, setDatosDetalleReferencia] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalIsOpenReferencias, setModalIsOpenReferencias] = React.useState(false);
  const [modalIsOpenExtraccionReferencias, setModalIsOpenExtraccionReferencias] = React.useState(false);
  const [filtroPublicaciones, setFiltroPublicaciones] = React.useState('PSR');

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

  const [datoDetalleReferencia, setDatoDetalleReferencia] = React.useState({
    id_detalle_referencia: 0,
    titulo: "",
    autor: "",
    anio: "",
    medioPublicacion: ""
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
  /**Fin  de las variables y funciones para mostrar alertas al usuario */
  const [publicaciones, setPublicaciones] = React.useState([]);
  const [referencias, setReferencias] = React.useState([]);
  const [tipoIngresoReferencias, setTipoIngresoReferencias] = React.useState({
    ingresoManual: true,
    ingresoAutomatico: false
  });
  const [publicacionSeleccionada, setPublicacionSeleccionada] = React.useState({
    id_articulo: 0,
    titulo: "",
    autor: "",
    anio_publicacion: 0,
    enlace: ""
  });

  const [referenciaSeleccionada, setReferenciaSeleccionada] = React.useState({
    id_referencia: 0,
    referencia: ""
  });

  const [tipoBusquedaReferencias, setTipoBusquedaReferencias] = React.useState({
    ingresoTotal: true,
    ingresoIndividual: false
  });
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

  const handleCargarRefManual = (event) => {
    let referencia = document.getElementById("referenciaText").value;
    let estado = validacionInputService.campoVacio(referencia)
    //console.log(datoReferencia.idArticulo)
    if (datoReferencia.idArticulo != 0) {
      if (estado == true) {
        referenciaService.insertarManual({
          "id_articulo": datoReferencia.idArticulo,
          "referencia": referencia
        }).then(value => {
          if (value.respuesta.error == "False") {
            handleCargarReferenciasPorIdArticulo(datoReferencia.idArticulo, publicacionSeleccionada.titulo_publicacion, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion, publicacionSeleccionada.nombre_base_datos_digital, publicacionSeleccionada.enlace);
            notify("tr", value.respuesta.valor, "primary");
          } else {
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

  const handleCargarRefAutomatica = (event) => {
    setLoading(true)
    if (datoReferencia.idArticulo != 0) {
      referenciaService.insertarAutomaticoScopus({
        "id_articulo": datoReferencia.idArticulo,
        "nombre_base_datos_digital": publicacionSeleccionada.nombre_base_datos_digital
      }).then(value => {
        setLoading(false);
        if (value.respuesta.error == "False") {
          if (value.respuesta.mensajes.length > 0) {
            for (var i = 0; i < value.respuesta.mensajes.length; i++) {
              if (value.respuesta.mensajes[i].error == "False") {
                handleCargarReferenciasPorIdArticulo(datoReferencia.idArticulo, publicacionSeleccionada.titulo_publicacion, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion, publicacionSeleccionada.nombre_base_datos_digital, publicacionSeleccionada.enlace);
                notify("tr", value.respuesta.mensajes[i].mensaje, "primary");
              } else {
                notify("tr", value.respuesta.mensajes[i].mensaje, "danger");
              }
            }
          }
        }
      })
    } else {
      notify("tr", 'No ha seleccionado ninguna publicación.', "danger");
    }
    setLoading(false)
  }

  async function handleCargarReferenciasNoEncontradas(id_articulo, titulo, autor, anio_publicacion) {
    setLoading(true);
    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      id_articulo: id_articulo,
      titulo: titulo,
      autor: autor,
      anio_publicacion: anio_publicacion
    })
    await tablaPaginacionService.destruirTabla('#dataTableDetalleReferencias');
    await referenciaService.listarReferenciasNoEcontradasPorIdArticulo(id_articulo).then(value => {
      setReferencias(value.referencias);
      setLoading(false);
    });
    await tablaPaginacionService.paginacion('#dataTableDetalleReferencias');
  }

  async function handleBuscar() {
    if (tipoBusquedaReferencias.ingresoTotal == true) {
      setLoading(true);
      referenciaService.buscarDetalleReferenciaTotal({
        "id_articulo": publicacionSeleccionada.id_articulo
      }).then(value => {
        if (value.respuesta.error == "False") {
          if (value.respuesta.error == "False") {
            handleCargarReferenciasNoEncontradas(publicacionSeleccionada.id_articulo, publicacionSeleccionada.titulo, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion);
            setLoading(false);
            notify("tr", value.respuesta.valor, "primary");
          } else {
            notify("tr", value.respuesta.valor, "danger");
          }
        } else {
          notify("tr", value.respuesta.valor, "danger");
        }
      })
    }
  }
  /** Carga las areas frascati para el filtro*/
  async function handleAreasFrascati() {
    setLoading(true);
    await areaFrascatiService.listaAreasFrascati().then(value => {
      setAreasFrascati(value.area_frascati);
      setLoading(false);
    });
  }
  /**Carga las areas unesco para el filtro */
  async function handleAreasUnesco() {
    setLoading(true);
    await areaUnescoService.listaAreasUnesco().then(value => {
      setAreasUnesco(value.area_unesco);
      setLoading(false);
    });
  }

  /**Carga las referencias detalle */
  async function handleDetalleReferenciaPorFiltros() {
    setDatosDetalleReferencia([]);
    await tablaPaginacionService.destruirTabla('#dataTableMantenimientoDetalleReferencias');
    let idAnio = parseInt(document.getElementById("idAnio").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);

    if (idAnio == 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      detalleReferenciaService.detalleReferenciaPorAreaUnesco(idAreaUnesco).then(async (value) => {
        setDatosDetalleReferencia(value)
        await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
      })
    } else if (idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      detalleReferenciaService.detalleReferenciaPorAreaFrascati(idAreaFrascati).then(async (value) => {
        setDatosDetalleReferencia(value)
        await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
      })
    } else if (idAnio != 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
      detalleReferenciaService.detalleReferenciaPorAreaUnescoPorAnio(idAnio, idAreaUnesco).then(async (value) => {
        setDatosDetalleReferencia(value)
        await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
      })
    } else if (idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
      detalleReferenciaService.detalleReferenciaPorAreaFrascatiPorAnio(idAnio, idAreaFrascati).then(async (value) => {
        setDatosDetalleReferencia(value)
        await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
      })
    } else {
      notify("tr", 'La opción seleccionada no esta disponible.', "danger");
    }
  }


  function closeModal() {
    setModalIsOpen(false);
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModalReferencias() {
    setModalIsOpenReferencias(false);
  }

  function openModalReferencias(id_articulo, titulo, autor, anio_publicacion) {
    handleCargarReferenciasNoEncontradas(id_articulo, titulo, autor, anio_publicacion);
    setModalIsOpenReferencias(true);
  }

  function closeModalExtraccionReferencias() {
    setModalIsOpenExtraccionReferencias(false);
  }

  async function openModalExtraccionReferencias(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital, enlace) {
    handleCargarReferenciasPorIdArticulo(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital, enlace);
    setModalIsOpenExtraccionReferencias(true);
  }

  async function handleCargarReferenciasPorIdArticulo(id_articulo, titulo, autor, anio_publicacion, nombre_base_datos_digital, enlace) {
    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      titulo_publicacion: titulo,
      autor: autor,
      anio_publicacion: anio_publicacion,
      nombre_base_datos_digital: nombre_base_datos_digital,
      enlace: enlace
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

  function handleCargarDatosDetalleReferencia(id_detalle_referencia, title, author, pub_year, venue) {
    setDatoDetalleReferencia({
      id_detalle_referencia: id_detalle_referencia,
      titulo: title,
      autor: author,
      anio: pub_year,
      medioPublicacion: venue

    });
    openModal()
  }

  function actualizarDetalleReferencia() {
    let id_detalle_referencia = datoDetalleReferencia.id_detalle_referencia;
    let medio_publicacion = document.getElementById("medioPublicacionText").value;
    if (validacionInputService.campoVacio(medio_publicacion)) {
      detalleReferenciaService.actualizarDetalleReferencia({
        "id_detalle_referencia": id_detalle_referencia,
        "medio_publicacion": medio_publicacion
      }).then(async (value) => {
        if (value.respuesta.error == "False") {
          notify("tr", value.respuesta.valor, "primary");
        }
        await closeModal();
        await tablaPaginacionService.destruirTabla('#dataTableMantenimientoDetalleReferencias');
        let idAnio = parseInt(document.getElementById("idAnio").value);
        let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
        let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);

        if (idAnio == 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
          detalleReferenciaService.detalleReferenciaPorAreaUnesco(idAreaUnesco).then(async (value) => {
            setDatosDetalleReferencia(value)
            await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
          })
        } else if (idAnio == 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
          detalleReferenciaService.detalleReferenciaPorAreaFrascati(idAreaFrascati).then(async (value) => {
            setDatosDetalleReferencia(value)
            await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
          })
        } else if (idAnio != 0 && idAreaUnesco != 0 && idAreaFrascati == 0) {
          detalleReferenciaService.detalleReferenciaPorAreaUnescoPorAnio(idAnio, idAreaUnesco).then(async (value) => {
            setDatosDetalleReferencia(value)
            await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
          })
        } else if (idAnio != 0 && idAreaUnesco == 0 && idAreaFrascati != 0) {
          detalleReferenciaService.detalleReferenciaPorAreaFrascatiPorAnio(idAnio, idAreaFrascati).then(async (value) => {
            setDatosDetalleReferencia(value)
            await tablaPaginacionService.paginacion('#dataTableMantenimientoDetalleReferencias');
          })
        } else {
          notify("tr", 'La opción seleccionada no esta disponible.', "danger");
        }

        //await handleDetalleReferenciaPorFiltros();
      })

    } else {
      notify("tr", 'Ingrese el medio de publicación.', "danger");
    }
  }

  async function handleCargarDatosPublicacionesPorFiltro() {
    let filtroPublicaciones = document.getElementById("filtroPublicaciones").value;
    setFiltroPublicaciones(filtroPublicaciones);
    if (filtroPublicaciones == 'PSR') {
      await handleCargarDatosPublicacionesSinReferencias();
    } else if (filtroPublicaciones == 'PSCR') {
      await handleCargarDatosPublicacionesSinCompletarReferencias();
    }
  }

  async function handleCargarDatosPublicacionesSinReferencias() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicacionesSeccionReferencias');
    setLoading(true)
    await publicacionService.listarPublicacionesSinReferencias().then(value => {
      setPublicaciones(value.articulos);
      setLoading(false)
    });
    await tablaPaginacionService.paginacion('#dataTablePublicacionesSeccionReferencias');
  }

  async function handleCargarDatosPublicacionesSinCompletarReferencias() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicacionesSeccionReferencias');
    setLoading(true)
    await publicacionService.listarPublicacionesSinCompletarReferencias().then(value => {
      setPublicaciones(value.articulos);
      setLoading(false)
    });
    await tablaPaginacionService.paginacion('#dataTablePublicacionesSeccionReferencias');
  }

  const handleEliminarReferencia = (id_referencia) => {
    setLoading(true);
    referenciaService.eliminar(id_referencia).then(value => {
      setLoading(false);
      if (value.respuesta.error == "False") {
        handleCargarReferenciasPorIdArticulo(datoReferencia.idArticulo, publicacionSeleccionada.titulo_publicacion, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion, publicacionSeleccionada.nombre_base_datos_digital, publicacionSeleccionada.enlace);
        notify("tr", value.respuesta.valor, "primary");
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
  }

  React.useEffect(() => {
    handleCargarDatosPublicacionesSinReferencias();
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
              <Card.Header> Referencias
                <Card.Title as="h4"></Card.Title>
                <p className="card-category">
                  Gestión Referencias
                </p>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label></label>
                      <Form.Row>
                        <select className="form-control" id="filtroPublicaciones" onChange={handleCargarDatosPublicacionesPorFiltro}>
                          <option value="PSR">Publicaciones sin referencias</option>
                          <option value="PSCR">Publicaciones sin completar detalle referencias</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTablePublicacionesSeccionReferencias" width="100%" cellSpacing="0">
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
                      <tr className="small" key={item.id_articulo} >
                        <td width="15%">{item.nombres}</td>
                        <td width="20%">{item.titulo}</td>
                        <td width="5%">{item.anio_publicacion}</td>
                        <td width="7%">{item.tipo_publicacion}</td>
                        <td width="20%">{item.nombre}</td>
                        <td width="5%">{item.descripcion_unesco}</td>
                        <td width="5%">{item.descripcion}</td>
                        <td width="5%">{item.nombre_base_datos_digital}</td>
                        {filtroPublicaciones === 'PSCR' && (
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="obtenerReferencias" className="btn-sm active" type="button" variant="info" onClick={() => openModalReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion)}>Obtener Detalle Referencias</Button>
                              <Button id="extraerReferencias" className="btn-sm active" type="button" variant="success" onClick={() => openModalExtraccionReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion, item.nombre_base_datos_digital, item.enlace_documento != null ? item.enlace_documento : item.url_dspace)}>Ingresar Referencias</Button>
                            </div>
                          </td>
                        )}
                        {filtroPublicaciones === 'PSR' && (
                          <td width="5%">
                            <div class="btn-group-vertical" role="group" aria-label="Basic example">
                              <Button id="extraerReferencias" className="btn-sm active" type="button" variant="success" onClick={() => openModalExtraccionReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion, item.nombre_base_datos_digital, item.enlace_documento != null ? item.enlace_documento : item.url_dspace)}>Ingresar Referencias</Button>
                            </div>
                          </td>
                        )}
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
                <Card.Title as="h4">Mantenimiento Detalle Referencia</Card.Title>
                <p className="card-category">
                  Detalle Referencia de cada Área
                </p>
                <Row>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO</label>
                      <Form.Row>
                        <select className="form-control" id="idAnio">
                          <option value="0">Seleccione</option>
                          <option value="2016">2016</option>
                          <option value="2017">2017</option>
                          <option value="2018">2018</option>
                          <option value="2019">2019</option>
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Area Frascati</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaFrascati">
                          <option value="0">Seleccione</option>
                          {areasFracati.map(item => (
                            <option value={item.id_area_frascati} key={item.id_area_frascati}>{item.descripcion}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Area Unesco</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaUnesco">
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="EJECUTAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleDetalleReferenciaPorFiltros}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableMantenimientoDetalleReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>REFERENCIA TEXTO</th>
                      <th>TITULO</th>
                      <th>AUTOR</th>
                      <th>AÑO</th>
                      <th>MEDIO PUBLICACION</th>
                      <th>ENLACE DOCUMENTO</th>
                      <th>OPERACIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosDetalleReferencia.map(item => (
                      <tr className="small" key={item.id_detalle_referencia}>
                        <td width="10%">{item.referencia}</td>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.pub_year}</td>
                        <td>{item.venue}</td>
                        <td width="5%">
                          <a href={item.pub_url} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir documento</a>
                        </td>
                        <td width="5%"><Link to="#" id="actualizarDetalleReferencia" className="link col-sm-12 col-md-3" onClick={() => handleCargarDatosDetalleReferencia(item.id_detalle_referencia, item.title, item.author, item.pub_year, item.venue)}><i className="fas fa-pen-square fa-2x"></i></Link></td>
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
        show={modalIsOpenReferencias}
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
                defaultValue={publicacionSeleccionada.titulo + " (" + publicacionSeleccionada.autor + ", " + publicacionSeleccionada.anio_publicacion + " )"}
                disabled
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableDetalleReferencias" width="100%" cellSpacing="0">
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
          <Button
            id="buscar"
            className="btn active"
            type="button"
            variant="success"
            onClick={() => handleBuscar()}
          >
            Buscar Google Scholar
          </Button>
        </div>
      </Modal>

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
          <p>Actualizar Detalle Referencia</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>TITULO</label>
              <Form.Control
                id="tituloText"
                defaultValue={datoDetalleReferencia.titulo}
                cols="80"
                rows="4"
                as="textarea"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>AUTOR</label>
              <Form.Control
                id="autorText"
                defaultValue={datoDetalleReferencia.autor}
                type="text"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>AÑO</label>
              <Form.Control
                id="anioText"
                defaultValue={datoDetalleReferencia.anio}
                type="text"
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="12">
            <Form.Group>
              <label>MEDIO PUBLICACIÓN</label>
              <Form.Control
                id="medioPublicacionText"
                defaultValue={datoDetalleReferencia.medioPublicacion}
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
            onClick={() => actualizarDetalleReferencia()}
          >
            Grabar
          </Button>
        </div>
      </Modal>
      <Modal
        size="xl"
        className="modal modal-primary"
        show={modalIsOpenExtraccionReferencias}
      >
        <Modal.Header className="justify-content-center">
          <div className="modal-profile">
            <i className="nc-icon nc-single-copy-04"></i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Referencias</p>
        </Modal.Body>
        <div className="modal-footer">
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col className="pr-1" md="10">
                    <Form.Group>
                      <label>PUBLICACION</label>
                      <Form.Control
                        id="tituloText"
                        defaultValue={publicacionSeleccionada.titulo_publicacion + " (" + publicacionSeleccionada.autor + "," + publicacionSeleccionada.anio_publicacion + ")"}
                        cols="80"
                        rows="2"
                        as="textarea"
                        disabled
                      ></Form.Control>
                      <a href={publicacionSeleccionada.enlace} target="_blank"><i className="fas fa-external-link-alt"></i>Abrir</a>
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
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered" id="dataTableReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>REFERENCIA</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referencias.map(item => (
                      <tr className="small" key={item.id_referencia}>
                        <td>{item.referencia}</td>
                        <td width="5%"><Link to="#" id="eliminarReferencia" className="link col-sm-12 col-md-3" onClick={() => handleEliminarReferencia(item.id_referencia)}><i className="fas fa-trash-alt fa-2x"></i></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
          <Button
            id="regresar"
            className="btn active"
            type="button"
            variant="secondary"
            onClick={() => closeModalExtraccionReferencias()}
          >
            Regresar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Referencias;
