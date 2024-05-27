import axios from "axios";

export const LoginAPI = async (email, password, user_type = 4) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "user/login";

  const data = {
    email: email,
    password: password,
    user_type: user_type,
  };

  const config = {
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return { status: true, message: response.message, data: response.data };
    })
    .catch((error) => {
      return { status: false, message: error, data: [] };
    });
};
