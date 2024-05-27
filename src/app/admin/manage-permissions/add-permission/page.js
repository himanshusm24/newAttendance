"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Checkbox from "@mui/material/Checkbox";
import { sendRequest } from "@/api_calls/sendRequest";
import { ToastContainer } from "react-toastify";
import showAlert from "@/api_calls/alert/alert";
import { useRouter } from "next/navigation";

const Permissions = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [permission_type, setPermissionType] = useState("");
  const [btnName, setBtnName] = useState("Add Permission");
  const router = useRouter();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const addUserType = async (e) => {
    e.preventDefault();
    const data = await sendRequest(
      "post",
      "api/permission",
      { permission_type: permission_type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    showAlert("success", "Permission added successfully");
    router.push("/admin/manage-usertype");
  };

  return (
    <div className="main-wrapper">
      <ToastContainer />
      <Sidebar
        sidemenu={`${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}
      />
      <div className="rightside">
        <Header
          clickEvent={() => {
            setSidebarVisible(!isSidebarVisible);
          }}
          sidebarVisible={isSidebarVisible}
        />

        <section className="mx-auto w-full">
          <BreadCrum
            breadcumr1={"Add Permissions"}
            breadcumr1_link={"/admin/manage-permissions"}
          />

          <div className="mt-3">
            <div className="card">
              <div className="card-body bg-white py-2">
                <form onSubmit={addUserType} method="post" autoComplete="off">
                  <div className="gap-2 grid md:grid-cols-2 md:space-y-0">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Name</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Name"
                        className="input input-bordered w-full"
                        name="name"
                        //   minLength={5}
                        //   maxLength={15}
                        required={true}
                        onChange={(e) => {
                          setPermissionType(e.target.value);
                        }}
                        //   value={roleName}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <button
                      type="submit"
                      className="btn web-btn text-white sm:mt-0 md:mt-4"
                    >
                      {btnName}
                    </button>
                    <button
                      type="reset"
                      className="btn btn-warning mx-5 px-8"
                      //   onClick={() => resetInputs()}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Permissions;
