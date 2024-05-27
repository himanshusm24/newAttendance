"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import showAlert from "@/api_calls/alert/alert";

const UserType = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [btnName, setBtnName] = useState("Add UserType");
  const [userTypeList, setUserTypeList] = useState([]);
  const [userTypeName, setUserTypeName] = useState("");
  const router = useRouter();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const addUserType = async (e) => {
    e.preventDefault();
    const data = await sendRequest(
      "post",
      "api/user-type",
      { name: userTypeName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      showAlert("success", "User type added");
      await getAllUserType();
    }
  };

  const getAllUserType = async () => {
    const data = await sendRequest(
      "get",
      "api/user-type",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserTypeList(data.data.data);
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    getAllUserType();
    //   } catch (error) {
    //     console.error("Error fetching user types:", error);
    //   }
    // };
    // fetchData();
  }, []);

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
            breadcumr1={"Manage User type"}
            breadcumr1_link={"/admin/usertype"}
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
                          setUserTypeName(e.target.value);
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

              <div className="card-body p-0 pt-4">
                {userTypeList && userTypeList.length > 0 ? (
                  <table className="w-full divide-y divide-gray-400 p-2">
                    <thead className="bg-gray-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                        >
                          <span>Name</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {userTypeList.map((res, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap text-center px-4 py-4">
                            {res.name}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                            <button
                              className="btn btn-sm btn-warning"
                              //   onClick={(e) => getRolesById(res.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-secondary ml-2"
                              onClick={() =>
                                router.push(
                                  `/admin/manage-permissions?id=${res.id}&name=${res.name}`
                                )
                              }
                            >
                              Set Permission
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="divide-y divide-gray-200 bg-white text-center p-4">
                    <h1>List is Empty</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserType;
