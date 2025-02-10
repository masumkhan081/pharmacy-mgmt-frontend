import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
//
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
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute pass={true}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          { path: "sale-panel", element: <SalePanel /> },
          {
            path: "drugs",
            element: <Drugs />,
            children: [
              { path: "stock", element: <DrugTbl /> },
              { path: "brands", element: <BrandTbl /> },
              { path: "formulations", element: <FormulationTbl /> },
              { path: "groups", element: <GroupTbl /> },
              { path: "generics", element: <GenericTbl /> },
              { path: "units", element: <UnitTbl /> },
              { path: "manufacturers", element: <MFRTbl /> },
            ],
          },
          { path: "sales", element: <SaleRecords /> },
          { path: "purchases", element: <Purchases /> },
          {
            path: "staff",
            element: <Staff />,
            children: [
              { path: "members", element: <StaffTbl /> },
              { path: "salaries", element: <SalaryTbl /> },
              { path: "attendance", element: <AttendanceTbl /> },
            ],
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
