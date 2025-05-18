import { useApi } from "@/hooks/useApi";
import React, { useEffect } from "react";

export default function Contacts() {
  const { request } = useApi();

  const getContacts = async () => {
    try {
      const response = await request("get", "/contacts");
      console.log(response);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return <div>Contacts</div>;
}
