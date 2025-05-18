import { useState } from "react";
import api from "@/api/config/axios";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");

  const request = async (method, url, data = {}) => {
    setLoading(true);
    setError({});
    setMessage("");

    try {
      const res = await api({ method, url, data });
      setMessage(res.data.message);
      return res?.data;
    } catch (err) {
      const res = err.response;
      setError(res?.data?.error || {});
      setMessage(res?.data?.message || "Something went wrong");
      return res?.data;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error, message };
};
