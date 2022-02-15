import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Publicaciones from "views/Publicaciones";
import PublicacionesV2 from "views/PublicacionesV2";
import MedioPublicacion from "views/MedioPublicacion";
import LeyBradford from "views/LeyBradford";
import BaseDatosDigital from "views/BaseDatosDigital";
import AnalisisDataMining from "views/AnalisisDataMining";
import Areas from "views/Areas";
import Autores from "views/Autores";
import Referencias from "views/Referencias";
import ReferenciasV2 from "views/ReferenciasV2";

import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";
import EstadisticasProveedores from "views/EstadisticasProveedores";
import Parametro from "views/Parametro";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },/*
  {
    path: "/nuevoingreso",
    name: "Nuevo Ingreso",
    icon: "nc-icon nc-cloud-upload-94",
    component: UserProfile,
    layout: "/admin",
  },*/
  {
    path: "/publicaciones",
    name: "Publicaciones",
    icon: "nc-icon nc-single-copy-04",
    component: PublicacionesV2,
    layout: "/admin",
  },
  {
    path: "/autores",
    name: "Autores",
    icon: "nc-icon nc-circle-09",
    component: Autores,
    layout: "/admin",
  },
  {
    path: "/referencias",
    name: "Referencias",
    icon: "nc-icon nc-bullet-list-67",
    component: ReferenciasV2,
    layout: "/admin",
  },
  {
    path: "/mediosPublicacion",
    name: "Medios Publicación",
    icon: "nc-icon nc-paper-2",
    component: MedioPublicacion,
    layout: "/admin",
  },
  {
    path: "/leyBradford",
    name: "Ley de Bradford",
    icon: "nc-icon nc-tap-01",
    component: LeyBradford,
    layout: "/admin",
  },
  {
    path: "/areas",
    name: "Áreas",
    icon: "nc-icon nc-layers-3",
    component: Areas,
    layout: "/admin",
  },
  {
    path: "/baseDatosDigital",
    name: "Base Datos Biblio.",
    icon: "nc-icon nc-grid-45",
    component: BaseDatosDigital,
    layout: "/admin",
  },
  {
    path: "/estadisticasProveedores",
    name: "Est. Proveedores",
    icon: "nc-icon nc-chart-bar-32",
    component: EstadisticasProveedores,
    layout: "/admin",
  },
  {
    path: "/analisis",
    name: "Análisis de Datos",
    icon: "nc-icon nc-button-play",
    component: AnalisisDataMining,
    layout: "/admin",
  },
  {
    path: "/Configuración",
    name: "Configuración",
    icon: "nc-icon nc-settings-gear-64",
    component: Parametro,
    layout: "/admin",
  },
  /*
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Icons,
    layout: "/admin",
  },
  /*{
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },*/
];

export default dashboardRoutes;
