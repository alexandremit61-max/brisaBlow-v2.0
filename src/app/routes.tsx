import { createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
// ═══════════════════════════════════════════════════════════════════════════
// APRESENTAÇÃO: Imports de páginas comentadas temporariamente
// Descomentar quando liberar funcionalidades completas
// ═══════════════════════════════════════════════════════════════════════════
// import Painel from "./pages/Painel";
// import Metro from "./pages/Metro";
// import Dwdm from "./pages/Dwdm";
// import Sites5G from "./pages/Sites5G";
// import Alarmes from "./pages/Alarmes";
// import Analise from "./pages/Analise";
import Configuracoes from "./pages/Configuracoes";
import BlowIA from "./pages/BlowIA";
import Perfil from "./pages/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      // ═══════════════════════════════════════════════════════════════════════════
      // APRESENTAÇÃO: Redirect para Blow IA como página inicial
      // Descomentar rotas abaixo quando liberar funcionalidades completas
      // ═══════════════════════════════════════════════════════════════════════════
      { index: true, element: <Navigate to="/dashboard/blow-ia" replace /> },
      // { index: true, element: <Painel /> },
      // { path: "metro", element: <Metro /> },
      // { path: "dwdm", element: <Dwdm /> },
      // { path: "sites-5g", element: <Sites5G /> },
      // { path: "alarmes", element: <Alarmes /> },
      // { path: "analise", element: <Analise /> },
      { path: "configuracoes", element: <Configuracoes /> },
      { path: "blow-ia", element: <BlowIA /> },
      { path: "perfil", element: <Perfil /> },
    ],
  },
]);
