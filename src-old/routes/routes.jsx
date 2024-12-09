import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "../pages/Profile.jsx";
import Landing from "../pages/Landing.jsx";
import Layout from "../layouts/Layout.jsx";
import OTP from "../components/auth/OTP.jsx";
import Reset from "../components/auth/Reset.jsx";
import Recovery from "../components/auth/Recovery.jsx";
import About from "../pages/About.jsx";
import Auth from "../pages/Auth.jsx";
import Login from "../components/auth/Login.jsx";
import Drugs from "../pages/Drugs.jsx";
import SaleRecords from "../pages/SaleRecords.jsx";
import Purchases from "../pages/Purchases.jsx";
import Staff from "../pages/Staff.jsx";
//
import BrandTbl from "../components/tabularViews/BrandTbl";
import DrugTbl from "../components/tabularViews/DrugTbl";
import FormulationTbl from "../components/tabularViews/FormulationTbl.jsx";
import GroupTbl from "../components/tabularViews/GroupTbl";
import GenericTbl from "../components/tabularViews/GenericTbl";
import UnitTbl from "../components/tabularViews/UnitTbl";
import MFRTbl from "../components/tabularViews/MFRTbl";
import StaffTbl from "../components/tabularViews/StaffTbl.jsx";
import AttendanceTbl from "../components/tabularViews/AttendanceTbl.jsx";
import SalaryTbl from "../components/tabularViews/SalaryTbl.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import SalePanel from "../pages/SalePanel.jsx";
import SignUp from "../components/auth/SignUp.jsx";
// 
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Landing />,
        children: [
          {
            path: "dashboard",
            element: <ProtectedRoute pass={true}> <Dashboard /></ProtectedRoute>,
          },
          {
            path: "sale-panel",
            element: <SalePanel />,
          },
          {
            path: "drugs/",
            element: <Drugs />,
            children: [
              {
                path: "stock",
                element: <DrugTbl />,
              },
              {
                path: "brands",
                element: <BrandTbl />,
              },
              {
                path: "formulations",
                element: <FormulationTbl />,
              },
              {
                path: "groups",
                element: <GroupTbl />,
              },
              {
                path: "generics",
                element: <GenericTbl />,
              },
              {
                path: "units",
                element: <UnitTbl />,
              },
              {
                path: "manufacturers",
                element: <MFRTbl />,
              },
            ],
          },
          {
            path: "sales",
            element: <SaleRecords />,
          },
          {
            path: "purchases",
            element: <Purchases />,
          },
          {
            path: "staff/",
            element: <Staff />,
            children: [
              {
                path: "members",
                element: <StaffTbl />,
              },
              {
                path: "salaries",
                element: <SalaryTbl />,
              },
              {
                path: "attendance",
                element: <AttendanceTbl />,
              },
            ],
          },
        ],
      },
      {
        path: "auth/",
        element: <Auth />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <SignUp />,
          },
          {
            path: "account-recovery",
            element: <Recovery />,
          },
          {
            path: "reset-password",
            element: <Reset />,
          },
          {
            path: "verify-otp",
            element: <OTP />,
          },
        ],
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);
