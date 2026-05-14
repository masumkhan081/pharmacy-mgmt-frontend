import { StrictMode } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { routes } from "./routes/routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/common-ui/Toast.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={routes} />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
