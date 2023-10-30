import React, {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {
    FormControl,
    MenuItem,
    Select,
    TableCell,
    TableRow,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Loading from "../../components/Loading/Loading";

const News = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [titleUz, setTitleUz] = useState("");
    const [titleRu, setTitleRu] = useState("");
    const [titleEng, setTitleEng] = useState("");
    const [descriptionUz, setDescriptionUz] = useState("");
    const [descriptionRu, setDescriptionRu] = useState("");
    const [descriptionEng, setDescriptionEng] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");
    const [confirmedValue, setConfirmedValue] = useState("tashkent");
    const [news, setNews] = useState([]);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const newsData = new FormData();

    const handleChangeSorting = (event) => {
        setConfirmedValue(event.target.value);
    };

    useEffect(() => {
        getNews.doRequest();
    }, [confirmedValue]);
    const getNews = useRequest({
        url: `/news?lang=all`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setNews(data.data);
        },
    });

    const addNews = useRequest({
        url: `/news`,
        method: "post",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        body: newsData,
        onSuccess: (data) => {
            getNews.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("News yaratildi.");
        },
    });

    const deleteNewsRequest = useRequest({
        url: `/news`,
        method: "delete",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        body: newsData,
        onSuccess: (data) => {
            getNews.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("News o'chirildi.");
        },
    });

    const deleteNews = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteNewsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitNewsData = async (e) => {
        e.preventDefault();
        newsData.append("title_uz", titleUz);
        newsData.append("title_ru", titleRu);
        newsData.append("title_eng", titleEng);
        newsData.append("description_uz", descriptionUz);
        newsData.append("description_ru", descriptionRu);
        newsData.append("description_eng", descriptionEng);
        newsData.append("link", link);
        newsData.append("photo", image);

        await addNews.doRequest();
    };

    return (
        <React.Fragment>
            {getNews.loading ? <Loading/> : null}
            {addNews.loading ? <Loading/> : null}
            {deleteNews.loading ? <Loading/> : null}
            <div className="profile-container">
                <div className="right-section">
                    <div className="right-section-header">
                        <div
                            className={
                                createUser
                                    ? "right-section-control"
                                    : "right-section-control active"
                            }
                        >
                            <button
                                onClick={() => {
                                    setCreateUser(false);
                                    setUpdateUser(false);
                                    //   getUser.doRequest();
                                }}
                            >
                                News List
                            </button>
                        </div>
                        <div
                            className={
                                !createUser
                                    ? "right-section-control"
                                    : "right-section-control active"
                            }
                        >
                            <button onClick={() => setCreateUser(true)}>{"Add News"}</button>
                        </div>
                    </div>
                    {!createUser ? (
                        <>
                            <Table
                                headers={[
                                    "title_uz",
                                    "title_eng",
                                    "title_ru",
                                    "description_uz",
                                    "description_eng",
                                    "description_ru",
                                    "link",
                                    "image",
                                    "Delete",
                                ]}
                            >
                                {news.map((n) => (
                                    <TableRow
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
                                        <TableCell align="left">{n.description_uz}</TableCell>
                                        <TableCell align="left">{n.description_eng}</TableCell>
                                        <TableCell align="left">{n.description_ru}</TableCell>
                                        <TableCell align="left">{n.link}</TableCell>
                                        <TableCell align="left">
                                            <img
                                                crossorigin="anonymous"
                                                src={`https://user-stat.uz/${n.image}`}
                                                style={{width: "100px"}}
                                            />
                                        </TableCell>
                                        <TableCell align="left" style={{color: "red"}}>
                                            <DeleteOutlineOutlinedIcon
                                                onClick={() => deleteNews(n.id)}
                                                style={{cursor: "pointer"}}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </>
                    ) : (
                        <div className="right-section-details">
                            <form onSubmit={onSubmitNewsData}>
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
                                <div className="detail">
                                    <label>Description Uz</label>
                                    <textarea
                                        type={"text"}
                                        value={descriptionUz}
                                        onChange={(e) => setDescriptionUz(e.target.value)}
                                        required={true}
                                        style={{height: "100px"}}
                                    ></textarea>
                                </div>
                                <div className="detail">
                                    <label>Description Eng</label>
                                    <textarea
                                        type={"text"}
                                        value={descriptionEng}
                                        onChange={(e) => setDescriptionEng(e.target.value)}
                                        required={true}
                                        style={{height: "100px"}}
                                    ></textarea>
                                </div>
                                <div className="detail">
                                    <label>Description Ru</label>
                                    <textarea
                                        type={"text"}
                                        value={descriptionRu}
                                        onChange={(e) => setDescriptionRu(e.target.value)}
                                        required={true}
                                        style={{height: "100px"}}
                                    ></textarea>
                                </div>
                                <div className="detail">
                                    <label>Link</label>
                                    <input
                                        type={"text"}
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
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
                                        loading={addNews.loading}
                                        type="submit"
                                        variant="contained"
                                    >
                                        {updateUser ? "Save Changes" : "Create News"}
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default News;