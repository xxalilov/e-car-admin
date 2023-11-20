import React, {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {FormControl, MenuItem, Select, TableCell, TableRow} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Notification from "../../components/Notifications/Notification";
import Loading from "../../components/Loading/Loading";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Switch from "@mui/material/Switch";
import PreviewIcon from "@mui/icons-material/Preview";
import Pagination from "../../components/Pagination/Pagination";
import Button from "@mui/material/Button";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80%",
    overflow: "scroll",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};


const Order = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
    const [confirmedType, setConfirmedType] = useState("pending");
    const [order, setOrder] = useState([]);
    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChangeType = (event) => {
        setCurrentPage(1)
        setConfirmedType(event.target.value);
    };


    useEffect(() => {
        getOrder.doRequest();
    }, [currentPage, confirmedType]);
    const getOrder = useRequest({
        url: `/order/admin?pageSize=10&page=${currentPage}&type=${confirmedType}`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setOrder(data.data);
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
        },
    });

    const searchOrders = useRequest({
        url: `/order/admin?type=search&searchData=${id}`, method: "get", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setOrder(data.data);
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
        },
    });

    const payOrderRequest = useRequest({
        url: `/order`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            is_paid: true
        }, onSuccess: (data) => {
            getOrder.doRequest();
            setOnSuccessMsg("Order yangilandi.");
        }
    })

    const shipOrderRequest = useRequest({
        url: `/order`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            shipping_status: true
        }, onSuccess: (data) => {
            getOrder.doRequest();
            setOnSuccessMsg("Order yangilandi.");
        }
    })
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const searchOrder = async () => {
        if (id.length > 0) {
            await searchOrders.doRequest();
        } else {
            await getOrder.doRequest()
        }
    }

    return (<React.Fragment>
        {getOrder.loading ? <Loading/> : null}
        {searchOrders.loading ? <Loading/> : null}
        {payOrderRequest.loading ? <Loading/> : null}
        {shipOrderRequest.loading ? <Loading/> : null}
        {onSuccessMsg ? <Notification message={onSuccessMsg} status={"success"}/> : null}

        <div className="profile-container">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Table
                        headers={["T/r", "Title Uz", "Title Eng", "Title Ru", "Description Uz", "Description Eng", "Description Ru", "Address Uz", "Address Eng", "Address Ru", "Price", "Phone", "Images", "Quantity"]}
                    >
                        {products.map((n, index) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
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
                                        style={{width: "50px", height: "50px", marginLeft: "5px"}}
                                    />
                                ))}
                            </TableCell>
                            <TableCell align="left">
                                {n.orderItem.quantity}
                            </TableCell>

                        </TableRow>))}
                    </Table>
                </Box>
            </Modal>
            <div className="right-section">
                <div>
                    <div className="sorting-container">
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <Select
                                value={confirmedType}
                                onChange={handleChangeType}
                                displayEmpty
                                inputProps={{"aria-label": "Without label"}}
                            >
                                <MenuItem value={"pending"}>Pending</MenuItem>
                                <MenuItem value={"history"}>History</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <input value={id} type={"number"} placeholder={"Order number"}
                               style={{height: '2rem', outline: 'none', fontSize: "18px"}}
                               onChange={(e) => setId(e.target.value)}/>
                        <button type={"click"} onClick={() => searchOrder()} style={{
                            height: '2rem',
                            outline: 'none',
                            fontSize: "18px",
                            padding: "0 20px",
                            color: "white",
                            backgroundColor: "#4d7ff0",
                            border: "2px solid #4d7ff0",
                            borderRadius: "2px"
                        }}>Search
                        </button>
                    </div>
                </div>
                <Table
                    headers={["ID", "Show Products", "Shipping Type", "Shipping Price", "Shipping Status", "Shipping Address", "Total Price", "Payment Type", "Is Paid", "Pay", "Shipped"]}
                >
                    {order.map((n) => (<TableRow
                            key={n.id}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {n.id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <VisibilityIcon
                                    onClick={() => {
                                        setProducts(n.products);
                                        handleOpen();
                                    }}
                                    style={{cursor: "pointer", color: "blue"}}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.shipping_type}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.shipping_price}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.shipping_status ? "Yetkazib berildi" : "Yetkazib berilmadi"}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.shipping_address}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.total_price}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.payment_type}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {n.is_paid ? "To'langan" : "To'lanmagan"}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button variant="contained" disabled={n.is_paid} onClick={() => payOrderRequest.doRequest(n.id)}>Pay</Button>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button variant="contained" disabled={n.shipping_status} onClick={() => shipOrderRequest.doRequest(n.id)}>Ship</Button>
                            </TableCell>
                            {/*<TableCell*/}
                            {/*    align="left"*/}
                            {/*    style={{color: "rgb(62, 147, 251)"}}*/}
                            {/*>*/}
                            {/*    <BorderColorOutlinedIcon*/}
                            {/*        onClick={() => updateOrderData(n.id)}*/}
                            {/*        style={{cursor: "pointer"}}*/}
                            {/*    />*/}
                            {/*</TableCell>*/}
                        </TableRow>
                    ))}
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
            </div>
        </div>
    </React.Fragment>);
};

export default Order;
