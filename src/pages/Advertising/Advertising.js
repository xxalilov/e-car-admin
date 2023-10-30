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

const advertisings = () => {
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");
    const [confirmedValue, setConfirmedValue] = useState("tashkent");
    const [advertisings, setAdvertisings] = useState([]);

    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    const advertisingsData = new FormData();

    useEffect(() => {
        getAdvertisings.doRequest();
    }, [confirmedValue]);
    const getAdvertisings = useRequest({
        url: `/advertising`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setAdvertisings(data.data);
        },
    });

    const addAdvertisings = useRequest({
        url: `/advertising`,
        method: "post",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        body: advertisingsData,
        onSuccess: (data) => {
            getAdvertisings.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("advertisings yaratildi.");
        },
    });

    const deleteAdvertisingsRequest = useRequest({
        url: `/advertising`,
        method: "delete",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        body: advertisingsData,
        onSuccess: (data) => {
            getAdvertisings.doRequest();
            setCreateUser(false);
            setOnSuccessMsg("advertisings o'chirildi.");
        },
    });

    const deleteAdvertisings = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteAdvertisingsRequest.doRequest(id);
            setOnSuccessMsg(null);
        }
    };

    const onSubmitAdvertisingsData = async (e) => {
        e.preventDefault();
        advertisingsData.append("link", link);
        advertisingsData.append("photo", image);

        await addAdvertisings.doRequest();
    };

    return (
        <React.Fragment>
            {getAdvertisings.loading ? <Loading/> : null}
            {addAdvertisings.loading ? <Loading/> : null}
            {deleteAdvertisings.loading ? <Loading/> : null}
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
                                Advertisings List
                            </button>
                        </div>
                        <div
                            className={
                                !createUser
                                    ? "right-section-control"
                                    : "right-section-control active"
                            }
                        >
                            <button onClick={() => setCreateUser(true)}>{"Add advertisings"}</button>
                        </div>
                    </div>
                    {!createUser ? (
                        <>
                            <Table
                                headers={[
                                    "link",
                                    "image",
                                    "Delete",
                                ]}
                            >
                                {advertisings.map((n) => (
                                    <TableRow
                                        key={n.id}
                                        sx={{
                                            "&:last-child td, &:last-child th": {
                                                border: 0,
                                            },
                                        }}
                                    >
                                        <TableCell align="left">{n.link}</TableCell>
                                        <TableCell align="left">
                                            <img
                                                // crossorigin="anonymous"
                                                src={`http://localhost:3000/${n.photo}`}
                                                style={{width: "100px"}}
                                            />
                                        </TableCell>
                                        <TableCell align="left" style={{color: "red"}}>
                                            <DeleteOutlineOutlinedIcon
                                                onClick={() => deleteAdvertisings(n.id)}
                                                style={{cursor: "pointer"}}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </>
                    ) : (
                        <div className="right-section-details">
                            <form onSubmit={onSubmitAdvertisingsData}>
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
                                        loading={addAdvertisings.loading}
                                        type="submit"
                                        variant="contained"
                                    >
                                        {updateUser ? "Save Changes" : "Create advertisings"}
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

export default advertisings;