import React, {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {FormControl, MenuItem, Select, TableCell, TableRow} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Notification from "../../components/Notifications/Notification";
import Loading from "../../components/Loading/Loading";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

const Shipping = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [type, setType] = useState("normal");
    const [price, setPrice] = useState("");
    const [shippings, setShippings] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const handleChangeSorting = (event) => {
        setType(event.target.value)
    }

    useEffect(() => {
        getShippings.doRequest();
    }, []);
    const getShippings = useRequest({
        url: `/shipping`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setShippings(data.data);
        },
    });

    const addShippings = useRequest({
        url: `/shipping`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            type,
            price
        }, onSuccess: (data) => {
            getShippings.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Shipping yaratildi.");
        },
    });

    const updateTypesOfProductRequest = useRequest({
        url: `/shipping`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },  body: {
            type,
            price
        }, onSuccess: (data) => {
            getShippings.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Shipping yangilandi.");
        }
    })

    const updateShippingData = (id) => {
        setId(id);
        shippings.find((type) => {
            if (type.id === id) {
               setType(type.type);
               setPrice(type.price);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteShippingsRequest = useRequest({
        url: `/shipping`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getShippings.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Shipping o'chirildi.");
        },
    });

    const deleteShippings = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteShippingsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitShippingsData = async (e) => {
        e.preventDefault();
        setOnSuccessMsg(null);
        if (!updateUser) {
            await addShippings.doRequest();
        } else {
            await updateTypesOfProductRequest.doRequest(id);
        }
    };

    return (<React.Fragment>
        {getShippings.loading ? <Loading/> : null}
        {addShippings.loading ? <Loading/> : null}
        {deleteShippings.loading ? <Loading/> : null}
        {addShippings.errors ? <Notification message={addShippings.errors} status={"error"} />: null}
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
                                getShippings.doRequest();
                            }}
                        >
                            Shipping Types List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => setCreateUser(true)}>{"Add Shipping Type"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <Table
                        headers={["type", "price", "Edit", "Delete",]}
                    >
                        {shippings.map((n) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {n.type}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.price}
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{color: "rgb(62, 147, 251)"}}
                            >
                                <BorderColorOutlinedIcon
                                    onClick={() => updateShippingData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteShippings(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitShippingsData}>
                        <div className="detail">
                            <label>Type</label>
                            <div className="sorting-container">
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <Select
                                        value={type}
                                        onChange={handleChangeSorting}
                                        displayEmpty
                                        inputProps={{"aria-label": "Without label"}}
                                    >
                                        <MenuItem value={"normal"}>Normal</MenuItem>
                                        <MenuItem value={"express"}>Express</MenuItem>
                                        <MenuItem value={"bts"}>Bts</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="detail">
                            <label>Price</label>
                            <input
                                type={"number"}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addShippings.loading}
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

export default Shipping;
