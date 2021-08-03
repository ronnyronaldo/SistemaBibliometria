import React from "react";
import ChartistGraph from "react-chartist";
import { publicacionService } from '../_services/publicacion.service';
import { referenciaService } from '../_services/referencia.service';
import { leyBradfordService } from '../_services/ley_bradford.service';
import { detalleReferenciaService } from '../_services/detalle_referencia.service';
import { clusteringService } from '../_services/clustering.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Dashboard() {

  /**Spinner */
  let [loading, setLoading] = React.useState(false);
  /**Spinner */

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

  const [numeroPublicaciones, setNumeroPublicaciones] = React.useState(0);
  const [numeroPublicacionesSinReferencias, setNumeroPublicacionesSinReferencias] = React.useState(0);
  const [numeroReferencias, setNumeroReferencias] = React.useState(0);
  const [numeroDetalleReferencias, setNumeroDetalleReferencias] = React.useState(0);
  const [numeroOrdenAutor, setnumeroOrdenAutor] = React.useState("");
  const [redesAreas, setRedesAreas] = React.useState("");
  const [redesAreasOrden, setRedesAreasOrden] = React.useState("");
  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [datosLeyBradford, setDatosLeyBradford] = React.useState([]);
  const handleCargarTotalesArticulosReferencias = () => {
    setLoading(true)
    publicacionService.numeroArticulosIngresados().then(value =>{
      setNumeroPublicaciones(value.totalArticulos);
      setLoading(false)
    })

    setLoading(true)
    publicacionService.numeroArticulosNoTienenReferencias().then(value =>{
      setNumeroPublicacionesSinReferencias(value.numeroArticulosNoTienenReferencias);
      setLoading(false)
    })

    setLoading(true)
    referenciaService.numeroReferencias().then(value =>{
      setNumeroReferencias(value.numeroReferenciasIngresadas);
      setLoading(false)
    })

    setLoading(true)
    detalleReferenciaService.numeroDetalleReferencia().then(value =>{
      setNumeroDetalleReferencias(value.numeroDetalleReferenciaIngresadas);
      setLoading(false)
    })
  }

  async function handleCargarRedesDeAutores() {
    setLoading(true)
    let orden_autor = document.getElementById("idOrdenAutor").value;
    await clusteringService.ejecutarclusteringRedesAutores(orden_autor).then(value => {
      setnumeroOrdenAutor(value.valorimagen);
      setLoading(false)
    });
  }

  async function handleCargarRedesDeAutoresAreas() {
    setLoading(true)
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnescoGrafo").value);
    await clusteringService.ejecutarclusteringRedesAutoresAreas(idAreaUnesco).then(value => {
      setRedesAreas(value.valorimagenarea);
      setLoading(false)
    });
  }

  async function handleCargarRedesDeAutoresAreasOrden() {
    setLoading(true)
    let orden_autor = document.getElementById("idOrdenAutor").value;
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnescoGrafo").value);
    await clusteringService.ejecutarclusteringRedesAutoresAreasOrden(orden_autor,idAreaUnesco).then(value => {
      setRedesAreasOrden(value.valorimagenarea);
      setLoading(false)
    });
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
  async function handleCalcularPrcentajesLeyBradford(datos){
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCitas = 0;
    for(var i = 0; i< datos.length; i++){
      totalCitas = totalCitas + datos[i].contador;
    }

    for(var i = 0; i< datos.length; i++){
      suma = suma + datos[i].contador;
      let dato = {
        "id_referencia": datos[i].id_referencia,
        "venue": datos[i].venue,
        "contador": datos[i].contador,
        "numeroAcumuladoCitas": suma,
        "procentajeAcumuladoCitas": (suma/totalCitas*100).toFixed(2)
      }
      datosYPorcentajes.push(dato);
    }
    //console.log(datosYPorcentajes)
    await setDatosLeyBradford(datosYPorcentajes);
    return datosYPorcentajes;
  }

  async function handleCargarDatosLeyBradford(){
    setDatosLeyBradford([]);
    let idAnio = parseInt(document.getElementById("idAnio").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);
    if(idAnio == 0 && idAreaFrascati != 0 && idAreaUnesco == 0){
      setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaFrascati(idAreaFrascati).then(async(value) => {
        await handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })
    }
    else if(idAnio == 0 && idAreaFrascati == 0 && idAreaUnesco != 0){
      setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaUnesco(idAreaUnesco).then(async(value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })
    }
    else if(idAnio != 0 && idAreaFrascati != 0 && idAreaUnesco == 0){
      setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaFrascatiPorAnio(idAnio, idAreaFrascati).then(async(value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      }) 
    }
    else if(idAnio != 0 && idAreaFrascati == 0 && idAreaUnesco != 0){
      setLoading(true)
      await tablaPaginacionService.destruirTabla('#dataTableMediosPublicacionReferencias');
      await leyBradfordService.numeroMediosPublicacionPorAreaUnescoPorAnio(idAnio, idAreaUnesco).then(async(value) => {
        handleCalcularPrcentajesLeyBradford(value.numeroMediosPublicacion)
        await tablaPaginacionService.paginacion('#dataTableMediosPublicacionReferencias');
        setLoading(false)
      })
    }
    else if(idAreaUnesco != 0 && idAreaFrascati !=0){
      notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
    }
  }
  React.useEffect(() => {
    document.getElementById("idOrdenAutor").value=1;
    document.getElementById("idAreaUnescoGrafo").value=1;
    handleCargarTotalesArticulosReferencias();
    // handleCargarRedesDeAutores();
    handleAreasUnesco();
    handleAreasFrascati();
    // handleCargarRedesDeAutoresAreas();
    handleCargarRedesDeAutoresAreasOrden();
  }, []);
  return (
    <>
      <FadeLoader loading={loading} css={override} size={50} />
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-copy-04 text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL PUBLICACIONES</p>
                      <Card.Title as="h4">{numeroPublicaciones + "  (100%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-align-center text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL PUBLICACIONES SIN REFERENCIAS</p>
                      <Card.Title as="h4">{numeroPublicacionesSinReferencias +" (" + parseFloat(numeroPublicacionesSinReferencias * 100 / numeroPublicaciones).toFixed(2) +"%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bullet-list-67 text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL REFERENCIAS</p>
                      <Card.Title as="h4">{numeroReferencias + "  (100%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-notes text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">TOTAL DETALLE REFERENCIAS</p>
                      <Card.Title as="h4">{numeroDetalleReferencias +"  ("+ parseFloat(numeroDetalleReferencias*100/numeroReferencias).toFixed(2)+"%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Redes de Autores</Card.Title>
              </Card.Header>
              <Card.Body>
              <Row>
                <Col className="pr-1" md="4">
                  <Form.Group>
                    <label>Orden de Autores</label>
                    <Form.Row>
                      <select className="form-control" id="idOrdenAutor" onChange={handleCargarRedesDeAutoresAreasOrden}>
                        <option value="0">Seleccione</option>
                        <option value="1">Primer Autor</option>
                        <option value="2">Segundo Autor</option>
                        <option value="3">Tercer Autor</option>
                        <option value="4">Cuarto Autor</option>
                        <option value="5">Quinto Autor</option>
                        <option value="6">Sexto Autor</option>
                        <option value="7">Septimo Autor</option>
                        <option value="8">Octavo Autor</option>
                        <option value="9">Noveno Autor</option>
                        <option value="10">Decimo Autor</option>
                        <option value="11">Undecimo Autor</option>
                        <option value="12">Duodecimo Autor</option>
                        <option value="13">Decimo Tercero Autor</option>
                        <option value="19">Decimo Noveno Autor</option>
                      </select>
                    </Form.Row>
                  </Form.Group>
                </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label>Area Unesco</label>
                      <Form.Row>
                        <select className="form-control" id="idAreaUnescoGrafo" onChange={handleCargarRedesDeAutoresAreasOrden}>
                          <option value="0">Seleccione</option>
                          {areasUnesco.map(item => (
                            <option value={item.id_area_unesco} key={item.id_area_unesco}>{item.descripcion_unesco}</option>
                          ))}
                        </select>
                      </Form.Row>
                    </Form.Group>
                  </Col>
              </Row>
              <div>
                <img src={"data:image/png;base64,"+ redesAreasOrden} width="100%" height="100%" alt="Grafo Autores" />
              </div>
              {/* <div>
                <img src={"data:image/png;base64,"+ redesAreas} width="100%" height="100%" alt="Red dot" />
              </div> */}
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ley de Bradford</Card.Title>
                <p className="card-category">
                  Medios de Publicación núcleo de cada Área
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
                        onClick={handleCargarDatosLeyBradford}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-3">
                <table className="table table-bordered table-hover" id="dataTableMediosPublicacionReferencias" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>REVISTA</th>
                      <th>NUMERO CITAS</th>
                      <th>NUMERO ACUMULADO CITAS</th>
                      <th>% ACUMULADO DE CITAS</th>
                    </tr>
                  </thead>
                  <tbody>
                  {datosLeyBradford.map((item, index, elements) => (
                      <tr className="small" key={item.id_referencia}>
                        <td>{item.venue}</td>
                        <td>{item.contador}</td>
                        <td>{item.numeroAcumuladoCitas}</td>
                        <td>{item.procentajeAcumuladoCitas}</td>
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

export default Dashboard;
