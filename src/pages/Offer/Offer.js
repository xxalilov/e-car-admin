import React, {useContext, useEffect, useState} from "react";
import {
    TableCell,
    TableRow,
} from "@mui/material";
import Table from "../../components/Table/Table";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Loading from "../../components/Loading/Loading";
import Pagination from "../../components/Pagination/Pagination";

const Offer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [allPages, setAllPages] = useState(0);
    const [offers, setOffers] = useState([]);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        getOffer.doRequest();
    }, [currentPage]);

    const getOffer = useRequest({
        url: `/offers?pageSize=10&page=${currentPage}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${authCtx.token}`,
        },
        onSuccess: (data) => {
            setCount(data.totalCount);
            setAllPages(data.totalPages);
            setCurrentPage(data.page)
            setOffers(data.data);
        },
    });

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };


    return (
        <React.Fragment>
            {getOffer.loading ? <Loading/> : null}
            <div className="profile-container">
                <div className="right-section">
                        <>
                            <Table
                                headers={[
                                    "text",
                                    "userId",
                                ]}
                            >
                                {offers.map((n) => (
                                    <TableRow
                                        key={n.id}
                                        sx={{
                                            "&:last-child td, &:last-child th": {
                                                border: 0,
                                            },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {n.text}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {n.userId}
                                        </TableCell>
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
                        </>

                </div>
            </div>
        </React.Fragment>
    );
};

export default Offer;