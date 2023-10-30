import {NavLink} from "react-router-dom";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Person2Icon from "@mui/icons-material/Person2";
import {useTranslation} from "react-i18next";
import React from "react";
import "./sidebar.css";

const Sidebar = (props) => {
    const {innerWidth: width} = window;
    const {t} = useTranslation();

    const onCloseSideBar = () => {
        if (width < 768) {
            props.setCloseSidebar();
        }
    };

    return (
        <React.Fragment>
            <div
                className={props.isSidebar ? "sidebar-container-open" : ""}
                onClick={() => props.setOpenCloseSideBar()}
            ></div>
            <div className={props.isSidebar ? "sidebar" : "sidebar closed"}>
                <div className={"sidebar-header"}></div>
                <div className={"sidebar-body"}>
                    <ul>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/"}
                                onClick={onCloseSideBar}
                            >
                                <ChecklistOutlinedIcon style={{paddingRight: "10px"}}/>
                                {t("roadInfos")}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/type-of-products"}
                                onClick={onCloseSideBar}
                            >
                                <ChecklistOutlinedIcon style={{paddingRight: "10px"}}/>
                                Type of products
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/type-of-workshops"}
                                onClick={onCloseSideBar}
                            >
                                <ChecklistOutlinedIcon style={{paddingRight: "10px"}}/>
                                Type of Workshops
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/workshops"}
                                onClick={onCloseSideBar}
                            >
                                <ChecklistOutlinedIcon style={{paddingRight: "10px"}}/>
                                Workshops
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/advertisings"}
                                onClick={onCloseSideBar}
                            >
                                <ChecklistOutlinedIcon style={{paddingRight: "10px"}}/>
                                Advertisings
                            </NavLink>
                        </li>


                        {props.role === "superadmin" && (
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        isActive ? "link active" : "link"
                                    }
                                    to={"/news"}
                                    onClick={onCloseSideBar}
                                >
                                    <ArticleIcon style={{paddingRight: "10px"}}/>
                                    {/* {t("usersList")} */}
                                    News
                                </NavLink>
                            </li>
                        )}
                        {props.role === "superadmin" && (
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        isActive ? "link active" : "link"
                                    }
                                    to={"/feedback-status"}
                                    onClick={onCloseSideBar}
                                >
                                    <AddCommentIcon style={{paddingRight: "10px"}}/>
                                    {/* {t("usersList")} */}
                                    Feedback Status
                                </NavLink>
                            </li>
                        )}
                        {props.role === "superadmin" && (
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        isActive ? "link active" : "link"
                                    }
                                    to={"/users"}
                                    onClick={onCloseSideBar}
                                >
                                    <GroupIcon style={{paddingRight: "10px"}}/>
                                    {t("usersList")}
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/profile"}
                                onClick={onCloseSideBar}
                            >
                                <Person2Icon style={{paddingRight: "10px"}}/>
                                {t("prof")}
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
