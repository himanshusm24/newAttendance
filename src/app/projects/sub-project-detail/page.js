"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import { sendRequest } from "@/api_calls/sendRequest";
import { createLog } from "@/api_calls/taskLogs/createTaskLog";
import { getAllStatus } from "@/api_calls/admin/taskManage/getAllStatus";
import THeader from "@/components/theader/page";
import { FaChevronRight } from "react-icons/fa";

const ProjectDetails = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const params = useSearchParams();
  const projectId = params.get("project_id");
  let [optionsData, setOptionsData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [startEndProject, setStartEndProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [allocatedUserList, setAllocatedUserList] = useState([]);
  const [oldValue, setOldValue] = useState([]);

  const [projectLogsData, setProjectLogData] = useState([]);
  const [allStatusData, getAllStatusData] = useState([]);
  const [subProjectData, setSubProjectData] = useState([]);
  const todayDate = new Date();

  let token;
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("token");
    if (token) {
      // console.log("Token found:", token);
    } else {
      console.log("No token found in localStorage.");
    }
  } else {
    console.log("localStorage is not supported in this browser/environment.");
  }

  const allProjects = async () => {
    if (projectId) {
      const data = await sendRequest(
        "get",
        `api/getProject?project_id=${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("projectDetail:", data?.data);
      const projectDetail = data?.data?.data[0];
      setOldValue(projectDetail);
      setProjectName(projectDetail?.project_name);
      setDescription(projectDetail?.description);
      setProjectStatus(projectDetail?.projectStatus);
      setStartEndProject(moment(projectDetail?.startDate).format("YYYY-MM-DD"));
      setEndDateProject(moment(projectDetail?.endDate).format("YYYY-MM-DD"));
    }
  };

  const editProject = async (
    startd = startEndProject,
    endD = endDateProject,
    projectS = projectStatus,
    logmessage = ""
  ) => {
    const adminId = localStorage.getItem("admin_id");
    if (projectId) {
      const sendData = {
        project_name: projectName,
        description: description,
        projectStatus: projectS,
        endDate: endD,
        startDate: startd,
      };
      const data = await sendRequest(
        "put",
        `api/editProject/${projectId}`,
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.status == 1) {
        // await createLog(
        //   adminId,
        //   logmessage,
        //   "put",
        //   JSON.stringify(oldValue),
        //   JSON.stringify(sendData),
        //   projectId,
        //   "project"
        // );
        setSuccessMsg(`Updated: ${logmessage}`);
      }
    }
    // await getTaskLogs();
  };

  const allUserList = async () => {
    const userList = await sendRequest(
      "get",
      "api/user/List",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // setUserListData(userList?.data?.data)
    setOptionsData(
      userList?.data?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const allStatus = async () => {
    const data = await getAllStatus();
    getAllStatusData(data.data.data);
  };

  useEffect(() => {
    // allProjects();
    allUserList();
    // handleUserList();
    // getTaskLogs();
    allStatus();
    getSubProjects();
  }, []);

  const handleSelectUser = async (selectedOption) => {
    // console.log("selectedOption: ", selectedOption);
    const adminId = localStorage.getItem("admin_id");
    const sendData = {
      project_id: projectId,
      user_id: selectedOption.value,
    };

    const data = await sendRequest("post", "api/allocateUser", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await handleUserList();
    await createLog(
      adminId,
      `Added ${selectedOption.label}`,
      "post",
      "",
      "",
      projectId,
      "project"
    );
  };

  const handleUserList = async () => {
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUser?projectId=${projectId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // setAllocatedUserList(data?.data?.data);
  };

  const deleteUser = async (res) => {
    const adminId = localStorage.getItem("admin_id");
    const data = await sendRequest(
      "put",
      `api/deleteAllocatedProjectUser/${res.id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await handleUserList();
    await createLog(
      adminId,
      `Deleted User: ${res.name}`,
      "put",
      "",
      "",
      projectId,
      "project"
    );
  };

  // const getTaskLogs = async () => {
  //   let data = await sendRequest(
  //     "get",
  //     `api/getTaskLog?projectId=${projectId}`,
  //     {},
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   // console.log("data: ", data.data.data);
  //   // setTaskLogData(data.data.data);
  //   setProjectLogData(data.data.data);
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const getSubProjects = async () => {
    const data = await sendRequest(
      "get",
      `api/getSubProject?project_id=${projectId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    const subprojectData = data?.data?.data[0];
    setProjectName(subprojectData.project_name);
    setDescription(subprojectData.description);
    setStartEndProject(subprojectData.startDate)
    setEndDateProject(subprojectData.endDate)
    setProjectStatus(subprojectData.projectStatus)
    // setSubProjectData(data?.data?.data[0]);

    setAllocatedUserList(data.data.userData);
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="rightside">
          <THeader heading="Sub Project Detail" routes="/projects" />
          <div className="web-wrapper">
            <section className="project-details app-project-details mt-4">
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

              <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-4">
                <div className="lg:col-span-3 xl:col-span-3">
                  <div className="grid xl:grid-cols-6">
                    <div className="form-group xl:col-span-2">
                      <label className="label-text">Sub Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={projectName}
                        onChange={(e) => {
                          setInputChanged(true);
                          setProjectName(e.target.value);
                        }}
                      ></input>
                      {inputChanged ? (
                        <>
                          <button
                            className="ml-2 bg-blue-200 text-lg"
                            onClick={async () => {
                              setInputChanged(false);
                              await editProject(
                                startEndProject,
                                endDateProject,
                                projectStatus,
                                `Project Name changed from ${oldValue.project_name} to ${projectName}`
                              );
                              await allProjects();
                            }}
                          >
                            <IoCheckmark />
                          </button>
                          <button
                            className="ml-2 bg-red-200 text-lg"
                            onClick={() => setInputChanged(false)}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="form-group">
                      <label className="label-text">
                        Sub Project Description
                      </label>
                      <textarea
                        placeholder="Bio"
                        className="form-control"
                        value={description}
                        onChange={(e) => {
                          setDescriptionChanged(true);
                          setDescription(e.target.value);
                        }}
                      ></textarea>

                      {descriptionChanged ? (
                        <>
                          <button
                            className="ml-2 bg-blue-200 text-lg"
                            onClick={async () => {
                              await editProject(
                                startEndProject,
                                endDateProject,
                                projectStatus,
                                `Project description changed from  ${oldValue.description} to ${description}`
                              );
                              await allProjects();
                              await setDescriptionChanged(false);
                            }}
                          >
                            <IoCheckmark />
                          </button>
                          <button
                            className="ml-2 bg-red-200 text-lg"
                            onClick={() => setDescriptionChanged(false)}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="team-section">
                      <div className="flex items-center justify-between mt-5 mb-4">
                        <h3 className="sub-heading">Manage Team</h3>
                        {/* <Link href={`/task?project_id=${projectId}`} className="btn web-btn">All Task</Link> */}
                      </div>
                      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-2 gap-4">
                        {allocatedUserList.map((res, index) => (
                          <div key={index} className="team-box-project-detail">
                            <Image
                              src="/img/user-default.png"
                              width={50}
                              height={50}
                              className="user-img"
                              alt=""
                            />
                            <h6>
                              {res?.name} <span>({res?.departmentName})</span>
                            </h6>
                            <p>{res?.designation}</p>
                          </div>
                        ))}
                      </div>
                      {/* <div className="mt-4">
                        <table className="table table-bordered table-hoverable table-in-box-view">
                          <thead>
                            <tr className="web-bg">
                              <th width="400px">Team</th>
                              <th>Department</th>
                              <th>Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allocatedUserList.map((res, index) => (
                              <tr key={index}>
                                <td data-label="Team">
                                  <div className="team-name">
                                    <Image
                                      src="/img/user-default.png"
                                      width={50}
                                      height={50}
                                      className="user-img"
                                      alt=""
                                    />
                                    <b>{res?.name}</b>
                                  </div>
                                </td>
                                <td data-label="Department">
                                  
                                </td>
                                <td data-label="Role">{res?.designation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 xl:col-span-1">
                  <div className="project-detail-right-box">
                    <div className="box-heading">
                      <h3 className="sub-heading mb-3">Project Status</h3>
                    </div>
                    <div className="box-body">
                      <div className="project-side-list">
                        <h4 className="side-sub-heading">Status</h4>
                        {/* <span className="badge bg-success"> */}
                        {/* </span> */}
                        <div>
                          <select
                            id="task_status"
                            name="task_status"
                            value={projectStatus}
                            onChange={(e) => {
                              setProjectStatus(e.target.value);
                              editProject(
                                startEndProject,
                                endDateProject,
                                e.target.value,
                                `Project Status changed from  ${oldValue.projectStatus} to ${e.target.value}`
                              );
                            }}
                            className="w-full border rounded-md focus:outline-none focus:border-blue-500"
                          >
                            {allStatusData?.map((resp, index) => (
                              <>
                                <option key={index} value={resp.project_status}>
                                  {" "}
                                  {resp.project_status}{" "}
                                </option>
                              </>
                            ))}
                            {/* <option value="Open">Open</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="project-side-list">
                        <h4 className="side-sub-heading">Start Date</h4>
                        <p>
                          <input
                            type="date"
                            // value={moment(startEndProject).format("DD/MM/YYYY")}
                            className="w-full border rounded-md focus:outline-none focus:border-blue-500"
                            value={startEndProject}
                            onChange={(e) => {
                              setStartEndProject(e.target.value);
                              editProject(
                                e.target.value,
                                endDateProject,
                                projectStatus,
                                `Project Start Date changed from  ${oldValue.startDate} to ${e.target.value}`
                              );
                            }}
                          ></input>
                        </p>
                      </div>
                      <div className="project-side-list">
                        <h4 className="side-sub-heading">End Date</h4>
                        <p>
                          <input
                            type="date"
                            // value={moment(endDateProject).format("YYYY-MM-DD")}
                            className="w-full border rounded-md focus:outline-none focus:border-blue-500"
                            value={endDateProject}
                            onChange={(e) => {
                              setEndDateProject(e.target.value);
                              editProject(
                                startEndProject,
                                e.target.value,
                                projectStatus,
                                `Project End Date changed from ${oldValue.endDate} to ${e.target.value}`
                              );
                            }}
                          ></input>{" "}
                        </p>
                      </div>
                      <div className="project-side-list">
                        <h4 className="side-sub-heading">Delay</h4>
                        <p>{"20 Days"}</p>
                      </div>
                      <Link
                        className="btn web-btn mt-4 w-full"
                        href={`/task?project_id=${projectId}`}
                      >
                        View All Tasks <FaChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
