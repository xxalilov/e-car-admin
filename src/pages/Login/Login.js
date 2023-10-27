import React, { useContext, useState } from "react";
import useRequest from "../../hooks/use-request";
import AuthContext from "../../store/auth-context";
import LoadingButton from "@mui/lab/LoadingButton";
import Notification from "../../components/Notifications/Notification";
import "./login.css";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);

  const { doRequest, errors, loading } = useRequest({
    url: "/auth/signin/admin",
    method: "post",
    body: {
      email: login,
      password,
    },
    onSuccess: (data) => {
      let token = data.token;
      const expirationTime = new Date(
        new Date().getTime() + +30 * 24 * 60 * 1000
      );

      authCtx.login(token, expirationTime.toISOString(), data.userId);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <React.Fragment>
      <div className="notification-container">
        {errors && <Notification status={"error"} message={errors} />}
      </div>
      <div className={"login-container"}>
        <div className="login">
          <div className="login-header">
            <h1>E-Car</h1>
          </div>
          <div className="form" onSubmit={onSubmit}>
            <form>
              <div className="label">
                <label>
                  <b style={{ color: "red", fontSize: "16px" }}>* </b>email
                </label>
                <input
                  type={"text"}
                  placeholder={"loginingizni kiriting"}
                  required={true}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="label">
                <label>
                  <b style={{ color: "red", fontSize: "16px" }}>* </b>pasword
                </label>
                <input
                  className={"error"}
                  type={"password"}
                  placeholder={"parolingini kiriting"}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="label">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  variant="contained"
                >
                  Login
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
