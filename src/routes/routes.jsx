import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Layout from "../layouts/Layout.jsx";
import Landing from "../pages/Landing.jsx";
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
import SalePanel from "../pages/SalePanel.jsx";
import Drugs from "../pages/Drugs.jsx";
import SaleRecords from "../pages/SaleRecords.jsx";
import Purchases from "../pages/Purchases.jsx";
import Staff from "../pages/Staff.jsx";
import Auth from "../pages/Auth.jsx";
import Login from "../components/auth/Login.jsx";
import SignUp from "../components/auth/SignUp.jsx";
import Recovery from "../components/auth/Recovery.jsx";
import Reset from "../components/auth/Reset.jsx";
import OTP from "../components/auth/OTP.jsx";
import BrandTbl from "../components/tabularViews/BrandTbl.jsx";
import DrugTbl from "../components/tabularViews/DrugTbl.jsx";
import FormulationTbl from "../components/tabularViews/FormulationTbl.jsx";
import GroupTbl from "../components/tabularViews/GroupTbl.jsx";
import GenericTbl from "../components/tabularViews/GenericTbl.jsx";
import UnitTbl from "../components/tabularViews/UnitTbl.jsx";
import MFRTbl from "../components/tabularViews/MFRTbl.jsx";
import StaffTbl from "../components/tabularViews/StaffTbl.jsx";
import AttendanceTbl from "../components/tabularViews/AttendanceTbl.jsx";
import SalaryTbl from "../components/tabularViews/SalaryTbl.jsx";
import About from "../pages/About.jsx";
import Profile from "../pages/Profile.jsx";
import { ENTITIES } from "../ui-config/entities.js";
import leftNav from "../ui-config/left-nav.js"
import Unauthorized from "../pages/Unauthorized.jsx";

// 
const drugsRoutes = [
  { path: "stock", component: <DrugTbl /> },
  { path: "brands", component: <BrandTbl /> },
  { path: "formulations", component: <FormulationTbl /> },
  { path: "groups", component: <GroupTbl /> },
  { path: "generics", component: <GenericTbl /> },
  { path: "units", component: <UnitTbl /> },
  { path: "manufacturers", component: <MFRTbl /> },
];

const staffRoutes = [
  { path: "members", component: <StaffTbl /> },
  { path: "salaries", component: <SalaryTbl /> },
  { path: "attendances", component: <AttendanceTbl /> },
];

const generateProtectedRoutes = (routes, entityType) => {
  return routes.map(({ path, component }) => {

    const { access, isAccessControlled } = leftNav[entityType].options[path];
    // alert("access:" + access, isAccessControlled)
    return {
      path,
      element: (
        <ProtectedRoute access={access} isAccessControlled={isAccessControlled}>
          {component}
        </ProtectedRoute>
      ),
    };
  });
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "unauthorized",
        element: <Unauthorized />,

      },
      {
        path: "",
        element: <Landing />,
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute  >
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          { path: "sale-panel", element: <SalePanel /> },
          {
            path: "drugs",
            element: <Drugs />,
            children: generateProtectedRoutes(drugsRoutes, ENTITIES.drug),
          },
          { path: "sales", element: <SaleRecords /> },
          { path: "purchases", element: <Purchases /> },
          {
            path: "staff",
            element: <Staff />,
            children: generateProtectedRoutes(staffRoutes, ENTITIES.staff),
          },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
        children: [
          { path: "login", element: <Login /> },
          { path: "profile", element: <Profile /> },
          { path: "register", element: <SignUp /> },
          { path: "account-recovery", element: <Recovery /> },
          { path: "reset-password", element: <Reset /> },
          { path: "verify-otp", element: <OTP /> },
        ],
      },
      { path: "about", element: <About /> },
    ],
  },
]);
