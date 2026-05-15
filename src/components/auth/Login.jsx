import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Label from "../common-ui/Label";
import Input from "../common-ui/Input";
import Button from "../common-ui/Button";
import eye from "../../assets/icons/eye.svg";
import { postHandler } from "../../utils/handlerReqRes";
import { setAuthToken } from "../../utils/apiClient";
import { setUser } from "../../redux/slices/User";
import { ROLES } from "../../ui-config/user.roles";

const DASHBOARD_ROLES = [
  ROLES.ACCOUNTANT,
  ROLES.ADMIN,
  ROLES.PHARMACIST,
  ROLES.MANAGER,
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const { data } = await postHandler("/auth/login", { email, password });
      const token = data?.token ?? data?.accessToken;
      const user = data?.user ?? data;
      if (token) setAuthToken(token);
      // Persist normalized user so RootLayout's hydrate-on-mount path picks
      // it up after a reload. Without this, the JWT survives but the redux
      // user slice resets to isAuthenticated=false and ProtectedRoute bounces.
      const persistedUser = {
        userId: user?.userId ?? user?.id ?? "",
        userName: user?.userName ?? user?.fullName ?? user?.name ?? "",
        userEmail: user?.userEmail ?? user?.email ?? "",
        userRole: user?.userRole ?? user?.role ?? "",
      };
      localStorage.setItem("user", JSON.stringify(persistedUser));
      dispatch(setUser(persistedUser));

      const role = persistedUser.userRole;
      if (DASHBOARD_ROLES.includes(role)) {
        navigate("/dashboard");
      } else if (role === ROLES.SALESMAN) {
        navigate("/drugs/stock");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrors(
        err.errors?.reduce((a, e) => ({ ...a, [e.field]: e.message }), {}) ?? {
          _form: err.message ?? "Login failed",
        }
      );
    } finally {
      setSubmitting(false);
    }
  }

  function setTestData(role) {
    const map = {
      admin: ["test.admin@gmail.com", "pass.admin"],
      manager: ["test.manager@gmail.com", "pass.manager"],
      salesman: ["test.salesman@gmail.com", "pass.salesman"],
    };
    const [e, p] = map[role] ?? ["", ""];
    setEmail(e);
    setPassword(p);
  }

  function passVisibility(e, id) {
    e.preventDefault();
    const x = document.getElementById(id);
    x.type = x.type === "password" ? "text" : "password";
    setTimeout(() => {
      x.type = "password";
    }, 2000);
  }

  return (
    <div className="h-full w-full flex flex-col gap-4 justify-center items-center sm:px-2 px-4">
      <div className="md:w-2/5 sm:w-1/2 w-full flex justify-start gap-4">
        <span className="font-medium text-neutral-600 rounded-lg px-2 py-1 bg-neutral-100">
          Test Accounts:
        </span>
        <Button onClick={() => setTestData("admin")} txt="admin" style=" btn-test-data " />
        <Button onClick={() => setTestData("manager")} txt="manager/accountant" style=" btn-test-data " />
        <Button onClick={() => setTestData("salesman")} txt="salesman" style=" btn-test-data " />
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:w-2/5 sm:w-1/2 w-full m-2 flex flex-col gap-4 items-start"
      >
        <div className="flex flex-col gap-1 w-full">
          <Label txt="Email" />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: null });
            }}
            required={true}
            pc="Enter your email"
          />
          {errors.email && (
            <span className="text-sm text-error-600 mt-1">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Label txt="Password" />
              <Button onClick={(e) => passVisibility(e, "password")}>
                <img src={eye} className="icon-sm" />
              </Button>
            </div>

            {/* Account recovery / password reset / OTP pages are not yet
                implemented on the backend — link hidden until those flows ship. */}
          </div>
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: null });
            }}
            type="password"
            id="password"
            title="Must contain at least 6 or more characters"
            required={true}
            pc="password"
            style=" flex-grow"
          />
          {errors.password && (
            <span className="text-sm text-error-600 mt-1">{errors.password}</span>
          )}
        </div>

        <div className="flex justify-start">
          <Button
            txt={submitting ? "Logging in..." : "Log In"}
            type="submit"
            disabled={submitting}
            style=" btn-auth-submit "
          />
        </div>

        {errors._form && (
          <p className="text-sm text-error-600 bg-error-50 px-4 py-2 rounded-lg">
            {errors._form}
          </p>
        )}
      </form>
    </div>
  );
}
