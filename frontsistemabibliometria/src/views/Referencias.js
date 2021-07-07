import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { publicacionService } from '../_services/publicacion.service';
import { Link } from "react-router-dom";
import { referenciaService } from '../_services/referencia.service';
import NotificationAlert from "react-notification-alert";
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
function Referencias() {
  /**Variables y funciones para mostrar alertas al usuario */
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);
  const [datoReferencia, setDatoReferencia] = React.useState({
    idArticulo: 0,
    referencia: ""
  });
 
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
  const [referencias, setReferencias] = React.useState([]);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = React.useState({
    id_articulo :  0,
    titulo : "",
    autor :  "",
    anio_publicacion : 0
  });

  const [referenciaSeleccionada, setReferenciaSeleccionada] = React.useState({
    id_referencia : 0,
    referencia: ""
  });
  
  const [tipoBusquedaReferencias, setTipoBusquedaReferencias] = React.useState({
    ingresoTotal: false,
    ingresoIndividual: true
  });

  async function handleCargarReferencias(id_articulo, titulo, autor, anio_publicacion) {
    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      id_articulo : id_articulo,
      titulo : titulo,
      autor :  autor,
      anio_publicacion : anio_publicacion
    })

    await tablaPaginacionService.destruirTabla('#dataTableReferenciasNoEncontradas');
    await referenciaService.listarReferenciasNoEcontradasPorIdArticulo(id_articulo).then(value => {
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferenciasNoEncontradas');
  }

  async function handleCargarDatosPublicaciones() {
    await tablaPaginacionService.destruirTabla('#dataTablePublicacionesSeccionReferencias');
    await publicacionService.listar().then(value => {
      setPublicaciones(value.articulos);
    });
    await tablaPaginacionService.paginacion('#dataTablePublicacionesSeccionReferencias');
  }

  async function handleCargarReferenciaBuscar(id_referencia, referencia) {
    setReferenciaSeleccionada({
      ...referenciaSeleccionada,
      id_referencia : id_referencia,
      referencia : referencia
    })
  }

  const handleOnChangeIngresoIndividual = (event) => {
    setTipoBusquedaReferencias({
      ...tipoBusquedaReferencias,
      ingresoIndividual: true,
      ingresoTotal: false
    })
  }

  const handleOnChangeIngresoTotal = (event) => {
    setTipoBusquedaReferencias({
      ...tipoBusquedaReferencias,
      ingresoIndividual: false,
      ingresoTotal: true
    })
  }

  async function handleBuscar() {
    if(tipoBusquedaReferencias.ingresoTotal == true){
      for (var i = 0; i<referencias.length; i++){
        referenciaService.buscarDetalleReferenciaIndividual({
          "id_referencia": referencias[i].id_referencia,
          "referencia": referencias[i].referencia
        }).then(value => {
          if(value.respuesta.error == "False"){
            notify("tr", value.respuesta.valor, "primary");
          }else{
            notify("tr", value.respuesta.valor, "danger");
          }
        })
      }
    }
    if(tipoBusquedaReferencias.ingresoIndividual == true){
      if(referenciaSeleccionada.id_referencia != 0){
        referenciaService.buscarDetalleReferenciaIndividual({
          "id_referencia": referenciaSeleccionada.id_referencia,
          "referencia": referenciaSeleccionada.referencia
        }).then(value => {
          if(value.respuesta.error == "False"){
            handleCargarReferencias(publicacionSeleccionada.id_articulo, publicacionSeleccionada.titulo, publicacionSeleccionada.autor, publicacionSeleccionada.anio_publicacion);
            notify("tr", value.respuesta.valor, "primary");
          }else{
            notify("tr", value.respuesta.valor, "danger");
          }
        })
      }else{
        notify("tr", 'No ha seleccionado ninguna referencia.', "danger");
      }
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
              <Card.Title as="h4">Publicaciones</Card.Title>
              <p className="card-category">
                Investigadores con filiación a la Universidad de Cuenca
              </p>
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
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map(item => (
                    <tr className="small" key={item.id_articulo} onClick={() => handleCargarReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion)}>
                      <td width="15%">{item.nombres}</td>
                      <td width="20%">{item.titulo}</td>
                      <td width="5%">{item.anio_publicacion}</td>
                      <td width="7%">{item.tipo_publicacion}</td>
                      <td width="20%">{item.nombre}</td>
                      <td width="5%">{item.descripcion_unesco}</td>
                      <td width="5%">{item.descripcion}</td>
                      <td width="5%">{item.nombre_base_datos_digital}</td>
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
              <Card.Title as="h4">Referencias Pendiente Obtención Detalle</Card.Title>
              <p className="card-category">
                {publicacionSeleccionada.titulo}
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-3">
              <table className="table table-bordered" id="dataTableReferenciasNoEncontradas" width="100%" cellSpacing="0">
                <thead className="thead-dark">
                  <tr>
                    <th>ID REFERENCIA</th>
                    <th>REFERENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {referencias.map(item => (
                    <tr className="small" key={item.id_referencia} onClick={() => handleCargarReferenciaBuscar(item.id_referencia, item.referencia)}>
                      <td width="10%">{item.id_referencia}</td>
                      <td>{item.referencia}</td>
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
                <Card.Title as="h4">Búsqueda del detalle de las referencias</Card.Title>
                <Row>
                  <Col className="pr-1" md="10">
                    <Form.Group>
                      <label>REFERENCIA</label>
                      <Form.Control
                        defaultValue={referenciaSeleccionada.referencia}
                        cols="80"
                        rows="4"
                        as="textarea"
                        disabled
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="1">
                    <Form.Group>
                      <label>INDIVIDUAL</label>
                      <Form.Control
                        id="busquedaIndividual"
                        type="radio"
                        checked={tipoBusquedaReferencias.ingresoIndividual}
                        onChange={handleOnChangeIngresoIndividual}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="1">
                    <Form.Group>
                      <label>TODO</label>
                      <Form.Control
                        id="busquedaTotal"
                        type="radio"
                        checked={tipoBusquedaReferencias.ingresoTotal}
                        onChange={handleOnChangeIngresoTotal}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        defaultValue="BUSCAR"
                        type="button"
                        className="btn-outline-success"
                        onClick={handleBuscar}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Referencias;
