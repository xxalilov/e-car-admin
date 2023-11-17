import React, { useContext, useEffect, useState } from "react";
// import { Navigate, Route, Router } from "react-router-dom";
// import useRequest from "../../hooks/use-request";
// import AuthContext from "../../store/auth-context";
import Layout from "../../components/Layout/Layout";
import Profile from "../Profile/Profile";
import User from "../Users/User";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useRequest from "../../hooks/use-request";
import Loading from "../../components/Loading/Loading";
import TypeOfProduct from "../TypeOfProducts/TypeOfProduct";
import TypeOfWorkshop from "../TypeOfWorkshops/TypeOfWorkshop";
import Workshop from "../Workshop/Workshop";
import News from "../News/News";
import Advertising from "../Advertising/Advertising";
import Stations from "../Stations/Stations";
import Products from "../Products/Products";
import Instruction from "../Instructions/Instruction";
import Shipping from "../Shipping/Shipping";
import Offer from "../Offer/Offer";
import Admin from "../Admins/Admin";
import Order from "../Orders/Order";

const Main = () => {
  const [role, setRole] = useState(null);
  const authCtx = useContext(AuthContext);

  const { loading, doRequest, errors } = useRequest({
    url: `/auth/user`,
    method: "get",
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
    onSuccess: (data) => {
      setRole(data.data.role);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);
  return (
    <React.Fragment>
      {loading && <Loading />}
      <Layout role={role}>
        <Routes>
          {role === "superadmin" && <Route path="/users" element={<User />} />}
          {role === "superadmin" && <Route path="/admins" element={<Admin />} />}
          <Route path="/type-of-products" element={<TypeOfProduct />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/type-of-workshops" element={<TypeOfWorkshop />} />
          <Route path="/workshops" element={<Workshop />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/news" element={<News />} />
          <Route path="/advertisings" element={<Advertising />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/instructions" element={<Instruction />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<Navigate to="/orders" />} />
        </Routes>
      </Layout>
    </React.Fragment>
  );
};

export default Main;
