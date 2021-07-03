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
import { baseDatosDigitalService } from "_services/baseDatosDigital.service";
import { areaFrascatiService } from "_services/areaFrascati.service";
import { areaUnescoService } from "_services/areaUnesco.service";
import { medioPublicacionService } from "_services/medio_publicacion.service";
function Publicaciones() {
  /**Variables y funciones para mostrar alertas al usuario */
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);

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
  const [tipoIngresoReferencias, setTipoIngresoReferencias] = React.useState({
    ingresoManual: true,
    ingresoAutomatico: false
  });

  const [publicacionSeleccionada, setPublicacionSeleccionada] = React.useState({
    titulo_publicacion:"",
    autor:"",
    anio_publicacion:""
  });
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

  async function handleCargarReferencias(id_articulo, titulo, autor, anio_publicacion) {
    setPublicacionSeleccionada({
      ...publicacionSeleccionada,
      titulo_publicacion: titulo,
      autor: autor,
      anio_publicacion:anio_publicacion
    })

    await tablaPaginacionService.destruirTabla('#dataTableReferencias');
    await referenciaService.listarReferenciasPorIdArticulo(id_articulo).then(value => {
      setReferencias(value.referencias);
    });
    await tablaPaginacionService.paginacion('#dataTableReferencias');
  }

  const handleOnChangeIngresoManual = (event) => {
    setTipoIngresoReferencias({
      ...tipoIngresoReferencias,
      ingresoManual : true,
      ingresoAutomatico: false
    })
  }

  const handleOnChangeIngresoAutomatico = (event) => {
    setTipoIngresoReferencias({
      ...tipoIngresoReferencias,
      ingresoManual : false,
      ingresoAutomatico: true
    })
  }

  async function handleIngresarPublicaciones() {
    if(nuevasPublicaciones.length != 0){
      for(var i = 0; i<nuevasPublicaciones.length; i++){
        let nuevoIngreso = nuevasPublicaciones[i];
        baseDatosDigitalService.validarBaseDatosDigitalPorNombre(nuevoIngreso.nombre).then(value=>{
          if (value.base_datos_digital.length !== 0){
            let id_base_datos_digital = value.base_datos_digital[0].id_base_datos_digital;
            //console.log(id_base_datos_digital)
            areaFrascatiService.validarAreaFrascatiPorNombre(nuevoIngreso.nombre_area_frascati_especifico).then(value => {
              if(value.area_frascati.length !== 0){
                let id_area_frascati = value.area_frascati[0].id_area_frascati;
                //console.log(id_area_frascati)
                areaUnescoService.validarAreaUnescoPorNombre(nuevoIngreso.nombre_area_unesco_especifico).then(value => {
                  if(value.area_unesco.length !== 0){
                    let id_area_unesco = value.area_unesco[0].id_area_unesco;
                   // console.log(id_area_unesco)
                    medioPublicacionService.validarMedioPublicacionPorNombre(nuevoIngreso.nombre_medio_publicacion).then(value => {
                      if(value.mediosPublicacion.length !== 0){
                        let id_medio_publicacion = value.mediosPublicacion[0].id_medio_publicacion;
                        //console.log(id_medio_publicacion)
                        publicacionService.insertar({
                          "id_base_datos_digital": id_base_datos_digital,
                          "id_area_unesco" : id_area_unesco,
                          "id_area_frascati" : id_area_frascati,
                          "id_medio_publicacion" : id_medio_publicacion,
                          "url_dspace" : nuevoIngreso.url_dspace  != undefined ? nuevoIngreso.url_dspace  : "",
                          "titulo" : nuevoIngreso.titulo  != undefined ? nuevoIngreso.titulo : "",
                          "titulo_alternativo": nuevoIngreso.titulo_alternativo != undefined ? nuevoIngreso.titulo_alternativo : "",
                          "palabras_clave": nuevoIngreso.palabras_clave  != undefined ? nuevoIngreso.palabras_clave : "",
                          "abstract" : nuevoIngreso.abstract  != undefined ? nuevoIngreso.abstract  : "",
                          "resumen" : nuevoIngreso.resumen  != undefined ? nuevoIngreso.resumen : "",
                          "nombre_area_frascati_amplio": nuevoIngreso.nombre_area_frascati_amplio  != undefined ? nuevoIngreso.nombre_area_frascati_amplio : "",
                          "nombre_area_unesco_amplio" : nuevoIngreso.nombre_area_unesco_amplio  != undefined ? nuevoIngreso.nombre_area_unesco_amplio : "",
                          "tipo_publicacion" : nuevoIngreso.tipo_publicacion  != undefined ? nuevoIngreso.tipo_publicacion : "",
                          "anio_publicacion" : nuevoIngreso.anio_publicacion  != undefined ? nuevoIngreso.anio_publicacion : "",
                          "link_revista" : nuevoIngreso.link_revista  != undefined ? nuevoIngreso.link_revista : "",
                          "doi": nuevoIngreso.doi  != undefined ? nuevoIngreso.doi : "",
                          "estado_publicacion": nuevoIngreso.estado_publicacion  != undefined ? nuevoIngreso.estado_publicacion  : "",
                          "enlace_documento" : nuevoIngreso.enlace_documento  != undefined ? nuevoIngreso.enlace_documento : "",
                          "factor_impacto" : nuevoIngreso.factor_impacto  != undefined ? nuevoIngreso.factor_impacto  : "",
                          "cuartil" : nuevoIngreso.cuartil  != undefined ? nuevoIngreso.cuartil : "",
                          "autor_identificación" : nuevoIngreso.autor_identificación  != undefined ? nuevoIngreso.autor_identificación : "",
                          "orden_autor" : nuevoIngreso.orden_autor  != undefined ? nuevoIngreso.orden_autor : "",
                          "nombres" : nuevoIngreso.nombres  != undefined ? nuevoIngreso.nombres : "",
                          "nombre_afiliacion" : nuevoIngreso.nombre_afiliacion  != undefined ? nuevoIngreso.nombre_afiliacion  : "",
                          "nombre_medio_publicacion" : nuevoIngreso.nombre_medio_publicacion  != undefined ? nuevoIngreso.nombre_medio_publicacion : "",
                          "nombre_area_frascati_especifico": nuevoIngreso.nombre_area_frascati_especifico  != undefined ? nuevoIngreso.nombre_area_frascati_especifico  : "",
                          "nombre_area_unesco_especifico":nuevoIngreso.nombre_area_unesco_especifico  != undefined ? nuevoIngreso.nombre_area_unesco_especifico  : "" 
                        }).then(value =>{
                          if(value.respuesta.error == "False"){
                            notify("tr", value.respuesta.valor +': '+nuevoIngreso.titulo+'('+nuevoIngreso.anio_publicacion+')', "primary");
                            handleCargarDatosPublicaciones();
                          }else{
                            notify("tr", value.respuesta.valor +': '+nuevoIngreso.titulo+'('+nuevoIngreso.anio_publicacion+')', "danger");
                          }
                        })
                      }else{
                        notify("tr", nuevoIngreso.nombre_medio_publicacion +' : no esta disponible dentro de los Medios de Publicacion. En caso de ser necesario registre esta medio de publicación.', "danger");
                      }
                    })
                  }else{
                    notify("tr", nuevoIngreso.nombre_area_unesco_especifico +': no esta disponible dentro de las Areas Unesco. En caso de ser necesario registre esta área.' , "danger");
                  }
                })
              }else{
                notify("tr", nuevoIngreso.nombre_area_frascati_especifico +': no esta disponible dentro de las Areas Frascati. En caso de ser necesario registre esta área.' , "danger");
              }
            })
          }else{
            notify("tr", 'El repositorio: '+ nuevoIngreso.nombre + ' no esta permitido en el actual análsis.', "danger");
          }
        })
      }
    }else{
      notify("tr", 'No ha ingresado el archivo o no existen datos para cargar.', "danger");
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
                          <Link to="#" id="ingresarPublicacion" className="link col-sm-12 col-md-3" onClick={handleIngresarPublicaciones}><Button variant="primary">Ingresar <i className="fas fa-file-upload fa-2x"/></Button></Link>
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
                      <tr className="small" key={item.id_articulo} onClick={() => handleCargarReferencias(item.id_articulo, item.titulo, item.nombres, item.anio_publicacion)}>
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
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Ingreso Referencias</Card.Title>
                <Row>
                  <Col className="pr-1" md="5">
                    <Form.Group>
                      <label>TITULO PUBLICACION</label>
                      <Form.Control
                        value={publicacionSeleccionada.titulo_publicacion}
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="2">
                    <Form.Group>
                      <label>AUTOR AFILIADO</label>
                      <Form.Control
                        value={publicacionSeleccionada.autor}
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="2">
                    <Form.Group>
                      <label>AÑO DE PUBLICACION</label>
                      <Form.Control
                        value={publicacionSeleccionada.anio_publicacion}
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
                        value=""
                        type="text"
                        disabled={tipoIngresoReferencias.ingresoAutomatico}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="3">
                    <Form.Group>
                      <label></label>
                      <Form.Control
                        value="AGREGAR"
                        type="button"
                        className="btn-outline-success"
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
                        ic
                        className="btn-outline-success"
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
