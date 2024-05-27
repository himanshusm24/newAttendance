/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import "../theme2.css";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";
import Grid from "@mui/material/Unstable_Grid2";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { FaTimesCircle, FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import DynamicOffCanvas from "@/components/searchFilter/page";
import { useRouter } from "next/navigation";
import THeader from "@/components/theader/page";

const Projects = () => {
  const [allocatedProjects, setAllocatedProjects] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [isOpenOffCanvasProjectStatus, setIsOpenOffCanvasProjectStatus] =
    useState(false);
  const todayDate = new Date();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const router = useRouter();

  useEffect(() => {
    handleUserList();
  }, []);

  const handleUserList = async ({
    projectName = "",
    projectStatus = "",
  } = {}) => {
    const userId = localStorage.getItem("user_id");
    let url;
    if (projectName && projectName.length > 0) {
      url = `api/getallocatedProjectUser?userId=${userId}&projectName=${projectName}`;
    } else if (projectStatus && projectStatus.length > 0) {
      url = `api/getallocatedProjectUser?userId=${userId}&projectStatus=${projectStatus}`;
    } else {
      url = `api/getallocatedProjectUser?userId=${userId}`;
    }
    const data = await sendRequest(
      "get",
      url,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedProjects(data?.data?.data);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In progress":
        return "bg-info";
      case "On hold":
      case "NA":
        return "bg-danger";
      case "In review":
        return "bg-primary";
      case "Done":
        return "bg-success";
      default:
        return "bg-default";
    }
  };

  const ProjectStatusList = [
    {
      id: 1,
      type: "projectStatus",
      name: "Open",
    },
    {
      id: 2,
      type: "projectStatus",
      name: "In Progress",
    },
    {
      id: 3,
      type: "projectStatus",
      name: "In Review",
    },
  ];

  const handleCloseProjectStatus = () => {
    setIsOpenOffCanvasProjectStatus(false);
  };

  const handleToggleStatus = () => {
    setIsOpenOffCanvasProjectStatus(!isOpenOffCanvasProjectStatus);
  };

  const handleSearchField = (e) => {
    const searchVal = e.target.value;
    setSearchField(searchVal);

    if (searchVal.length >= 3) {
      handleUserList({ projectName: searchVal });
    }
  };

  const handleProjectStatusDetail = async (data) => {
    await handleUserList({ projectStatus: data.name });
  };

  return (
    <>
      <THeader heading="Projects" routes="/task-home" />
      <div className="projects">
        <div className="container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="join search-bar">
                <button className="join-item">
                  <FaSearch />
                </button>
                <input
                  className="join-item"
                  placeholder="Search..."
                  value={searchField}
                  onChange={handleSearchField}
                />
                <button
                  className="join-item"
                  onClick={() => {
                    handleUserList();
                    setSearchField("");
                  }}
                >
                  <FaTimesCircle />
                </button>
              </div>

              <div className="flex align-center justify-between mb-4">
                <h2 className="page-title mb-0">
                  All Projects{" "}
                  <IoFilterSharp onClick={() => handleToggleStatus()} />
                </h2>
                <DynamicOffCanvas
                  anchor="bottom"
                  isOpen={isOpenOffCanvasProjectStatus}
                  onClose={handleCloseProjectStatus}
                  menuItems={ProjectStatusList}
                  sendData={handleProjectStatusDetail}
                />
                {/* <div>
                    <label className="items-center font-bold my-1 "></label>
                    <button
                      className="btn web-btn "
                      onClick={() => handleToggleStatus()}
                    >
                      Status
                    </button>
                  </div> */}
                <button
                  className="btn web-btn btn-sm "
                  onClick={() => router.push("/projects/add-project")}
                >
                  {/* <FaPlus /> */}
                  Add Project
                </button>
              </div>
              <div className="project-list">
                {allocatedProjects?.map((task, index) => {
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
                        href={`/projects/project-detail?project_id=${task.project_id}`}
                        // href={"#"}
                      >
                        <Image src="/img/project.png" width="50" height="50" alt="img" />
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
                                {moment(task?.endDate).format("DD MMMM YYYY") ==
                                "Invalid date"
                                  ? "NA"
                                  : moment(task?.endDate).format(
                                      "DD MMMM YYYY"
                                    )}
                              </b>
                            </p>
                            <p>
                              Delay <br />
                              <b>
                                {delayInDays > 0
                                  ? delayInDays + " Days"
                                  : "On Time"}
                              </b>
                            </p>
                            <p className="sub-project-p-mobile">
                              Status <br />
                              <span
                                className={`badge ${getStatusColor(
                                  task?.projectStatus
                                )}`}
                              >
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
        </div>
      </div>

      {/* <div className="card w-full bg-base-100 shadow-xl mt-2">
        <div className="card-body">
          {allocatedProjects.map((res, index) => (
            <span key={index} className="">
              <p className="font-bold">
                {index + 1 + ". "} {res?.project_name}
              </p>
              <br />
              Start Date -{moment(res?.startDate).format("DD/MM/YYYY") + ", "}
              <br /> End Date - {moment(res?.endDate).format("DD/MM/YYYY")}
            </span>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default Projects;
