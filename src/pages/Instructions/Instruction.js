import React, {useContext, useEffect, useState, useRef} from "react";
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


const Instructions = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
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
    const [link, setLink] = useState("");
    const [type, setType] = useState("");
    const [typeId, setTypeId] = useState("");
    const [typeOfInstructionsId, setTypeOfInstructionsId] = useState("");
    const [Instructions, setInstructions] = useState([]);
    const [typesOfInstructions, setTypesOfInstructions] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const handleChangeSorting = (event) => {
        setConfirmedValue(event.target.value);
        setTypeOfInstructionsId(event.target.value);
    };

    const handleChangeType = (event) => {
        setConfirmedType(event.target.value);
    };

    useEffect(() => {
        getInstructions.doRequest();
    }, [confirmedValue, currentPage, confirmedType]);
    const getInstructions = useRequest({
        url: `/instruction?pageSize=10&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            console.log(data)
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
            setInstructions(data.data);
        },
    });

    const getTypesOfInstructions = useRequest({
        url: `/types-of-Instructions?lang=uz`, method: 'get', headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, onSuccess: (data) => {
            setTypesOfInstructions(data.data);
        }
    })

    const addInstructions = useRequest({
        url: `/Instructions`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz,
            title_ru,
            title_eng,
            description_uz,
            description_ru,
            description_eng,
            type,
            typeId
        }, onSuccess: (data) => {
            console.log(data)
            getInstructions.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Instructions yaratildi.");
        }
    });

    const updateInstructionsRequest = useRequest({
        url: `/Instructions`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {
            title_uz,
            title_ru,
            title_eng,
            description_uz,
            description_ru,
            description_eng,
            type,
            typeId
        }, onSuccess: (data) => {
            getInstructions.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Instructions yangilandi.");
        }
    })

    const updateInstructionsData = (id) => {
        setId(id);
        Instructions.find((type) => {
            if (type.id === id) {
                setTitleUz(type.title_uz);
                setTitleRu(type.title_ru);
                setTitleEng(type.title_eng);
                setDescriptionUz(type.description_uz);
                setDescriptionEng(type.description_eng);
                setDescriptionRu(type.description_ru);
                setTypeOfInstructionsId(type.typeOfProductId);
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteInstructionsRequestRequest = useRequest({
        url: `/Instructions`, method: "delete", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: {}, onSuccess: (data) => {
            getInstructions.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("Instructions o'chirildi.");
        },
    });

    const deleteInstructionsRequest = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteInstructionsRequestRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitInstructionsData = async (e) => {
        e.preventDefault();

        if (!updateUser) {
            await addInstructions.doRequest();
            setOnSuccessMsg(null);
        } else {
            await updateInstructionsRequest.doRequest(id);
        }
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    return (<React.Fragment>
        {getInstructions.loading ? <Loading/> : null}
        {addInstructions.loading ? <Loading/> : null}
        {deleteInstructionsRequest.loading ? <Loading/> : null}
        {addInstructions.errors ? <Notification message={addInstructions.errors} status={"error"}/> : null}
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
                                getInstructions.doRequest();
                            }}
                        >
                            Instructions List
                        </button>
                    </div>
                    <div
                        className={      //   getUser.doRequest();
                            !createUser ? "right-section-control" : "right-section-control active"}
                    >
                        <button onClick={() => {
                            setCreateUser(true);
                        }}>{"Add Instructions"}</button>
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
                                {typesOfInstructions.map(type => (
                                    <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Table
                        headers={["Title Uz", "Title Eng", "Title Ru", "Description Uz", "Description Eng", "Description Ru", "Address Uz", "Address Eng", "Address Ru", "Price", "Phone", "See On Map", "Edit", "Delete"]}
                    >
                        {Instructions.map((n) => (<TableRow
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
                                {n.phone}
                            </TableCell>
                            <TableCell align="left">
                                {n.price}
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
                                    onClick={() => updateInstructionsData(n.id)}
                                    style={{cursor: "pointer"}}
                                />
                            </TableCell>
                            <TableCell align="left" style={{color: "red"}}>
                                <DeleteOutlineOutlinedIcon
                                    onClick={() => deleteInstructionsRequest(n.id)}
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
                    <form onSubmit={onSubmitInstructionsData}>
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
                                        {typesOfInstructions.map(type => (
                                            <MenuItem value={type.id} key={type.id}>{type.title}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{margin: "20px 0"}}>
                            <LoadingButton
                                className="btn"
                                loading={addInstructions.loading}
                                type="submit"
                                variant="contained"
                            >
                                {updateUser ? "Save Changes" : "Create Instructions"}
                            </LoadingButton>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    </React.Fragment>);
};

export default Instructions;
