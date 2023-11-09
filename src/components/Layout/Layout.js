import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./layout.css";

const Layout = (props) => {
  const { innerWidth: width } = window;
  const [sidebar, setSidebar] = useState(width > 768 ? true : false);

  const setCloseSidebar = () => {
    setSidebar(false);
  };

  return (
    <div className={"container"}>
      <Sidebar
        isSidebar={sidebar}
        setOpenCloseSideBar={() => setSidebar(!sidebar)}
        setCloseSidebar={setCloseSidebar}
        role={props.role}
      />
      <div className={"main"}>
        <Header
          setOpenCloseSideBar={() => setSidebar(!sidebar)}
          isSidebar={sidebar}
        />
        <main>
          <div className="main-section">{props.children}</div>
          <div className="buttom">
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
