/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";
// import { LoginAPI } from "@/api_calls/user/login";
import { LoginAPI } from "@/api_calls/admin/login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getAllowedRoles } from "@/api_calls/admin/allowedRoles";
import { getProject } from "@/api_calls/admin/projects/getProject";
import secureLocalStorage from "react-secure-storage";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const admin_login = async (event) => {
    event.preventDefault();

    const response = await LoginAPI(email, password);
    console.log("response: ", response);

    let data = response.data;
    // console.log("data: ", data);

    if (
      (data &&
        data?.data &&
        data?.data?.userTypeName == "Admin" &&
        data?.data?.user_type == "1") ||
      data?.data?.userTypeName == "SuperAdmin"
    ) {
      if (data.status == true) {
        await getAllowedRoles(data.data.user_type, data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_type", data.data.userTypeName);
        localStorage.setItem("user_id", data.data.id);
        localStorage.setItem("user_name", data.data.name);
        localStorage.setItem("admin_email", data.data.email);
        localStorage.setItem("admin_contact", data.data.contact);
        localStorage.setItem("company_name", data.data.company_name);

        const projectdata = await getProject();
        console.log("projectdata: ", projectdata);
        if (projectdata.status == 1) {
          secureLocalStorage.setItem(
            "projectData",
            JSON.stringify(projectdata.data.data)
          );
        }

        router.push("/admin/dashboard");
      } else if (data.status == false) {
        setErrorMsg(data.message);
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg(
        "User not allowed to login. Ask your admin for change permissions"
      );
    }
  };

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    let token = localStorage.getItem("token");
    let admin_id = localStorage.getItem("user_id");
    let user_type = localStorage.getItem("user_type");
    if (user_type == "Admin" && admin_id > 0 && token != "") {
      router.push("/admin/dashboard");
    }
  };

  const forgotRoute = async (event) => {
    event.preventDefault();
    router.push("/auth/forgot-password?userType=admin");
    // router.push("/auth/verify-otp?userType=admin");
  };

  return (
    <section className="min-h-screen bg-[#188389] p-2 login-page ">
      <div className="block items-center justify-center h-full py-12 sm:px-12 sm:py-16 lg:px-8 ">
        <div className="bg-white px-7 py-10 rounded-lg xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          {errorMsg != "" ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
              role="alert"
            >
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          ) : (
            ""
          )}
          <div className="mb-8 flex items-center justify-center">
            {/* <img src="/img/logo.webp" width={180} alt="Image" /> */}
            {/* <img src="/img/7oclockIcon.png" width={120} alt="Image" /> */}
            <img
              src="/img/7oclockIcon.png"
              style={{ width: "140px" }}
              alt="Image"
            />
          </div>

          <h2 className="text-2xl font-bold text-center leading-tight text-[#188389]">
            Admin Login
          </h2>

          <form method="POST" className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    // type="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  <button
                    className="password-toggle-btn absolute inset-y-0 right-0 mt-2 mr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
              <div className="flex items-end mt-1">
                <div className="ml-auto">
                  <a
                    onClick={forgotRoute}
                    title=""
                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={admin_login}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Sign in <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
