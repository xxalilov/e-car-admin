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

const Admin = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [admins, setAdmins] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        getAdmins.doRequest();
    }, []);
    const getAdmins = useRequest({
        url: `/admin`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setAdmins(data.data);
        },
    });

    const addAdmins = useRequest({
        url: `/admin`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            fullname,
            email,
            password
        }, onSuccess: (data) => {
            getAdmins.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Admin yaratildi.");
            clearFields();
        },
    });

    const clearFields = () => {
        setEmail("");
        setPassword("");
        setFullname("");
    }

    const updateAdminRequest = useRequest({
        url: `/admin`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },  body: {
            fullname,
            email,
            password
        }, onSuccess: (data) => {
            getAdmins.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Admin yangilandi.");
            clearFields();
        }
    })

    const updateAdminData = (id) => {
        setId(id);
        admins.find((type) => {
            if (type.id === id) {
                setEmail(type.email);
                setFullname(type.fullname);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteAdminsRequest = useRequest({
        url: `/admin`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getAdmins.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Admin o'chirildi.");
        },
    });

    const deleteAdmins = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteAdminsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitAdminsData = async (e) => {
        e.preventDefault();

        if (!updateUser) {
            await addAdmins.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateAdminRequest.doRequest(id);
        }
    };

    return (<React.Fragment>
        {getAdmins.loading ? <Loading/> : null}
        {addAdmins.loading ? <Loading/> : null}
        {deleteAdmins.loading ? <Loading/> : null}
        {addAdmins.errors ? <Notification message={addAdmins.errors} status={"error"} />: null}
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
                                getAdmins.doRequest();
                            }}
                        >
                            Admins List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => setCreateUser(true)}>{"Add Admin"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <Table
                        headers={["Fullname", "Email", "Edit", "Delete",]}
                    >
                        {admins.map((n) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {n.fullname}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.email}
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{color: "rgb(62, 147, 251)"}}
                            >
                                <BorderColorOutlinedIcon
                                    onClick={() => updateAdminData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteAdmins(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitAdminsData}>
                        <div className="detail">
                            <label>Email</label>
                            <input
                                type={"text"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Fullname</label>
                            <input
                                type={"text"}
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>Password</label>
                            <input
                                type={"text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addAdmins.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Admin"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default Admin;
