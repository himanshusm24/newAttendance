/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import "../theme2.css";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdDensityMedium } from "react-icons/md";
import { useRouter } from "next/navigation";
import THeader from "@/components/theader/page";
import { FaTrashAlt } from "react-icons/fa";

import DynamicOffCanvas from "@/components/searchFilter/page";

import dayjs from "dayjs";
import {
  FaSearch,
  FaTimesCircle,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Task = () => {
  const router = useRouter();
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const [allocatedTasks, setAllocatedTasks] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [isOpenOffCanvasStatus, setIsOpenOffCanvasProject] = useState(false);
  const [isOpenOffCanvasProjectStatus, setIsOpenOffCanvasProjectStatus] =
    useState(false);
  const [fromValue, setFromValue] = useState(dayjs());
  const [toValue, setToValue] = useState(dayjs());

  const [searchField, setSearchField] = useState("");

  const [isProjectActive, setIsProjectActive] = useState(false);
  const [isAssigneeActive, setIsAssigneeActive] = useState(false);
  const [isReporterActive, setIsReporterActive] = useState(false);
  const [isStatusActive, setIsStatusActive] = useState(false);

  const [allocatedUserDataAssignee, setAllocatedUserDataAssignee] = useState(
    []
  );
  const [allocatedUserDataReporter, setAllocatedUserDataReporter] = useState(
    []
  );

  const [isOpenOffCanvasAssignee, setIsOpenOffCanvasAssignee] = useState(false);
  const [isOpenOffCanvasReporter, setIsOpenOffCanvasReporter] = useState(false);

  useEffect(() => {
    handleTaskList();
    handleprojectDropdownData();
    allocatedUser();
  }, []);

  const handleTaskList = async () => {
    const userId = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/getTaskMob?user_id=${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedTasks(data?.data?.data);
  };

  const filterTaskList = async (data) => {
    // console.log("data: ", data);
    let url;
    const userId = localStorage.getItem("user_id");
    if (data && data.project_id) {
      url = `api/getTaskMob?user_id=${userId}&project_id=${data.project_id}`;
    } else if (data && data.data && data.data.type == "projectStatus") {
      url = `api/getTaskMob?user_id=${userId}&task_status=${data.data.name}`;
    } else if (data && data.assigned_to) {
      url = `api/getTaskMob?&user_id=${data.assigned_to}`;
    } else if (data && data.reporter_id) {
      url = `api/getTaskMob?&reporter_id=${data.reporter_id}`;
    } else if (data && data.type == "task_name") {
      url = `api/getTaskMob?&task_name=${data.searchVal}`;
    } else if (data && data.data == "filterDate") {
      if (!fromValue && !toValue) {
        return console.log("fromDate toDate is not defined");
      } else {
        let startDate = moment(fromValue.$d).format("YYYY-MM-DD");
        let endDate = moment(toValue.$d).format("YYYY-MM-DD");
        url = `api/getTaskMob?filterStartDate=${startDate}&filterEndDate=${endDate}`;
      }
    }
    const apicall = await sendRequest(
      "get",
      url,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedTasks(apicall?.data?.data);
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

  const handleprojectDropdownData = async () => {
    const data = await sendRequest(
      "get",
      "api/getProject",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("handleprojectDropdownData: ", data.data.data);
    const dropdownData = data.data.data.map(
      ({ project_id, project_name, description }) => ({
        id: project_id,
        name: project_name,
        description: description,
        type: "projectDropdown",
      })
    );
    setProjectDropdownData(dropdownData);
  };

  const handleCloseProject = () => {
    setIsOpenOffCanvasProject(false);
  };

  const handleToggleProject = () => {
    setIsOpenOffCanvasProject(!isOpenOffCanvasStatus);
    setIsProjectActive(true);
    setIsAssigneeActive(false);
    setIsReporterActive(false);
    setIsStatusActive(false);
  };
  const handleProjectData = async (data) => {
    if (data.type == "allocatedUser") {
      await filterTaskList({ assigned_to: data.id });
    } else if (data.type == "reporter") {
      await filterTaskList({ reporter_id: data.id });
    } else {
      await filterTaskList({ project_id: data.id });
    }
  };

  const handleCloseProjectStatus = () => {
    setIsOpenOffCanvasProjectStatus(false);
  };

  const handleToggleStatus = () => {
    setIsOpenOffCanvasProjectStatus(!isOpenOffCanvasProjectStatus);
    setIsStatusActive(true);
    setIsAssigneeActive(false);
    setIsReporterActive(false);
    setIsProjectActive(false);
  };

  const handleProjectStatusDetail = async (data) => {
    await filterTaskList({ data });
  };

  const handleToggleAssignee = () => {
    setIsOpenOffCanvasAssignee(!isOpenOffCanvasAssignee);
    setIsAssigneeActive(true);
    setIsProjectActive(false);
    setIsReporterActive(false);
    setIsStatusActive(false);
  };
  const handleToggleReporter = () => {
    setIsOpenOffCanvasReporter(!isOpenOffCanvasReporter);
    setIsReporterActive(true);
    setIsProjectActive(false);
    setIsAssigneeActive(false);
    setIsStatusActive(false);
  };
  const handleCloseAssignee = () => {
    setIsOpenOffCanvasAssignee(false);
  };
  const handleCloseReporter = () => {
    setIsOpenOffCanvasReporter(false);
  };

  const allocatedUser = async (project_id) => {
    let data;
    if (project_id == undefined) {
      data = await sendRequest(
        "get",
        `api/getallocatedProjectUserassingee`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      data = await sendRequest(
        "get",
        `api/getallocatedProjectUserassingee?projectId=${project_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    // console.log("data: ", data);
    const assigneeData = data.data.data.map(({ userId, name, project_id }) => ({
      id: userId,
      name: name,
      type: "allocatedUser",
      project_id: project_id,
    }));
    const reporterData = data.data.data.map(({ userId, name, project_id }) => ({
      id: userId,
      name: name,
      type: "reporter",
      project_id: project_id,
    }));
    // console.log("reporterData: ", reporterData);
    setAllocatedUserDataAssignee(assigneeData);
    setAllocatedUserDataReporter(reporterData);
  };

  const handleSearchField = async (e) => {
    const searchVal = e.target.value;
    setSearchField(searchVal);

    if (searchVal.length >= 3) {
      console.log(searchVal);
      // await filterTask(e, "task_name");
      const data = {
        searchVal,
        type: "task_name",
      };
      await filterTaskList(data);
    }
  };

  const resetAll = async () => {
    setIsStatusActive(false);
    setIsAssigneeActive(false);
    setIsReporterActive(false);
    setIsProjectActive(false);
    setFromValue(dayjs());
    setToValue(dayjs());
    handleTaskList();
  };

  const deleteTask = async (id) => {
    const data = await sendRequest(
      "put",
      `api/deletetask/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    if (data.status == 1) {
      // setSuccessMsg("Task deleted");
      handleTaskList();
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
            deleteTask(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <THeader heading="Tasks" routes="/task-home" />
      <div className="projects task-list-admin task-list-app">
        <div className="container">
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
                setSearchField("");
                handleTaskList();
              }}
            >
              <FaTimesCircle />
            </button>
          </div>
          {/* search filter */}
          <div className="collapse collapse-arrow border">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Filters</div>
            <div className="collapse-content">
              <div className="mobile-filter-task-list">
                <button
                  className={`filter-btns ${
                    isProjectActive ? "active-filter" : ""
                  }`}
                  onClick={() => handleToggleProject()}
                >
                  Projects <FaChevronDown />
                </button>
                <DynamicOffCanvas
                  anchor="bottom"
                  isOpen={isOpenOffCanvasStatus}
                  onClose={handleCloseProject}
                  menuItems={projectDropdownData}
                  sendData={handleProjectData}
                />
                <button
                  className={`filter-btns ${
                    isAssigneeActive ? "active-filter" : ""
                  }`}
                  onClick={() => handleToggleAssignee()}
                >
                  Assignee <FaChevronDown />
                </button>
                <DynamicOffCanvas
                  anchor="bottom"
                  isOpen={isOpenOffCanvasAssignee}
                  onClose={handleCloseAssignee}
                  menuItems={allocatedUserDataAssignee}
                  sendData={handleProjectData}
                />
                <button
                  className={`filter-btns ${
                    isReporterActive ? "active-filter" : ""
                  }`}
                  onClick={() => handleToggleReporter()}
                >
                  Reporter <FaChevronDown />
                </button>
                <DynamicOffCanvas
                  anchor="bottom"
                  isOpen={isOpenOffCanvasReporter}
                  onClose={handleCloseReporter}
                  menuItems={allocatedUserDataReporter}
                  sendData={handleProjectData}
                />
                <button
                  className={`filter-btns ${
                    isStatusActive ? "active-filter" : ""
                  }`}
                  onClick={() => handleToggleStatus()}
                >
                  Status <FaChevronDown />
                </button>
                <DynamicOffCanvas
                  anchor="bottom"
                  isOpen={isOpenOffCanvasProjectStatus}
                  onClose={handleCloseProjectStatus}
                  menuItems={ProjectStatusList}
                  sendData={handleProjectStatusDetail}
                />
                <div className="">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <div className="grid grid-cols-2">
                        <DatePicker
                          label="From"
                          value={fromValue}
                          onChange={(newValue) => {
                            setFromValue(newValue);
                          }}
                        />
                        <DatePicker
                          label="To"
                          value={toValue}
                          onChange={async (newValue) => {
                            setToValue(newValue);
                            await filterTaskList({ data: "filterDate" });
                          }}
                        />
                      </div>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <button
                  className="text-neutral-500 link font-bold flex items-center gap-1"
                  onClick={() => resetAll()}
                >
                  <FaTimes />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <hr />
          <div className="flex align-center justify-between my-4">
            <h2 className="page-title mb-0">All Tasks</h2>
            <button
              className="btn web-btn btn-sm  web-btn"
              onClick={() => router.push("/task/add-task")}
            >
              Add Task
            </button>
          </div>

          <div className="project-list">
            {allocatedTasks && allocatedTasks.length > 0
              ? allocatedTasks.map((res, index) => (
                  <div className="box" key={index}>
                    <button
                      className="btn btn-error btn-sm delete-btn"
                      onClick={() => deletConfirmation(res.task_id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <div
                      className="flex"
                      onClick={() =>
                        router.push(`/task/task-detail?taskId=${res.task_id}`)
                      }
                    >
                      {res.priority === "High" ? (
                        <FaArrowUp className="text-green-500" />
                      ) : res.priority === "Medium" ? (
                        <MdDensityMedium className="text-orange-500" />
                      ) : res.priority === "low" ? (
                        <FaArrowDown className="text-red-500" />
                      ) : null}
                      <div className="content">
                        <div className="date">
                          <p>
                            {res.task_name} <br />
                            <b className="break-all">{res?.summary}</b>
                          </p>
                          <p>
                            Assignee <br />
                            <b>{res.assigned_to_name}</b>
                          </p>
                          {/* <p>
                            Reporter <br />
                            <b>{res.reporter_name}</b>
                          </p> */}
                          <p>
                            Status <br />
                            <b>{res.task_status}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
