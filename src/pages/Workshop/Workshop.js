import React, {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem, Radio,
    RadioGroup,
    Select,
    TableCell,
    TableRow
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Notification from "../../components/Notifications/Notification";
import Loading from "../../components/Loading/Loading";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoieG9sYmVrIiwiYSI6ImNsbzVpZmIxeTBiNGoyaW8zczYyaGc3dDEifQ.denGEsWgU0BqOq2xKuQvcQ";

const Workshop = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [confirmedValue, setConfirmedValue] = useState("");
    const [title_uz, setTitleUz] = useState("");
    const [title_ru, setTitleRu] = useState("");
    const [title_eng, setTitleEng] = useState("");
    const [description_uz, setDescriptionUz] = useState("");
    const [description_ru, setDescriptionRu] = useState("");
    const [description_eng, setDescriptionEng] = useState("");
    const [phone, setPhone] = useState("");
    const [workingTime, setWorkingTime] = useState("");
    const [address_uz, setAddressUz] = useState("");
    const [address_ru, setAddressRu] = useState("");
    const [address_eng, setAddressEng] = useState("");
    const [typeOfWorkshopId, setTypeOfWorkshopId] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [workshops, setWorkshops] = useState([]);
    const [typesOfWorkshops, setTypesOfWorkshops] = useState([]);
    const [locationInput, setLocationInput] = useState("onInput");
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const handleChangeSorting = (event) => {
        setConfirmedValue(event.target.value);
        setTypeOfWorkshopId(event.target.value);
    };

    useEffect(() => {
        getWorkshops.doRequest();
        // getMap();
    }, [confirmedValue]);
    const getWorkshops = useRequest({
        url: `/workshop?lang=all`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setWorkshops(data.data);
        },
    });

    const getTypesOfWorkshops = useRequest({
        url: `/types-of-workshops?lang=uz`,
        method: 'get',
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setTypesOfWorkshops(data.data);
        }
    })

    const getMap = () => {
        const map = new mapboxgl.Map({
            container: 'map-container', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [69.251827, 41.307349], // starting position [lng, lat]
            zoom: 12, // starting zoom
        });

        // Add controls, markers, or other customizations here as needed

        map.current.on('move', () => {
            console.log(map.current.getCenter().lng.toFixed(4));
            console.log(map.current.getCenter().lat.toFixed(4))
        })

        return () => map.remove();
    }

    const addWorkshops = useRequest({
        url: `/workshop`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz,
            title_ru,
            title_eng,
            description_uz,
            description_ru,
            description_eng,
            phone,
            workingTime,
            address_uz,
            address_ru,
            address_eng,
            typeOfWorkshopId,
            lat: latitude,
            long: longitude,
        }, onSuccess: (data) => {
            getWorkshops.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Workshop yaratildi.");
        },
    });

    const updateWorkshopsRequest = useRequest({
        url: `/workshop`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz,
            title_ru,
            title_eng,
            description_uz,
            description_ru,
            description_eng,
            phone,
            workingTime,
            address_uz,
            address_ru,
            address_eng,
            typeOfWorkshopId,
            lat: latitude,
            long: longitude,
        }, onSuccess: (data) => {
            getWorkshops.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Workshop yangilandi.");
        }
    })

    const updateWorkshopData = (id) => {
        setId(id);
        workshops.find((type) => {
            if (type.id === id) {
                setTitleUz(type.title_uz);
                setTitleRu(type.title_ru);
                setTitleEng(type.title_eng);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteWorkshopsRequest = useRequest({
        url: `/workshop`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getWorkshops.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Workshop o'chirildi.");
        },
    });

    const deleteWorkshops = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteWorkshopsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitWorkshopsData = async (e) => {
        e.preventDefault();

        if (!updateUser) {
            await addWorkshops.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateWorkshopsRequest.doRequest(id);
        }
    };

    return (<React.Fragment>
        {getWorkshops.loading ? <Loading/> : null}
        {addWorkshops.loading ? <Loading/> : null}
        {deleteWorkshops.loading ? <Loading/> : null}
        {addWorkshops.errors ? <Notification message={addWorkshops.errors} status={"error"}/> : null}
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
                                getWorkshops.doRequest();
                            }}
                        >
                            Workshops List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => {
                            setCreateUser(true);
                            getTypesOfWorkshops.doRequest();
                        }}>{"Add Workshop"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <Table
                        headers={["Title Uz", "Title Eng", "Title Ru", "image", "Edit", "Delete",]}
                    >
                        {workshops.map((n) => (<TableRow
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
                                <img
                                    // crossOrigin="anonymous"
                                    alt={"image"}
                                    src={`http://localhost:3000/${n.photo}`}
                                    style={{width: "100px"}}
                                />
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{color: "rgb(62, 147, 251)"}}
                            >
                                <BorderColorOutlinedIcon
                                    onClick={() => updateWorkshopData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteWorkshops(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitWorkshopsData}>
                        <div className="detail">
                            <label>Title Uz</label>
                            <input
                                type={"text"}
                                value={title_uz}
                                onChange={(e) => setTitleUz(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Title Eng</label>
                            <input
                                type={"text"}
                                value={title_eng}
                                onChange={(e) => setTitleEng(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Title Ru</label>
                            <input
                                type={"text"}
                                value={title_ru}
                                onChange={(e) => setTitleRu(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Description Uz</label>
                            <textarea
                                value={description_uz}
                                onChange={(e) => setDescriptionUz(e.target.value)}
                                required={true}
                                style={{height: "100px"}}
                            />
                        </div>
                        <div className="detail">
                            <label>Description Ru</label>
                            <textarea
                                value={description_ru}
                                onChange={(e) => setDescriptionRu(e.target.value)}
                                required={true}
                                style={{height: "100px"}}
                            />
                        </div>
                        <div className="detail">
                            <label>Description Eng</label>
                            <textarea
                                value={description_eng}
                                onChange={(e) => setDescriptionEng(e.target.value)}
                                required={true}
                                style={{height: "100px"}}
                            />
                        </div>
                        <div className="detail">
                            <label>Phone</label>
                            <input
                                type={"text"}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Working Time</label>
                            <input
                                type={"text"}
                                value={workingTime}
                                onChange={(e) => setDescriptionUz(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Address Uz</label>
                            <input
                                type={"text"}
                                value={address_uz}
                                onChange={(e) => setAddressUz(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Address Ru</label>
                            <input
                                type={"text"}
                                value={address_ru}
                                onChange={(e) => setAddressRu(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Address Eng</label>
                            <input
                                type={"text"}
                                value={address_eng}
                                onChange={(e) => setAddressEng(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className={"detail"}>
                            <label>Select From Map</label>
                            <input
                                type={"button"}
                                value={title_ru}
                                onClick={() => {
                                    getMap()
                                }}
                                required={true}
                            />
                        </div>
                        <div className={"detail"}>
                            <label>Select Type</label>
                            <div className="sorting-container">
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <Select
                                        value={confirmedValue}
                                        onChange={handleChangeSorting}
                                        displayEmpty
                                        inputProps={{"aria-label": "Without label"}}
                                    >
                                        {typesOfWorkshops.map(type => (
                                            <MenuItem value={type.id}>{type.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={"detail"}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Location</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={`${locationInput}`}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="onInput" control={<Radio/>} label="Input"
                                                      onChange={() => setLocationInput("onInput")}/>
                                    <FormControlLabel value="onMap" control={<Radio/>} label="Select From Map"
                                                      onChange={() => {
                                                          setLocationInput("onMap");
                                                          getMap();
                                                      }}/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {locationInput === "onInput" ? <>
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
                        </> : null}
                        <div className={"detail"}>
                            <div id={"map-container"} style={{width: '100%', height: '400px'}}/>
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addWorkshops.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Workshop"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default Workshop;
