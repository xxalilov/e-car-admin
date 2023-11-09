import React, {useContext, useEffect, useState} from "react";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import {
    TableCell,
    TableRow,
} from "@mui/material";
import useRequest from "../../hooks/use-request";
import AuthContext from "../../store/auth-context";
import Loading from "../../components/Loading/Loading";
import Notification from "../../components/Notifications/Notification";
import "./user.css";

const User = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
    const [onSuccessMsg, setOnSuccessMsg] = useState(null);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        getUser.doRequest();
    }, [currentPage]);
    const getUser = useRequest({
        url: `/user?pageSize=${8}&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setUsers(data.data);
            setCurrentPage(data.page);
            setCount(data.totalCount);
            setAllPages(data.totalPages);
        },
    });

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <React.Fragment>
            {getUser.loading ? <Loading/> : null}
            <div className="notification-container">
                {onSuccessMsg ? (
                    <Notification status={"success"} message={onSuccessMsg}/>
                ) : null}
            </div>
            <div className="profile-container">
                <div className="right-section">
                    <Table
                        headers={[
                            "First Name",
                            "Last Name",
                            "Phone",
                        ]}
                    >
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.firstname}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.lastname}
                                </TableCell>
                                <TableCell align="left">{user.phone}</TableCell>
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
        </React.Fragment>
    );
};

export default User;
