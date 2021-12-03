import React from "react";
import { tablaPaginacionService } from '../utils/tablaPaginacion.service';
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { validacionInputService } from '../_services/validacionInput.service';
import { medioPublicacionService } from '../_services/medio_publicacion.service';
import { leyBradfordService } from '../_services/ley_bradford.service';
import { Link } from "react-router-dom";
import logo from '../images/formula.PNG';
import { parametroService } from "_services/parametro.service";

// react plugin for creating notifications over the dashboard
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
  Modal
} from "react-bootstrap";
function LeyBradford() {
  const notificationAlertRef = React.useRef(null);
  const [areasFracati, setAreasFrascati] = React.useState([]);
  const [areasUnesco, setAreasUnesco] = React.useState([]);
  const [datosLeyBradford, setDatosLeyBradford] = React.useState([]);

  const [pesos, setPesos] = React.useState({
    pesoPublicacion: 0,
    pesoCitacion: 0,
    pesoBusqueda: 0,
    pesoSJR: 0,
    pesoIndexado: 0
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

  /**Spinner */
  let [loading, setLoading] = React.useState(false);

  /**Cargar Parámetros */
  async function handleListaParametro() {
    setLoading(true);
    await parametroService.listaParametro().then(value => {
      setPesos({
        ...pesos,
        pesoPublicacion: parseFloat(value.parametro[0].valor),
        pesoCitacion: parseFloat(value.parametro[1].valor),
        pesoBusqueda: parseFloat(value.parametro[2].valor),
        pesoSJR: parseFloat(value.parametro[3].valor),
        pesoIndexado: parseFloat(value.parametro[4].valor)
      })
      setLoading(false);
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
  async function handleCargarDatosLeyBradford() {
    //handleListarResumenMediosPublicacion();

    // Cargando numero de busquedas de las estadisticas de los proveedores
    await medioPublicacionService.actualizarMediosPublicacionBusqueda().then(value => {
      console.log("Cargando datos de las estadisticas de los proveedores");
      console.log(value);
    });

    //console.log("Cargar Datos Ley de Bradford..!!");
    //setDatosLeyBradford([]);
    let idAnioDesde = parseInt(document.getElementById("idAnioDesde").value);
    let idAnioHasta = parseInt(document.getElementById("idAnioHasta").value);
    let idAreaUnesco = parseInt(document.getElementById("idAreaUnesco").value);
    let idAreaFrascati = parseInt(document.getElementById("idAreaFrascati").value);

    if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacion().then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacion().then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });

    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAnio(idAnioDesde, idAnioHasta).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAnio(idAnioDesde, idAnioHasta).then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });

    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascati(idAreaFrascati).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascati(idAreaFrascati).then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });
    }
    else if (idAnioDesde == 0 && idAnioHasta == 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnesco(idAreaUnesco).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnesco(idAreaUnesco).then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati != 0 && idAreaUnesco == 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaFrascatiPorAnio(idAnioDesde, idAnioHasta, idAreaFrascati).then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });
    }
    else if (idAnioDesde != 0 && idAnioHasta != 0 && idAreaFrascati == 0 && idAreaUnesco != 0) {
      setLoading(true)
      await medioPublicacionService.actualizarMediosPublicacionCitacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async (value) => {
        console.log(value);
        await medioPublicacionService.actualizarMediosPublicacionPublicacionPorAreaUnescoPorAnio(idAnioDesde, idAnioHasta, idAreaUnesco).then(async (value) => {
          await leyBradfordService.coincidenciaRevistas().then(async(value) => {
            await handleListarResumenMediosPublicacion();
            setLoading(false);
          });
        });
      });
    }
    else if (idAreaUnesco != 0 && idAreaFrascati != 0) {
      notify("tr", 'Solo puede seleccionar un filtro de área (Frascati o Unesco).', "danger");
    }
    //await handleListarDatosLeyBradford();
  }
  async function handleListarDatosLeyBradford() {
    await tablaPaginacionService.destruirTabla('#dataTableLeyBradford');
    await leyBradfordService.listar().then(value => {
      if (value.respuesta.error == "False") {
        //notify("tr", value.respuesta.valor, "primary");
        setDatosLeyBradford(value.datos);
      } else {
        notify("tr", value.respuesta.valor, "danger");
      }
    })
    await tablaPaginacionService.paginacion('#dataTableLeyBradford');
  }

  async function handleListarResumenMediosPublicacion() {
    setLoading(true);
    await tablaPaginacionService.destruirTabla('#dataTableLeyBradford');
    await medioPublicacionService.listarMediosPublicacionResumen().then(value => {
      if (value.respuesta.error == "False") {
        setLoading(false);
        //notify("tr", value.respuesta.valor, "primary");
        var datosMediosPublicacion = value.datos;
        var datosMediosPublicacionConteo = [];
        for (var i = 0; i < datosMediosPublicacion.length; i++) {
          var idResumen = datosMediosPublicacion[i].idResumen;
          var indexado = parseInt(datosMediosPublicacion[i].indexado);
          var datosPublicacion = datosMediosPublicacion[i].publicacion;
          var datosCitacion = datosMediosPublicacion[i].citacion;
          var datosBusqueda = datosMediosPublicacion[i].busqueda;
          var datosSJR = datosMediosPublicacion[i].sjr;

          var numeroPublicaciones = 0;
          var numeroCitas = 0;
          var numeroBusquedas = 0;
          var numeroSjr = 0;

          for (var j = 0; j < datosPublicacion.length; j++) {
            numeroPublicaciones = numeroPublicaciones + datosPublicacion[j].numero_publicaciones;
          }

          for (var x = 0; x < datosCitacion.length; x++) {
            numeroCitas = numeroCitas + datosCitacion[x].numero_citas;
          }

          for (var y = 0; y < datosBusqueda.length; y++) {
            numeroBusquedas = numeroBusquedas + datosBusqueda[y].numero_busquedas;
          }

          for (var z = 0; z < datosSJR.length; z++) {
            numeroSjr = numeroSjr + datosSJR[z].sjr;
          }

          var dato = {
            busqueda: datosMediosPublicacion[i].busqueda,
            citacion: datosMediosPublicacion[i].citacion,
            idResumen: idResumen,
            indexado: indexado,
            publicacion: datosMediosPublicacion[i].publicacion,
            sjr: datosMediosPublicacion[i].sjr,
            totalPublicaciones: numeroPublicaciones,
            totalCitas: numeroCitas,
            totalBusquedas: numeroBusquedas,
            totalSjr: numeroSjr,
            total: parseFloat((parseFloat(numeroPublicaciones * pesos.pesoPublicacion) + parseFloat(numeroCitas * pesos.pesoCitacion) + parseFloat(numeroBusquedas * pesos.pesoBusqueda) + parseFloat(numeroSjr * pesos.pesoSJR) + parseFloat(indexado * pesos.pesoIndexado)).toFixed(2))
          }
          datosMediosPublicacionConteo.push(dato);
        }
        datosMediosPublicacionConteo.sort((a, b) => (a.total < b.total ? 1 : a.total > b.total ? -1 : 0))
        handleCalcularPrcentajesLeyBradford(datosMediosPublicacionConteo);
      } else {
        setLoading(false);
        notify("tr", value.respuesta.valor, "danger");
      }

    })
    await tablaPaginacionService.paginacion('#dataTableLeyBradford');
  }

  async function handleCalcularPrcentajesLeyBradford(datos) {
    let datosYPorcentajes = [];
    let suma = 0;
    let totalCalculado = 0;
    for (var i = 0; i < datos.length; i++) {
      totalCalculado = totalCalculado + datos[i].total;
    }

    for (var i = 0; i < datos.length; i++) {
      suma = suma + datos[i].total;
      let datoFinal={
        busqueda: datos[i].busqueda,
        citacion: datos[i].citacion,
        idResumen: datos[i].idResumen,
        indexado: datos[i].indexado,
        publicacion: datos[i].publicacion,
        sjr: datos[i].sjr,
        totalPublicaciones: datos[i].totalPublicaciones,
        totalCitas: datos[i].totalCitas,
        totalBusquedas: datos[i].totalBusquedas,
        totalSjr: datos[i].totalSjr,
        total: datos[i].total,
        numeroAcumulado: suma.toFixed(2),
        procentajeAcumulado: (suma / totalCalculado * 100).toFixed(2)
      }
      datosYPorcentajes.push(datoFinal);
    }
    setDatosLeyBradford(datosYPorcentajes);
  }

  React.useEffect(() => {
    handleAreasUnesco();
    handleAreasFrascati();
    handleListaParametro();

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
                <Card.Title as="h4"><img src={logo} alt="logo" /></Card.Title>
                <p className="card-category">
                  Medios de Publicación núcleo de cada Área
                </p>
                <Row>
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO DESDE</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioDesde">
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
                  <Col className="pr-1" md="1">
                    <Form.Group>
                      <label>AÑO HASTA</label>
                      <Form.Row>
                        <select className="form-control" id="idAnioHasta">
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
                  <Col className="pr-1" md="4">
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
                  <Col className="pr-1" md="4">
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
                <table className="table table-bordered table-hover" id="dataTableLeyBradford" width="100%" cellSpacing="0">
                  <thead className="thead-dark">
                    <tr>
                      <th>PUBLICACIÓN</th>
                      <th>CITACIÓN</th>
                      <th>BÚSQUEDA</th>
                      <th>SJR</th>
                      <th>INDEXADO</th>
                      <th>TOTAL</th>
                      <th>TOTAL ACUMULADO</th>
                      <th>PORCENTAJE ACUMULADO %</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {datosLeyBradford.map((item, index, elements) => (
                      <tr className="small" key={item.idResumen}>
                        <td>
                          <table>
                            {item.publicacion.map((itemPublicacion, index, elements) => (
                              <tr>
                                <td>{itemPublicacion.nombre}</td>
                                <td>{itemPublicacion.numero_publicaciones}</td>
                              </tr>

                            ))}
                            <tr> <td>{'P1(' + pesos.pesoPublicacion + ')*P(' + item.totalPublicaciones + ')'}</td></tr>
                          </table>
                        </td>
                        <td>
                          <table>
                            {item.citacion.map((itemCitacion, index, elements) => (
                              <tr>
                                <td>{itemCitacion.nombre}</td>
                                <td>{itemCitacion.numero_citas}</td>
                              </tr>
                            ))}
                            <tr><td>{'P2(' + pesos.pesoCitacion + ')*C(' + item.totalCitas + ')'}</td></tr>
                          </table>
                        </td>
                        <td>
                          <table>
                            {item.busqueda.map((itemBusqueda, index, elements) => (
                              <tr>
                                <td>{itemBusqueda.nombre}</td>
                                <td>{itemBusqueda.numero_busquedas}</td>
                              </tr>
                            ))}
                            <tr><td>{'P3(' + pesos.pesoBusqueda + ')*B(' + item.totalBusquedas + ')'}</td></tr>
                          </table>
                        </td>
                        <td>
                          <table>
                            {item.sjr.map((itemSJR, index, elements) => (
                              <tr>
                                <td>{itemSJR.titulo}</td>
                                <td>{itemSJR.sjr}</td>
                              </tr>
                            ))}
                            <tr><td>{'P4(' + pesos.pesoSJR + ')*SJR(' + item.totalSjr + ')'}</td></tr>
                          </table>
                        </td>
                        <td>{'P5(' + pesos.pesoIndexado + ')*I(' + item.indexado + ')'}</td>
                        <td>{item.total}</td>
                        <td>{item.numeroAcumulado}</td>
                        <td>{item.procentajeAcumulado+' %'}</td>
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

export default LeyBradford;
