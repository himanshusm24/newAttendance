"use client";
import React, { useState, useEffect } from "react";
import "../../../theme2.css";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Grid from "@mui/material/Unstable_Grid2";
import { FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";

import AddProject from "./addProject";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
// import DynamicOffCanvas from "@/components/searchFilter/page";

const ListProject = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectStatusData, setProjectStatusData] = useState([]);

  const [openAddProject, setOpenAddProject] = useState(false);
  const todayDate = new Date();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const projectList = async () => {
    const data = await sendRequest(
      "get",
      "api/getProject",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjectData(data?.data?.data);
  };

  const projectSearch = async () => {
    const data = await sendRequest(
      "get",
      `api/getProjectSearch?projectName=${projectName}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    setProjectData(data?.data?.data);
  };

  useEffect(() => {
    projectList();
    handleProjectStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const deleteMainProject = async (id) => {
    const data = await sendRequest(
      "put",
      `api/deleteMainProject/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      await projectList();
    }
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure ? This will delete all its subtask too.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            // console.log(id);
            deleteMainProject(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleProjectStatus = async () => {
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

  const filterProjectStatus = async (e) => {
    const projectStatus = e.target.value;
    const data = await sendRequest(
      "get",
      `api/getProject?projectStatus=${projectStatus}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjectData(data?.data?.data);
  };

  const handleAddEvent = async (data) => {
    // console.log("data: ", data);
    setOpenAddProject(!openAddProject);
    document.getElementById("my_modal_3").showModal();
  };
  // console.log("openAddProject: ", openAddProject);

  const handleCloseModal = async (data) => {
    // console.log("data: ", data);
    // if (data) {
    //   setSuccessMsg("Project created");
    //   await projectList();
    //   await onDataArrived();
    // }
  };

  function onDataArrived(data) {
    console.log("data: ", data);
    var closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.click();
    }
  }

  const allReset = async() => {
    setProjectStatusData("In Progress");
  }

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
          <div className="web-wrapper">
            <BreadCrum
              breadcumr1={"Manage Project"}
              breadcumr1_link={"/admin/projects/listProject"}
              breadcumr2={"List"}
            />

            <section className="projects">
              <Grid container spacing={2}>
                <Grid item md={8} xs={8}>
                  <div className="join search-bar">
                    <button className="join-item">
                      <FaSearch />
                    </button>
                    <input className="join-item" placeholder="Search..." />
                    <button className="join-item">
                      <FaTimesCircle />
                    </button>
                  </div>
                </Grid>
                <Grid item md={4} xs={4}>
                  <select
                    className="select w-full"
                    onChange={filterProjectStatus}
                  >
                    {projectStatusData.map((res) => (
                      <option
                        key={res.project_status}
                        value={res.project_status}
                      >
                        {res.project_status}
                      </option>
                    ))}
                  </select>
                </Grid>
              </Grid>
                  <button className="btn web-btn">Reset</button>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div className="flex align-center justify-between mb-4">
                    <h2 className="page-title mb-0">All Projects</h2>
                    <button
                      className="btn web-btn btn-sm "
                      onClick={handleAddEvent}
                    >
                      {/* <FaPlus /> */}
                      Add Project
                    </button>
                  </div>
                  <div className="project-list">
                    {projectData?.map((task, index) => {
                      const endDate = moment(task.endDate);
                      const today = moment(todayDate);
                      const delayInDays = today.diff(endDate, "days");
                      return (
                        <div key={task.task_id} className="box">
                          <button
                            className="btn btn-error btn-sm delete-btn"
                            onClick={(e) => deletConfirmation(task.project_id)}
                          >
                            <FaTrashAlt />
                          </button>
                          <Link
                            href={`/admin/projects/projectDetails?project_id=${task.project_id}`}
                          >
                            <Image
                              src="/img/project.png"
                              width="50"
                              height="50"
                            />
                            <div className="content">
                              <h2 className="title">{task?.project_name}</h2>
                              <div className="date">
                                <p>
                                  Start Date <br />
                                  <b>
                                    {moment(task?.startDate).format(
                                      "DD MMMM YYYY"
                                    ) == "Invalid date"
                                      ? "NA"
                                      : moment(task?.startDate).format(
                                          "DD MMMM YYYY"
                                        )}
                                  </b>
                                </p>
                                <p className="sub-project-p-mobile">
                                  Due Date <br />
                                  <b>
                                    {moment(task?.endDate).format(
                                      "DD MMMM YYYY"
                                    ) == "Invalid date"
                                      ? "NA"
                                      : moment(task?.endDate).format(
                                          "DD MMMM YYYY"
                                        )}
                                  </b>
                                </p>
                                <p>
                                  Delay <br />
                                  <b>
                                    {" "}
                                    {delayInDays > 0
                                      ? delayInDays + " Days"
                                      : "On Time"}
                                  </b>
                                </p>
                                <p className="sub-project-p-mobile">
                                  Status <br />
                                  <span className="badge bg-danger">
                                    {task?.projectStatus || "NA"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </Grid>
              </Grid>
            </section>

            {openAddProject == true ? (
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button id="closeButton">✕</button>
                  </form>
                  <AddProject closeModal={handleCloseModal} />
                </div>
              </dialog>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProject;
