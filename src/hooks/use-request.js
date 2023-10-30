import { useState } from "react";
import axios from "axios";

// const uri = "https://navi2.uz.taxi/api/v1";
// const uri = "http://localhost:3000/api/v1";
const uri = "https://user-stat.uz/api/v1";

export default ({ url, method, body, headers, onSuccess, url2 }) => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const doRequest = async (id) => {
    try {
      setErrors(null);

      setLoading(true);
      let response;
      if (url2) {
        if (id) {
          response = await axios({
            method: method,
            url: `${url2}/${id}`,
            data: body,
            headers,
          });
        } else {
          response = await axios({
            method: method,
            url: `${url2}`,
            data: body,
            headers,
          });
        }
      } else {
        if (id) {
          response = await axios({
            method: method,
            url: `${uri}${url}/${id}`,
            data: body,
            headers,
          });
        } else {
          response = await axios({
            method: method,
            url: `${uri}${url}`,
            data: body,
            headers,
          });
        }
      }

      setLoading(false);
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setLoading(false);
      console.log(err.response.data.message);
      setErrors(err.response.data.message);
    }
  };

  return { doRequest, errors, loading };
};
