import {NavLink} from "react-router-dom";
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
                                to={"/type-of-products"}
                                onClick={onCloseSideBar}
                            >
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
                                Advertisings
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/stations"}
                                onClick={onCloseSideBar}
                            >
                                Stations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/instructions"}
                                onClick={onCloseSideBar}
                            >
                                Instructions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>
                                    isActive ? "link active" : "link"
                                }
                                to={"/products"}
                                onClick={onCloseSideBar}
                            >
                                Products
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
                                    to={"/users"}
                                    onClick={onCloseSideBar}
                                >
                                    Users List
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
                               Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
