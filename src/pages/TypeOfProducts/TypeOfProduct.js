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

const TypeOfProduct = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [title_uz, setTitleUz] = useState("");
    const [title_ru, setTitleRu] = useState("");
    const [title_eng, setTitleEng] = useState("");
    const [image, setImage] = useState("");
    const [confirmedValue, setConfirmedValue] = useState("tashkent");
    const [typesOfProducts, setTypesOfProducts] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const typesOfProductsData = new FormData();

    useEffect(() => {
        getTypesOfProducts.doRequest();
    }, [confirmedValue]);
    const getTypesOfProducts = useRequest({
        url: `/types-of-products?lang=all`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setTypesOfProducts(data.data);
        },
    });

    const addTypesOfProducts = useRequest({
        url: `/types-of-products`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: typesOfProductsData, onSuccess: (data) => {
            getTypesOfProducts.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("TypeOfProduct yaratildi.");
        },
    });

    const updateTypesOfProductRequest = useRequest({
        url: `/types-of-products`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },  body: typesOfProductsData, onSuccess: (data) => {
            getTypesOfProducts.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("TypeOfProduct yangilandi.");
        }
    })

    const updateTypeOfProductData = (id) => {
        setId(id);
        typesOfProducts.find((type) => {
            if (type.id === id) {
                setTitleUz(type.uz);
                setTitleRu(type.ru);
                setTitleEng(type.eng);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteTypesOfProductsRequest = useRequest({
        url: `/types-of-products`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: typesOfProductsData, onSuccess: (data) => {
            getTypesOfProducts.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("TypeOfProduct o'chirildi.");
        },
    });

    const deleteTypesOfProducts = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteTypesOfProductsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitTypesOfProductsData = async (e) => {
        e.preventDefault();
        typesOfProductsData.append("uz", title_uz);
        typesOfProductsData.append("eng", title_eng);
        typesOfProductsData.append("ru", title_ru);
        typesOfProductsData.append("photo", image);

        if (!updateUser) {
            await addTypesOfProducts.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateTypesOfProductRequest.doRequest(id);
        }
    };

    return (<React.Fragment>
        {getTypesOfProducts.loading ? <Loading/> : null}
        {addTypesOfProducts.loading ? <Loading/> : null}
        {deleteTypesOfProducts.loading ? <Loading/> : null}
        {addTypesOfProducts.errors ? <Notification message={addTypesOfProducts.errors} status={"error"} />: null}
        <div className="profile-container">
            {onSuccessMsg}
            <div className="right-section">
                <div className="right-section-header">
                    <div
                        className={createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button
                            onClick={() => {
                                setCreateUser(false);
                                setUpdateUser(false);
                                  getTypesOfProducts.doRequest();
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
                        {typesOfProducts.map((n) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {n.uz}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.eng}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.ru}
                            </TableCell>
                            <TableCell align="left">
                                <img
                                    // crossOrigin="anonymous"
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
                                    onClick={() => updateTypeOfProductData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteTypesOfProducts(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                        </TableRow>))}
                    </Table>
                </>) : (<div className="right-section-details">
                    <form onSubmit={onSubmitTypesOfProductsData}>
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
                                loading={addTypesOfProducts.loading}
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

export default TypeOfProduct;
