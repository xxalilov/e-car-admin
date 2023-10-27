import React, { useContext, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import useRequest from "../../hooks/use-request";
import AuthContext from "../../store/auth-context";
import Loading from "../../components/Loading/Loading";
import Notification from "../../components/Notifications/Notification";
import "./profile.css";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [editPassword, setEditPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [reapetPassword, setReapetPassword] = useState("");
  const [onSuccessMsg, setOnSuccessMsg] = useState(null);

  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    getUser.doRequest();
  }, []);

  const getUser = useRequest({
    url: "/auth/user",
    method: "get",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    onSuccess: (data) => {
      setName(data.data.name);
      setEmail(data.data.email);
      setProvince(data.data.province);
      setId(data.data.id);
      setRole(data.data.role);
    },
  });

  const updateUserDetails = useRequest({
    url: `/users/${id}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    body: { name, email, province },
    onSuccess: (data) => {
      setOnSuccessMsg("Foydalanuvchi ma'lumotlari o'zgartirildi");
    },
  });

  const updateUserPassword = useRequest({
    url: `/users/${id}`,
    method: "put",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    body: {
      currentPassword,
      password,
      reapetPassword,
    },
    onSuccess: (data) => {
      setCurrentPassword("");
      setPassword("");
      setReapetPassword("");
      setOnSuccessMsg("Foydalanuvchi paroli o'zgartirildi");
    },
  });

  const onSubmitUpdateUserDetails = async (e) => {
    e.preventDefault();
    setOnSuccessMsg(null);
    await updateUserDetails.doRequest();
  };

  const onSubmitChangePassword = async (e) => {
    e.preventDefault();
    setOnSuccessMsg(null);
    await updateUserPassword.doRequest();
  };

  return (
    <React.Fragment>
      {getUser.loading ? <Loading /> : null}
      <div className="notification-container">
        {updateUserPassword.errors && (
          <Notification status={"error"} message={updateUserPassword.errors} />
        )}
        {updateUserDetails.errors && (
          <Notification status={"error"} message={updateUserDetails.errors} />
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
                editPassword
                  ? "right-section-control"
                  : "right-section-control active"
              }
            >
              <button onClick={() => setEditPassword(false)}>
                {t("editDetails")}
              </button>
            </div>
            <div
              className={
                !editPassword
                  ? "right-section-control"
                  : "right-section-control active"
              }
            >
              <button onClick={() => setEditPassword(true)}>
                {t("changePassword")}
              </button>
            </div>
          </div>
          {!editPassword ? (
            <div className="right-section-details">
              <form onSubmit={onSubmitUpdateUserDetails}>
                <div className="detail">
                  <label>{t("fullName")}</label>
                  <input
                    type={"text"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="detail">
                  <label>{t("email")}</label>
                  <input
                    type={"text"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {role && role === "admin" ? (
                  <div className="detail">
                    <label>Province</label>
                    <input
                      type={"text"}
                      value={province}
                      disabled
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </div>
                ) : null}
                <div style={{ margin: "20px 0" }}>
                  <LoadingButton
                    loading={updateUserDetails.loading}
                    variant="contained"
                    type="submit"
                  >
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            </div>
          ) : (
            <div className="right-section-details">
              <form onSubmit={onSubmitChangePassword}>
                <div className="detail">
                  <label>{t("currentPassword")}</label>
                  <input
                    type={"password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(String(e.target.value))}
                    required
                  />
                </div>
                <div className="detail">
                  <label>{t("newPassword")}</label>
                  <input
                    type={"password"}
                    value={password}
                    onChange={(e) => setPassword(String(e.target.value))}
                    required
                  />
                </div>
                <div className="detail">
                  <label>{t("reapetPass")}</label>
                  <input
                    type={"password"}
                    value={reapetPassword}
                    onChange={(e) => setReapetPassword(String(e.target.value))}
                    required
                  />
                </div>
                <div style={{ margin: "20px 0" }}>
                  <LoadingButton
                    className="btn"
                    loading={updateUserPassword.loading}
                    type="submit"
                    variant="contained"
                  >
                    Save Changes
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

export default Profile;
