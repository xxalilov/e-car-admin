import React, {useContext, useEffect, useState, useRef} from "react";
import mapboxgl from 'mapbox-gl'
import {LoadingButton} from "@mui/lab";
import {
    FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TableCell, TableRow
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
import Switch from '@mui/material/Switch';
import "./products.css";

mapboxgl.accessToken = "pk.eyJ1IjoieG9sYmVrIiwiYSI6ImNsbzVpZmIxeTBiNGoyaW8zczYyaGc3dDEifQ.denGEsWgU0BqOq2xKuQvcQ";

const Products = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [confirmedValue, setConfirmedValue] = useState("");
    const [confirmedType, setConfirmedType] = useState("all");
    const [title_uz, setTitleUz] = useState("");
    const [title_ru, setTitleRu] = useState("");
    const [title_eng, setTitleEng] = useState("");
    const [description_uz, setDescriptionUz] = useState("");
    const [description_ru, setDescriptionRu] = useState("");
    const [description_eng, setDescriptionEng] = useState("");
    const [price, setPrice] = useState("");
    const [phone, setPhone] = useState("");
    const [address_uz, setAddressUz] = useState("");
    const [address_ru, setAddressRu] = useState("");
    const [address_eng, setAddressEng] = useState("");
    const [typeOfProductsId, setTypeOfProductsId] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [products, setProducts] = useState([]);
    const [typesOfProducts, setTypesOfProducts] = useState([]);
    const [id, setId] = useState(null);
    const [images, setImages] = useState([]);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);
    
    const productData = new FormData();

    const handleChangeSorting = (event) => {
        setConfirmedValue(event.target.value);
        setTypeOfProductsId(event.target.value);
    };

    const handleChangeType = (event) => {
        setConfirmedType(event.target.value);
    };

    useEffect(() => {
        getproducts.doRequest();
        getTypesOfProducts.doRequest();
        // getMap();
    }, [confirmedValue, currentPage, confirmedType]);
    useEffect(() => {
        if (createUser) getMap();
        if (map.current) {
            map.current.on('click', (e) => {
                const {lng, lat} = e.lngLat
                const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
                marker.remove();
                new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
                setLongitude(String(lng));
                setLatitude(String(lat));
            })
        }
    }, [createUser])
    const getproducts = useRequest({
        url: `/products?lang=all${confirmedType !== "all" ? `&type=${confirmedType}`: ""}&pageSize=10&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
            setProducts(data.data);
        },
    });

    const getTypesOfProducts = useRequest({
        url: `/types-of-products?lang=uz`, method: 'get', headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setTypesOfProducts(data.data);
        }
    })

    const getMap = () => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [69.251827, 41.307349], // starting position [lng, lat]
            zoom: 12, // starting zoom
        });

        return () => map.remove();
    }

    const clearFields = () => {
        setTitleUz("");
        setTitleRu("");
        setTitleEng("");
        setDescriptionUz("");
        setDescriptionRu("");
        setDescriptionEng("");
        setAddressUz("");
        setAddressEng("");
        setAddressRu("");
        setImages([]);
        setConfirmedValue("");
        setPhone("");
        setPrice("");
        setTypeOfProductsId(null);
        setLatitude("");
        setLongitude("");
    }

    const addProducts = useRequest({
        url: `/products`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: productData
        , onSuccess: (data) => {
            getproducts.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Products yaratildi.");
            clearFields();
        }
    });

    const updateProductsRequest = useRequest({
        url: `/products`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: productData
        , onSuccess: (data) => {
            getproducts.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Products yangilandi.");
            clearFields();
        }
    })

    const updateProductsData = (id) => {
        setId(id);
        products.find((type) => {
            if (type.id === id) {
                setTitleUz(type.title_uz);
                setTitleRu(type.title_ru);
                setTitleEng(type.title_eng);
                setDescriptionUz(type.description_uz);
                setDescriptionEng(type.description_eng);
                setDescriptionRu(type.description_ru);
                setAddressUz(type.address_uz);
                setAddressEng(type.address_eng);
                setAddressRu(type.address_ru);
                setPrice(type.price);
                setPhone(type.phone);
                setConfirmedValue(type.typeOfProductId);
                setTypeOfProductsId(type.typeOfProductId)
                setLatitude(type.lat);
                setLongitude(type.long);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const updateIsTop = useRequest({
        url: `/products`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getproducts.doRequest();
            setOnSuccessMsg("Products top qilindi.");
        }
    })

    const deleteProductsRequestRequest = useRequest({
        url: `/products`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getproducts.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Products o'chirildi.");
        },
    });

    const deleteProductsRequest = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteProductsRequestRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitProductsData = async (e) => {
        e.preventDefault();
        productData.append("title_uz", title_uz);
        productData.append("title_ru", title_ru);
        productData.append("title_eng", title_eng);
        productData.append("description_uz", description_uz);
        productData.append("description_ru", description_ru);
        productData.append("description_eng", description_eng);
        productData.append("address_uz", address_uz);
        productData.append("address_ru", address_ru);
        productData.append("address_eng", address_eng);
        productData.append("phone", phone);
        productData.append("price", price);
        if(typeOfProductsId) productData.append("typeOfProductId", typeOfProductsId);
        productData.append("lat", String(latitude));
        productData.append("long", String(longitude));
        for (let i = 0; i < images.length; i++) {
            productData.append(`photo`, images[i]);
        }

        if (!updateUser) {
            await addProducts.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateProductsRequest.doRequest(id);
        }
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };


    const handleImageChange = (e) => {
        const files = e.target.files;
        setImages(files);
    };

    const handleIsTop = async (id, isTop) => {
        setOnSuccessMsg(null);
        await updateIsTop.doRequest(id, {isTop: isTop ? "false" : "true"});
    }

    return (<React.Fragment>
        {getproducts.loading ? <Loading/> : null}
        {addProducts.loading ? <Loading/> : null}
        {updateIsTop.loading ? <Loading/> : null}
        {deleteProductsRequest.loading ? <Loading/> : null}
        {addProducts.errors ? <Notification message={addProducts.errors} status={"error"}/> : null}
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
                                getproducts.doRequest();
                            }}
                        >
                            Products List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => {
                            setCreateUser(true);
                        }}>{"Add Products"}</button>
                    </div>
                </div>
                {!createUser ? (<>
                    <div className="sorting-container">
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <Select
                                value={confirmedType}
                                onChange={handleChangeType}
                                displayEmpty
                                inputProps={{"aria-label": "Without label"}}
                            >
                                <MenuItem value={"all"}>All</MenuItem>
                                {typesOfProducts.map(type => (
                                    <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Table
                        headers={["Title Uz", "Title Eng", "Title Ru", "Description Uz", "Description Eng", "Description Ru", "Address Uz", "Address Eng", "Address Ru", "Price", "Phone", "Images", "Top" , "See On Map", "Edit", "Delete"]}
                    >
                        {products.map((n) => (<TableRow
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
                                {n.description_uz}
                            </TableCell>
                            <TableCell align="left">
                                {n.description_eng}
                            </TableCell>
                            <TableCell align="left">
                                {n.description_ru}
                            </TableCell>
                            <TableCell align="left">
                                {n.address_uz}
                            </TableCell>
                            <TableCell align="left">
                                {n.address_eng}
                            </TableCell>
                            <TableCell align="left">
                                {n.address_ru}
                            </TableCell>
                            <TableCell align="left">
                                {n.price}
                            </TableCell>
                            <TableCell align="left">
                                {n.phone}
                            </TableCell>
                            <TableCell align="left">
                                {n.photos && n.photos.map((photo) => (
                                    <img
                                        key={photo}
                                        src={`https://user-stat.uz/${photo}`}
                                        // src={`http://localhost:3000/${photo}`}
                                        alt="product"
                                        style={{width: "50px", height: "50px", marginLeft:"5px"}}
                                    />
                                ))}
                            </TableCell>
                            <TableCell align="left">
                                <Switch
                                    checked={n.isTop}
                                    onChange={() => handleIsTop(n.id, n.isTop)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
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
                                    onClick={() => updateProductsData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteProductsRequest(n.id)}
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
                    <form onSubmit={onSubmitProductsData}>
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
                            <label>Price</label>
                            <input
                                type={"number"}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required={true}
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
                        <div className="detail">
                            <label>Images</label>
                            <input
                                type={"file"}
                                multiple
                                onChange={handleImageChange}
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
                                        {typesOfProducts.map(type => (
                                            <MenuItem value={type.id} key={type.id}>{type.title}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={"detail"}>
                            <div ref={mapContainer} className={"style1"}/>
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
                                loading={addProducts.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Products"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default Products;
