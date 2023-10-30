import React, {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {TableCell, TableRow} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Notification from "../../components/Notifications/Notification";
import Loading from "../../components/Loading/Loading";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

const TypeOfWorkshop = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [title_uz, setTitleUz] = useState("");
    const [title_ru, setTitleRu] = useState("");
    const [title_eng, setTitleEng] = useState("");
    const [image, setImage] = useState("");
    const [confirmedValue, setConfirmedValue] = useState("tashkent");
    const [typesOfWorkshops, setTypesOfWorkshops] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const typesOfWorkshopsData = new FormData();

    useEffect(() => {
        getTypesOfWorkshops.doRequest();
    }, [confirmedValue]);
    const getTypesOfWorkshops = useRequest({
        url: `/types-of-workshops?lang=all`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setTypesOfWorkshops(data.data);
        },
    });

    const addTypesOfWorkshops = useRequest({
        url: `/types-of-workshops`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: typesOfWorkshopsData, onSuccess: (data) => {
            getTypesOfWorkshops.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("TypeOfWorkshop yaratildi.");
        },
    });

    const updateTypesOfWorkshopsRequest = useRequest({
        url: `/types-of-workshops`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },  body: typesOfWorkshopsData, onSuccess: (data) => {
            getTypesOfWorkshops.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("TypeOfWorkshop yangilandi.");
        }
    })

    const updateTypeOfWorkshopData = (id) => {
        setId(id);
        typesOfWorkshops.find((type) => {
            if (type.id === id) {
                setTitleUz(type.title_uz);
                setTitleRu(type.title_ru);
                setTitleEng(type.title_eng);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteTypesOfWorkshopsRequest = useRequest({
        url: `/types-of-workshops`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: typesOfWorkshopsData, onSuccess: (data) => {
            getTypesOfWorkshops.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("TypeOfWorkshop o'chirildi.");
        },
    });

    const deleteTypesOfWorkshops = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteTypesOfWorkshopsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitTypesOfWorkshopsData = async (e) => {
        e.preventDefault();
        typesOfWorkshopsData.append("title_uz", title_uz);
        typesOfWorkshopsData.append("title_eng", title_eng);
        typesOfWorkshopsData.append("title_ru", title_ru);
        typesOfWorkshopsData.append("photo", image);

        if (!updateUser) {
            await addTypesOfWorkshops.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateTypesOfWorkshopsRequest.doRequest(id);
        }
    };

    return (<React.Fragment>
        {getTypesOfWorkshops.loading ? <Loading/> : null}
        {addTypesOfWorkshops.loading ? <Loading/> : null}
        {deleteTypesOfWorkshops.loading ? <Loading/> : null}
        {addTypesOfWorkshops.errors ? <Notification message={addTypesOfWorkshops.errors} status={"error"} />: null}
        {onSuccessMsg ? <Notification message={onSuccessMsg} status={"success"} />: null}
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
                                getTypesOfWorkshops.doRequest();
                            }}
                        >
                            Types of Product List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => setCreateUser(true)}>{"Add Type Of Product"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <Table
                        headers={["Title Uz", "Title Eng","Title Ru", "image", "Edit", "Delete",]}
                    >
                        {typesOfWorkshops.map((n) => (<TableRow
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
                                    crossOrigin="anonymous"
                                    alt={"image"}
                                    src={`https://user-stat.uz/${n.photo}`}
                                    style={{width: "100px"}}
                                />
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{color: "rgb(62, 147, 251)"}}
                            >
                                <BorderColorOutlinedIcon
                                    onClick={() => updateTypeOfWorkshopData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteTypesOfWorkshops(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitTypesOfWorkshopsData}>
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
                            <label>Image</label>
                            <input
                                type={"file"}
                                // value={}
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addTypesOfWorkshops.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Type Of Product"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default TypeOfWorkshop;
