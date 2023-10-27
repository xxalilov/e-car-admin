import React, { useContext, useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import {
  FormControl,
  MenuItem,
  Select,
  TableCell,
  TableRow,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import useRequest from "../../hooks/use-request";
import AuthContext from "../../store/auth-context";
import { LoadingButton } from "@mui/lab";
import Loading from "../../components/Loading/Loading";
import Notification from "../../components/Notifications/Notification";
import "./user.css";

const User = () => {
  const [createUser, setCreateUser] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("toshkent");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [allPages, setAllPages] = useState(0);
  const [onSuccessMsg, setOnSuccessMsg] = useState(null);
  const authCtx = useContext(AuthContext);

  const handleChangeSorting = (event) => {
    setProvince(event.target.value);
  };

  useEffect(() => {
    getUser.doRequest();
  }, [currentPage]);
  const getUser = useRequest({
    url: `/users?size=${8}&page=${currentPage}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    onSuccess: (data) => {
      setUsers(data.data.content);
      setCurrentPage(data.data.pagination.page);
      setCount(data.data.pagination.allItemsCount);
      setAllPages(data.data.pagination.allPagesCount);
    },
  });

  const addUser = useRequest({
    url: "/users",
    method: "post",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    body: {
      name,
      email,
      province,
      password,
    },
    onSuccess: (data) => {
      getUser.doRequest();
      setCreateUser(false);
      setName("");
      setEmail("");
      setPassword("");
      setProvince("");
      setOnSuccessMsg("Foydalanuvchi yaratildi.");
    },
  });

  const updateUserRequest = useRequest({
    url: `/users/${id}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    body: {
      name,
      email,
      province,
    },
    onSuccess: (data) => {
      setOnSuccessMsg("Foydalanuvchi ma'lumotlari o'zgartirildi");
    },
  });

  const deleteUserRequest = useRequest({
    url: `/users`,
    method: "delete",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    onSuccess: (data) => {
      getUser.doRequest();
      setOnSuccessMsg("Foydalanuvchi mufavaqqiyatli o'chirildi");
    },
  });

  const updateUserData = (id) => {
    setId(id);
    users.find((user) => {
      if (user.id === id) {
        setName(user.name);
        setEmail(user.email);
        setProvince(user.province);
      }
    });
    setUpdateUser(true);
    setCreateUser(true);
  };

  const onSubmitUserData = async (e) => {
    e.preventDefault();
    if (!updateUser) {
      await addUser.doRequest();
      setOnSuccessMsg(null);
    } else {
      await updateUserRequest.doRequest();
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUserRequest.doRequest(id);
      setOnSuccessMsg(null);
    }
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <React.Fragment>
      {getUser.loading ? <Loading /> : null}
      {deleteUserRequest.loading ? <Loading /> : null}
      <div className="notification-container">
        {updateUserRequest.errors && (
          <Notification status={"error"} message={updateUserRequest.errors} />
        )}
        {deleteUserRequest.errors && (
          <Notification status={"error"} message={deleteUserRequest.errors} />
        )}
        {addUser.errors && (
          <Notification status={"error"} message={addUser.errors} />
        )}
        {onSuccessMsg ? (
          <Notification status={"success"} message={onSuccessMsg} />
        ) : null}
      </div>
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
                  getUser.doRequest();
                }}
              >
                Users List
              </button>
            </div>
            <div
              className={
                !createUser
                  ? "right-section-control"
                  : "right-section-control active"
              }
            >
              <button onClick={() => setCreateUser(true)}>
                {updateUser ? "Edit User" : "Create User"}
              </button>
            </div>
          </div>
          {!createUser ? (
            <>
              <Table
                headers={[
                  "Full Name",
                  "Email Address",
                  "Role",
                  "Province",
                  "Edit",
                  "Delete",
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
                      {user.name}
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.role}</TableCell>
                    <TableCell align="left">{user.province}</TableCell>
                    <TableCell
                      align="left"
                      style={{ color: "rgb(62, 147, 251)" }}
                    >
                      <BorderColorOutlinedIcon
                        onClick={() => updateUserData(user.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell align="left" style={{ color: "red" }}>
                      <DeleteOutlineOutlinedIcon
                        onClick={() => deleteUser(user.id)}
                        style={{ cursor: "pointer" }}
                      />
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
          ) : (
            <div className="right-section-details">
              <form onSubmit={onSubmitUserData}>
                <div className="detail">
                  <label>Full Name</label>
                  <input
                    type={"text"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="detail">
                  <label>Email</label>
                  <input
                    type={"text"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="detail">
                  <label>Province</label>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={province}
                      onChange={handleChangeSorting}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"toshkent"}>Toshkent</MenuItem>
                      <MenuItem value={"sirdaryo"}>Sirdaryo</MenuItem>
                      <MenuItem value={"jizzax"}>Jizzax</MenuItem>
                      <MenuItem value={"samarqand"}>Samarqand</MenuItem>
                      <MenuItem value={"qashqadaryo"}>Qashqadaryo</MenuItem>
                      <MenuItem value={"surxandaryo"}>Surxandaryo</MenuItem>
                      <MenuItem value={"navoiy"}>Navoiy</MenuItem>
                      <MenuItem value={"fargona"}>Farg'ona</MenuItem>
                      <MenuItem value={"andijon"}>Andijon</MenuItem>
                      <MenuItem value={"namangan"}>Namangan</MenuItem>
                      <MenuItem value={"buxoro"}>Buxoro</MenuItem>
                      <MenuItem value={"xorazm"}>Xorazm</MenuItem>
                      <MenuItem value={"qoraqalpogiston"}>
                        Qoraqalpog'iston
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {/* <input
                    type={"text"}
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required={true}
                  /> */}
                </div>
                {!updateUser && (
                  <div className="detail">
                    <label>Password</label>
                    <input
                      type={"password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={true}
                    />
                  </div>
                )}
                <div style={{ margin: "20px 0" }}>
                  <LoadingButton
                    className="btn"
                    loading={addUser.loading || updateUserRequest.loading}
                    type="submit"
                    variant="contained"
                  >
                    {updateUser ? "Save Changes" : "Create User"}
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

export default User;
