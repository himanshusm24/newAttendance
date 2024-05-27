import axios from "axios";
import { sendRequest } from "../sendRequest";

export const getAllowedRoles = async (id, token) => {
  const data = await sendRequest(
    "get",
    `api/permission/allowedRoles?usertypeId=${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (data.status == 1) {
    localStorage.setItem("allowedRoles", JSON.stringify(data?.data?.data));
  }
};
