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


const  models = [
    {
        "id": 142,
        "car_brand": 12,
        "name": "Menlo",
        "image": null
    },
    {
        "id": 141,
        "car_brand": 12,
        "name": "Volt",
        "image": null
    },
    {
        "id": 140,
        "car_brand": 12,
        "name": "Van",
        "image": null
    },
    {
        "id": 139,
        "car_brand": 12,
        "name": "Traverse",
        "image": null
    },
    {
        "id": 138,
        "car_brand": 12,
        "name": "TrailBlazer",
        "image": null
    },
    {
        "id": 137,
        "car_brand": 12,
        "name": "Tracker",
        "image": {
            "id": 89204,
            "name": "Tracker",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/fa34692d-3173-4a21-b0f8-c2b201a6a3b6.png"
        }
    },
    {
        "id": 136,
        "car_brand": 12,
        "name": "Tavera",
        "image": null
    },
    {
        "id": 135,
        "car_brand": 12,
        "name": "Tahoe",
        "image": null
    },
    {
        "id": 134,
        "car_brand": 12,
        "name": "Tacuma",
        "image": null
    },
    {
        "id": 133,
        "car_brand": 12,
        "name": "Spark",
        "image": {
            "id": 89203,
            "name": "Spark",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/541ce1cd-1a76-46bf-bcf9-ddf6a0376e49.png"
        }
    },
    {
        "id": 132,
        "car_brand": 12,
        "name": "Orlando",
        "image": null
    },
    {
        "id": 131,
        "car_brand": 12,
        "name": "Optra",
        "image": null
    },
    {
        "id": 130,
        "car_brand": 12,
        "name": "Niva",
        "image": null
    },
    {
        "id": 129,
        "car_brand": 12,
        "name": "Nexia 3",
        "image": {
            "id": 89202,
            "name": "Nexia 3",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/03691d1a-83f5-4994-8b0d-23cce5f6e952.png"
        }
    },
    {
        "id": 128,
        "car_brand": 12,
        "name": "Nexia 2",
        "image": {
            "id": 89201,
            "name": "Nexia 2",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/c5263e3f-e2ed-4cd0-8505-ce28986666a9.png"
        }
    },
    {
        "id": 127,
        "car_brand": 12,
        "name": "Nexia",
        "image": {
            "id": 89200,
            "name": "Nexia",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/11ec508f-e0bf-42b1-a20f-c11105677d76.png"
        }
    },
    {
        "id": 126,
        "car_brand": 12,
        "name": "Matiz Best",
        "image": null
    },
    {
        "id": 125,
        "car_brand": 12,
        "name": "Matiz",
        "image": {
            "id": 89199,
            "name": "Matiz",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/3b114912-0ccc-45d3-8da2-55836dc57b37.png"
        }
    },
    {
        "id": 124,
        "car_brand": 12,
        "name": "Malibu 2",
        "image": {
            "id": 89198,
            "name": "Malibu 2",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/70128e28-af36-42c5-b963-37fca7b7de98.png"
        }
    },
    {
        "id": 123,
        "car_brand": 12,
        "name": "Malibu",
        "image": {
            "id": 89197,
            "name": "Malibu",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/dfab245f-b318-4b8f-964d-a3be129d8578.png"
        }
    },
    {
        "id": 122,
        "car_brand": 12,
        "name": "Lumina",
        "image": null
    },
    {
        "id": 121,
        "car_brand": 12,
        "name": "Lanos",
        "image": null
    },
    {
        "id": 120,
        "car_brand": 12,
        "name": "Gentra",
        "image": {
            "id": 89196,
            "name": "Gentra",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/6a838ee0-cf1d-4a27-859b-d25ae0ff2aa1.png"
        }
    },
    {
        "id": 119,
        "car_brand": 12,
        "name": "Lacetti",
        "image": {
            "id": 89195,
            "name": "Lacetti",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/89b2449b-0720-4569-b7d1-6eb413ed1119.png"
        }
    },
    {
        "id": 118,
        "car_brand": 12,
        "name": "Labo",
        "image": null
    },
    {
        "id": 117,
        "car_brand": 12,
        "name": "Impala",
        "image": null
    },
    {
        "id": 116,
        "car_brand": 12,
        "name": "Equinox",
        "image": null
    },
    {
        "id": 115,
        "car_brand": 12,
        "name": "Epica",
        "image": null
    },
    {
        "id": 114,
        "car_brand": 12,
        "name": "Damas",
        "image": {
            "id": 89194,
            "name": "Damas",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/f0f109c8-4840-42e3-adf6-28566b76947b.png"
        }
    },
    {
        "id": 113,
        "car_brand": 12,
        "name": "Cruze",
        "image": null
    },
    {
        "id": 112,
        "car_brand": 12,
        "name": "Corsica",
        "image": null
    },
    {
        "id": 111,
        "car_brand": 12,
        "name": "Cobalt",
        "image": {
            "id": 89193,
            "name": "Cobalt",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/125a7e7f-dae6-4c83-a508-fca331db8204.png"
        }
    },
    {
        "id": 110,
        "car_brand": 12,
        "name": "Celta",
        "image": null
    },
    {
        "id": 109,
        "car_brand": 12,
        "name": "Cavalier",
        "image": null
    },
    {
        "id": 108,
        "car_brand": 12,
        "name": "Captiva",
        "image": {
            "id": 89192,
            "name": "Captiva",
            "file": "https://cdn.road24.uz/media/file/image/2021-08/6dfed397-1140-45d6-b0b4-b371d63697ad.png"
        }
    },
    {
        "id": 107,
        "car_brand": 12,
        "name": "Caprice",
        "image": null
    },
    {
        "id": 106,
        "car_brand": 12,
        "name": "Camaro",
        "image": null
    },
    {
        "id": 105,
        "car_brand": 12,
        "name": "Aveo",
        "image": null
    },
    {
        "id": 104,
        "car_brand": 12,
        "name": "Astro",
        "image": null
    },
    {
        "id": 103,
        "car_brand": 12,
        "name": "Alero",
        "image": null
    }
]


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
    const [photo, setPhoto] = useState("");
    const [Instructions, setInstructions] = useState([]);
    const [id, setId] = useState(null);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const instructuinsData = new FormData();

    const handleChangeSorting = (event) => {
        setConfirmedValue(event.target.value);
        setTypeId(event.target.value);
    };

    useEffect(() => {
        getInstructions.doRequest();
    }, [currentPage]);
    const getInstructions = useRequest({
        url: `/instruction?pageSize=10&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
            setInstructions(data.data);
        },
    });

    const addInstructions = useRequest({
        url: `/instruction`, method: "post", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: instructuinsData, onSuccess: (data) => {
            getInstructions.doRequest();
            setCreateUser(false);
            setUpdateUser(false);
            setOnSuccessMsg("Instructions yaratildi.");
        }
    });

    const updateInstructionsRequest = useRequest({
        url: `/instruction`, method: "put", headers: {
            Authorization: `Bearer ${authCtx.token}`,
        }, body: instructuinsData, onSuccess: (data) => {
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
                setLink(type.link);
                setTypeId(type.typeId);
                setType(type.type)
            }
        });
        setUpdateUser(true);
        setCreateUser(true);
    };

    const deleteInstructionsRequestRequest = useRequest({
        url: `/instruction`, method: "delete", headers: {
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

        instructuinsData.append("title_uz", title_uz);
        instructuinsData.append("title_ru", title_ru);
        instructuinsData.append("title_eng", title_eng);
        instructuinsData.append("description_uz", description_uz);
        instructuinsData.append("description_ru", description_ru);
        instructuinsData.append("description_eng", description_eng);
        instructuinsData.append("type", type);
        instructuinsData.append("typeId", typeId);
        instructuinsData.append("photo", photo);
        instructuinsData.append("link", link);


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
                    <Table
                        headers={["Title Uz", "Title Eng", "Title Ru", "Description Uz", "Description Eng", "Description Ru", "link", "youtube cover", "Edit", "Delete"]}
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
                                {n.link}
                            </TableCell>
                            <TableCell align="left">
                                <img
                                    crossOrigin="anonymous"
                                    alt={"image"}
                                    src={`https://user-stat.uz/${n.youtubeCover}`}
                                    style={{width: "100px"}}
                                />
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
                        <div className="detail">
                            <label>Link</label>
                            <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required={true}
                            />
                        </div>
                        <div className="detail">
                            <label>You Tube Cover</label>
                            <input
                                type={"file"}
                                // value={}
                                onChange={(e) => setPhoto(e.target.files[0])}
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
                                        {models.map(model => (
                                            <MenuItem value={model.id} key={model.id}>{model.name}</MenuItem>
                                        ))}
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
