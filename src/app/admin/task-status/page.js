"use client";
import React, { useEffect, useState } from "react";
import "../../theme2.css";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const Page = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [projectStatus, setProjectStatus] = useState("");
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [editStatusId, setEditStatusId] = useState(0);
  const [btnName, setBtnName] = useState("Add");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const addStatus = async (e) => {
    e.preventDefault();
    const sendData = {
      project_status: projectStatus,
    };

    const response =
      editStatusId > 0
        ? await sendRequest(
            "put",
            `api/editProjectStatus/${editStatusId}`,
            sendData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await sendRequest("post", "api/addProjectStatus", sendData, {
            headers: { Authorization: `Bearer ${token}` },
          });

    if (response.status == 1) {
      setEditStatusId(0);
      setSuccessMsg("Status added");
      setBtnName("Add");
      setProjectStatus("");
      await allStatus();
    }
  };

  const allStatus = async () => {
    const data = await sendRequest(
      "get",
      "api/getProjectStatus",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjectStatusData(data.data.data);
  };

  const getStatusById = async (editStatusId) => {
    const data = await sendRequest(
      "get",
      `api/getProjectStatus?id=${editStatusId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    setBtnName("Update");
    setEditStatusId(data.data.data[0].id);
    setProjectStatus(data.data.data[0].project_status);
  };

  const deleteStatus = async (id) => {
    const data = await sendRequest(
      "put",
      `api/deleteProjectStatus/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      setSuccessMsg("Data Deleted");
      await allStatus();
    }
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            deleteStatus(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  useEffect(() => {
    const successTimer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);

    const errorTimer = setTimeout(() => {
      setErrorMsg(null);
    }, 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [successMsg, errorMsg]);

  useEffect(() => {
    allStatus();
  }, []);

  return (
    <>
      <div className="main-wrapper">
        <Sidebar
          sidemenu={`${
            isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"
          }`}
        />

        <div className="rightside">
          <Header
            clickEvent={() => {
              setSidebarVisible(!isSidebarVisible);
            }}
            sidebarVisible={isSidebarVisible}
          />

          <section className="web-wrapper">
            <BreadCrum
              breadcumr1={"Manage Status"}
              breadcumr1_link={"#"}
              // breadcumr2={"List"}
              // button_name={"Add Tasks"}
              // button_link={"/admin/tasks/add-tasks"}
            />

            <div className="projects task-status">
              {successMsg != "" && successMsg != null ? (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
                  role="success"
                >
                  <span className="block sm:inline">{successMsg}</span>
                </div>
              ) : (
                ""
              )}

              {errorMsg != "" && errorMsg != null ? (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{errorMsg}</span>
                </div>
              ) : (
                ""
              )}
              <form onSubmit={addStatus} method="post" autoComplete="off">
                <div className="grid xl:grid-cols-8 lg:grid-cols-6 grid-cols-3 items-end gap-4">
                  <div className="form-group col-span-2">
                    <label className="label-text">Status</label>
                    <input
                      type="text"
                      placeholder="Status Name"
                      className="form-control"
                      name="name"
                      required={true}
                      onChange={(e) => {
                        setProjectStatus(e.target.value);
                      }}
                      value={projectStatus}
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn web-btn">
                      {btnName}
                    </button>
                  </div>
                </div>
              </form>

              {projectStatusData && projectStatusData.length > 0 ? (
                <div className="project-list grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-4 gap-y-0 md:mt-5 mt-3">
                  {projectStatusData?.map((res, index) => (
                    <div className="box" key={index}>
                      <button
                        className="btn web-btn btn-sm edit-btn"
                        onClick={(e) => getStatusById(res.id)}
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-error btn-sm delete-btn"
                        onClick={(e) => {
                          deletConfirmation(res.id);
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                      <div className="content">
                        <div className="date">
                          <p>
                            Status <br />
                            <b>{res.project_status}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 bg-white text-center p-4">
                  <h1>List is Empty</h1>
                </div>
              )}

              {/* {projectStatusData && projectStatusData.length > 0 ? (
                <table className="w-full divide-y divide-gray-400 p-2">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                      >
                        <span>Status</span>
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
                    {projectStatusData?.map((res, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap text-center px-4 py-4">
                          {res.project_status}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={(e) => getStatusById(res.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error ml-2"
                            onClick={(e) => {
                              deletConfirmation(res.id);
                            }}
                          >
                            Delete
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
              )} */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;
