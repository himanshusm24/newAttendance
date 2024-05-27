import axios from "axios";

export const LoginAPI = async (email, password) => {
  // const api = process.env.NEXT_PUBLIC_API_URL + "admin/login";
  const api = process.env.NEXT_PUBLIC_API_URL + "user/adminLogin";

  const data = {
    email: email,
    password: password,
    user_type: 1,
  };

  const config = {
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      console.log(response);
      return { status: true, message: response.message, data: response.data };
    })
    .catch((error) => {
      console.log(error);
      return {
        status: false,
        message: "Please Enter a valid Email & Password",
        data: [],
      };
    });
};
