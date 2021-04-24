import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Publicaciones from "views/Publicaciones";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/nuevoingreso",
    name: "Nuevo Ingreso",
    icon: "nc-icon nc-cloud-upload-94",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/publicaciones",
    name: "Publicaciones",
    icon: "nc-icon nc-single-copy-04",
    component: Publicaciones,
    layout: "/admin",
  },
  {
    path: "/revistas",
    name: "Revistas",
    icon: "nc-icon nc-paper-2",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/estadisticasProveedores",
    name: "Est. Proveedores",
    icon: "nc-icon nc-notes",
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/analisis",
    name: "Ejecutar Análisis",
    icon: "nc-icon nc-button-play",
    component: UserProfile,
    layout: "/admin",
  },
  /*
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  /*
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },*/
];

export default dashboardRoutes;
