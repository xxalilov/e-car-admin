import React, { useContext } from "react";
import "./i18n";
import AuthContext from "./store/auth-context";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <React.Fragment>
      {authCtx.isLoggedIn ? <Main token={authCtx.token} /> : <Login />}
    </React.Fragment>
  );
}

export default App;
