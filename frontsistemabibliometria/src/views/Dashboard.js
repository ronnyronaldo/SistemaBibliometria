import React from "react";
import ChartistGraph from "react-chartist";
import { publicacionService } from '../_services/publicacion.service';
import { referenciaService } from '../_services/referencia.service';
import { leyBradfordService } from '../_services/ley_bradford.service';
import { detalleReferenciaService } from '../_services/detalle_referencia.service';
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { medioPublicacionService } from '../_services/medio_publicacion.service';
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
  const [grafo, setGrafo] = React.useState([]);
  const [datosLeyBradford, setDatosLeyBradford] = React.useState([]);
  const handleCargarTotalesArticulosReferencias = () => {
    setLoading(true)
    publicacionService.numeroArticulosIngresados().then(value => {
      setNumeroPublicaciones(value.totalArticulos);
      setLoading(false)
    })

    setLoading(true)
    publicacionService.numeroArticulosNoTienenReferencias().then(value => {
      setNumeroPublicacionesSinReferencias(value.numeroArticulosNoTienenReferencias);
      setLoading(false)
    })

    setLoading(true)
    referenciaService.numeroReferencias().then(value => {
      setNumeroReferencias(value.numeroReferenciasIngresadas);
      setLoading(false)
    })

    setLoading(true)
    detalleReferenciaService.numeroDetalleReferencia().then(value => {
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
    await clusteringService.ejecutarclusteringRedesAutoresAreasOrden(orden_autor, idAreaUnesco).then(value => {
      setRedesAreasOrden(value.valorimagenarea);
      setLoading(false)
    });

  }

  async function handleCalcularPrcentajesLeyBradford(datos) {
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCitas = 0;
    for (var i = 0; i < datos.length; i++) {
      totalCitas = totalCitas + datos[i].contador;
    }

    for (var i = 0; i < datos.length; i++) {
      suma = suma + datos[i].contador;
      let dato = {
        "id_referencia": datos[i].id_referencia,
        "venue": datos[i].venue,
        "contador": datos[i].contador,
        "numeroAcumuladoCitas": suma,
        "procentajeAcumuladoCitas": (suma / totalCitas * 100).toFixed(2)
      }
      datosYPorcentajes.push(dato);
    }
    //console.log(datosYPorcentajes)
    await setDatosLeyBradford(datosYPorcentajes);
    return datosYPorcentajes;
  }

  async function handleCalcularPrcentajesLeyBradfordInternas(datos) {
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCitas = 0;
    for (var i = 0; i < datos.length; i++) {
      totalCitas = totalCitas + datos[i].contador;
    }

    for (var i = 0; i < datos.length; i++) {
      suma = suma + datos[i].contador;
      let dato = {
        "id_referencia": datos[i].id_articulo,
        "venue": datos[i].medioPublicacion,
        "contador": datos[i].contador,
        "numeroAcumuladoCitas": suma,
        "procentajeAcumuladoCitas": (suma / totalCitas * 100).toFixed(2)
      }
      datosYPorcentajes.push(dato);
    }
    //console.log(datosYPorcentajes)
    await setDatosLeyBradford(datosYPorcentajes);
    return datosYPorcentajes;
  }


  async function handleCargarDatosLeyBradford() {
    setDatosLeyBradford([]);
    let idAnioDesde = parseInt(document.getElementById("idAnioDesde").value);
    let idAnioHasta = parseInt(document.getElementById("idAnioHasta").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);
    let idPublicacionCorrespondiente = document.getElementById("idPublicacionCorrespondiente").value;

  
    if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacion().then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacion().then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAnio(idAnioDesde, idAnioHasta).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAnio(idAnioDesde, idAnioHasta).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascati(idAreaFrascati).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascati(idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnesco(idAreaUnesco).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnesco(idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async(value) => { 
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(value => {
          console.log(value);
          setLoading(false);
        });
      });
    }
    else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
      notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
    }
  }

  React.useEffect(() => {
    handleCargarTotalesArticulosReferencias();
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
                      <Card.Title as="h4">{numeroPublicacionesSinReferencias + " (" + parseFloat(numeroPublicacionesSinReferencias * 100 / numeroPublicaciones).toFixed(2) + "%)"}</Card.Title>
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
                      <Card.Title as="h4">{numeroDetalleReferencias + "  (" + parseFloat(numeroDetalleReferencias * 100 / numeroReferencias).toFixed(2) + "%)"}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
