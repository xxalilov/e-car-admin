import React, { useContext } from "react";
import i18next from "i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BasicMenu from "../Menu/Menu";
import AuthContext from "../../store/auth-context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";

import "./header.css";

const Header = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logutUser = () => {
    authCtx.logout();
    navigate("/");
  };

  function changeLanguage(lan) {
    i18next.changeLanguage(lan);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <header className={props.isSidebar ? "header" : "header close-sidebar"}>
      <div className={"left-section"}>
        <button onClick={() => props.setOpenCloseSideBar()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
      </div>
      <div className="right-section">
        <div className="lan">
          <BasicMenu
            header={<LanguageIcon />}
            bottom={[
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("uz")}
              >
                O'z
              </button>,
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("uzKrill")}
              >
                Ўз
              </button>,
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("kk")}
              >
                Qar
              </button>,
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("kkKrill")}
              >
                Қар
              </button>,
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("eng")}
              >
                Eng
              </button>,
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => changeLanguage("ru")}
              >
                Ру
              </button>,
            ]}
          />
        </div>

        <div className="profile">
          <BasicMenu
            header={
              <div className="profile-picture">
                <AccountCircleIcon style={{ fontSize: "27px" }} />
              </div>
            }
            bottom={[
              <NavLink
                style={{
                  textDecoration: "none",
                  fontSize: "16px",
                  color: "#111",
                }}
                to={"/profile"}
              >
                {t("prof")}
              </NavLink>,
              <button
                onClick={logutUser}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                {t("logOut")}
              </button>,
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
