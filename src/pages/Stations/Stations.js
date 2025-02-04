import React, {useContext, useEffect, useState, useRef} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGl, { Marker } from 'react-map-gl';
import {LoadingButton} from "@mui/lab";
import {
    TableCell, TableRow
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PreviewIcon from "@mui/icons-material/Preview";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Notification from "../../components/Notifications/Notification";
import Loading from "../../components/Loading/Loading";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Pagination from "../../components/Pagination/Pagination";

const TOKEN = "pk.eyJ1IjoieG9sYmVrIiwiYSI6ImNsbzVpZmIxeTBiNGoyaW8zczYyaGc3dDEifQ.denGEsWgU0BqOq2xKuQvcQ";

const Stations = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [confirmedValue, setConfirmedValue] = useState("");
    const [titleUz, setTitleUz] = useState("");
    const [titleRu, setTitleRu] = useState("");
    const [titleEng, setTitleEng] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [stations, setStations] = useState([]);
    const [id, setId] = useState(null);
    const [viewPort, setViewPort] = useState({
        latitude: 41.307349,
        longitude: 69.251827,
        zoom: 12,
    });
    const [newPlace, setNewPlace] = useState(null)

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        getStations.doRequest();
    }, [confirmedValue, currentPage]);
    const getStations = useRequest({
        url: `/station?pageSize=10&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
            setStations(data.data);
        },
    });

    const addStations = useRequest({
        url: `/station`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz: titleUz,
            title_ru: titleRu,
            title_eng: titleEng,
            lat: String(latitude),
            long: String(longitude),
        }, onSuccess: (data) => {
            getStations.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Stations yaratildi.");
        }
    });

    const updateStationsRequest = useRequest({
        url: `/station`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz: titleUz,
            title_ru: titleRu,
            title_eng: titleEng,
            lat: String(latitude),
            long: String(longitude),
        }, onSuccess: (data) => {
            getStations.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Stations yangilandi.");
        }
    })

    const updateStationsData = (id) => {
        setId(id);
        stations.find((type) => {
            if (type.id === id) {
                setTitleUz(type.title_uz);
                setTitleRu(type.title_ru);
                setTitleEng(type.title_eng);
                setLatitude(type.lat);
                setLongitude(type.long);
                setNewPlace({
                    lat: type.lat,
                    long: type.long
                })
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteStationsRequest = useRequest({
        url: `/station`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getStations.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Stations o'chirildi.");
        },
    });

    const deleteStations = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteStationsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitStationsData = async (e) => {
        e.preventDefault();

        if (!updateUser) {
            await addStations.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateStationsRequest.doRequest(id);
        }
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const handleClick = (e) => {
        setLatitude(e.lngLat.lat);
        setLongitude(e.lngLat.lng)
        setNewPlace({
            lat: e.lngLat.lat,
            long: e.lngLat.lng
        })
    }


    return (<React.Fragment>
        {getStations.loading ? <Loading/> : null}
        {addStations.loading ? <Loading/> : null}
        {deleteStations.loading ? <Loading/> : null}
        {addStations.errors ? <Notification message={addStations.errors} status={"error"}/> : null}
        {onSuccessMsg ? <Notification message={onSuccessMsg} status={"success"}/> : null}
        <div className="profile-container">
            <div className="right-section">
                <div className="right-section-header">
                    <div
                        className={createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button
                            onClick={() => {
                                setCreateUser(false);
                                setUpdateUser(false);
                                getStations.doRequest();
                            }}
                        >
                            Stations List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => {
                            setCreateUser(true);
                        }}>{"Add Stations"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <Table
                        headers={["Title Uz","Title Eng","Title Ru", "See On Map", "Edit", "Delete"]}
                    >
                        {stations.map((n) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {n.title_uz}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.title_eng}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.title_ru}
                            </TableCell>
                            <TableCell align="left">
                                <a
                                    href={`
                      https://yandex.com/maps/?ll=${n.long},${n.lat}&z=14&text=${n.lat},${n.long}`}
                                    target="_blank"
                                >
                                    <PreviewIcon/>
                                </a>
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{color: "rgb(62, 147, 251)"}}
                            >
                                <BorderColorOutlinedIcon
                                    onClick={() => updateStationsData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteStations(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                    <div className="pagination">
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={count}
                            pageSize={allPages}
                            onPageChange={(page) => changeCurrentPage(page)}
                        />
                    </div>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitStationsData}>
                        <div className="detail">
                            <label>Title Uz</label>
                            <input
                                type={"text"}
                                value={titleUz}
                                onChange={(e) => setTitleUz(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Title Eng</label>
                            <input
                                type={"text"}
                                value={titleEng}
                                onChange={(e) => setTitleEng(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Title Ru</label>
                            <input
                                type={"text"}
                                value={titleRu}
                                onChange={(e) => setTitleRu(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className={"detail"} className={"style1"}>
                            <ReactMapGl
                                {...viewPort}
                                mapboxAccessToken={TOKEN}
                                width={"100%"}
                                height={"100%"}
                                transitionDuration={'200'}
                                mapStyle={'mapbox://styles/xolbek/clp6j2q7r00hl01pc8kna024o'}
                                onMove={evt => setViewPort(evt.viewState)}
                                onDblClick={handleClick}
                            >
                                {newPlace ? (
                                    <>
                                        <Marker latitude={newPlace.lat} longitude={newPlace.long} offsetLeft={-3.5*viewPort.zoom} offsetTop={-7*viewPort.zoom}>
                                        </Marker>
                                    </>
                                ) : null}
                            </ReactMapGl>
                        </div>
                        <div className={"detail"}>
                            <label>
                                Latitude
                            </label>
                            <input type={"text"} value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                        </div>
                        <div className={"detail"}>
                            <label>
                                Longitude
                            </label>
                            <input type={"text"} value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addStations.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Stations"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default Stations;
