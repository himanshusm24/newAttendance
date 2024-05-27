"use client";
import React, { useEffect, useState } from "react";
import "../../../theme2.css";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { getTask } from "@/api_calls/admin/tasks/getTask";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaSave } from "react-icons/fa";
import { sendRequest } from "@/api_calls/sendRequest";
import Select from "react-select";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { MdEdit } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import Grid from "@mui/material/Unstable_Grid2";
import moment from "moment";
import { FaTimes } from "react-icons/fa";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  FaSearch,
  FaTimesCircle,
  FaTrashAlt,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";

import { getAllStatus } from "@/api_calls/admin/taskManage/getAllStatus";
import DynamicOffCanvas from "@/components/searchFilter/page";

const TaskList = () => {
  let token;
  let userId;
  let userName;
  // let project_id;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    userId = localStorage.getItem("user_id");
    userName = localStorage.getItem("user_name");
  }
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [TaskData, setTaskData] = useState([]);
  const params = useSearchParams();
  const project_id = params.get("project");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userListData, setUserListData] = useState([]);
  const [selectedAssigneeValues, setSelectedAssignValues] = useState("");

  const [selectedReproterValues, setSelectedReporterValues] = useState({
    value: userId,
    label: userName,
  });

  const [selectedStatusValues, setSelectedStatusValues] = useState("");
  let [optionsData, setOptionsData] = useState([]);
  const [editData, setEditData] = useState("");
  const [userData, setUserData] = useState({});
  const [inputValueChanged, setInputValueChanged] = useState(false);
  const [editableRows, setEditableRows] = useState([]);

  const [oldData, setOldData] = useState([]);
  const [allStatusData, setAllStatusData] = useState([]);
  const [isOpenOffCanvasStatus, setIsOpenOffCanvasStatus] = useState(false);
  const [fromValue, setFromValue] = useState(dayjs());
  const [toValue, setToValue] = useState(dayjs());
  const [searchField, setSearchField] = useState("");
  // console.log('TaskData: ', TaskData);

  const [newTask, setNewTask] = useState({
    summary: "",
    due_date: "",
    assigned_to: "",
    reporter: "",
    project_id: "",
    issue_type: "",
    priority: "",
    attachement: "",
    task_status: "",
  });
  const [projectData, setProjectData] = useState([]);
  const [subProjectData, setSubProjectData] = useState([]);
  const [subProjectAddData, setSubProjectAddData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  let [tasksubprojectId, settaskSubProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [projectDropdownData, setProjectDropdownData] = useState([]);

  const [allocatedUserDataAssignee, setAllocatedUserDataAssignee] = useState(
    []
  );
  const [allocatedUserDataReporter, setAllocatedUserDataReporter] = useState(
    []
  );

  const [isOpenOffCanvasProjectStatus, setIsOpenOffCanvasProjectStatus] =
    useState(false);

  const [isOpenOffCanvasAssignee, setIsOpenOffCanvasAssignee] = useState(false);
  const [isOpenOffCanvasReporter, setIsOpenOffCanvasReporter] = useState(false);
  const [isOpenOffCanvasProject, setIsOpenOffCanvasProject] = useState(false);

  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedReporter, setSelectedReporter] = useState(null);

  const [projectPopup, setProjectPopup] = useState(false);

  const [selectProject, setSelectProject] = useState("");
  const [selectSubProject, setSelectSubProject] = useState("");

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

  const handleCloseStatus = () => {
    setIsOpenOffCanvasStatus(false);
  };

  const handleProjectStatus = async (data) => {
    console.log("data: ", data);
  };

  const getTaskData = async () => {
    let data;
    if (project_id && project_id > 0) {
      data = await getTask(project_id);
      // console.log("data: ", data);
      settaskSubProjectId(data?.data?.data[0]?.subProjectId);
      if (data && data.data.data[0]) {
        setTaskData(data?.data?.data);
        setOldData(data?.data?.data);
      }
      await allDropDownData({
        taskprojectId: 1,
      });
    } else if (
      selectProject.value &&
      selectProject.value != "" &&
      selectProject.value > 0
    ) {
      data = await getTask(selectProject.value);
      // console.log("data: ", data);
      settaskSubProjectId(data?.data?.data[0]?.subProjectId);
      if (data && data.data.data[0]) {
        setTaskData(data?.data?.data);
        setOldData(data?.data?.data);
      }
      await allDropDownData({
        taskprojectId: 1,
      });
    } else {
      data = await getTask();
      // console.log("data: ", data);
      settaskSubProjectId(data?.data?.data[0]?.subProjectId);
      if (data && data.data.data[0]) {
        setTaskData(data?.data?.data);
        setOldData(data?.data?.data);
      }
      await allDropDownData({
        taskprojectId: 1,
      });
    }
  };

  useEffect(() => {
    getTaskData();
  }, [project_id]);

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

  const addEmptyRow = () => {
    if (!project_id || project_id < 0) {
      setProjectPopup(true);
      const modal = document.getElementById("my_modal_2");
      if (modal) {
        modal.showModal();
      }
      return console.log("First select project");
    }
    if (TaskData.length === 0 || !isRowEmpty(TaskData[0])) {
      const newTaskData = [newTask, ...TaskData];
      setTaskData(newTaskData);
    }
    setNewTask({
      summary: "",
      due_date: "",
      assigned_to: "",
      reporter: "",
      project_id: "",
      issue_type: "",
      priority: "",
      attachment: "",
      task_status: "",
    });
  };

  const isRowEmpty = (row) => {
    if (Object.values(row).every((value) => value === "") == true) {
      // alert("Enter all fields. ");
      setErrorMsg("Save this field first");
    }
    return Object.values(row).every((value) => value === "");
  };

  const allDropDownData = async ({ taskprojectId = "" }) => {
    // console.log("taskprojectIdallDropDownData: ", taskprojectId);
    const userList = await sendRequest(
      "get",
      `api/getallocatedProjectUserassingee?projectId=${taskprojectId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserListData(userList?.data?.data);
    setOptionsData(
      userList?.data?.data?.map((item) => ({
        value: item.userId,
        label: item.name,
      }))
    );
    const assigneeData = userList.data.data.map(
      ({ userId, name, project_id }) => ({
        id: userId,
        name: name,
        type: "assignee",
        project_id: project_id,
      })
    );
    const reporterData = userList.data.data.map(
      ({ userId, name, project_id }) => ({
        id: userId,
        name: name,
        type: "reporter",
        project_id: project_id,
      })
    );
    setAllocatedUserDataAssignee(assigneeData);
    setAllocatedUserDataReporter(reporterData);
  };

  const handlefilterProjects = async () => {
    const projects = await sendRequest(
      "get",
      "api/getProject",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const subProjects = await sendRequest(
      "get",
      "api/getSubProject",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProjectData(
      projects.data.data.map((item) => ({
        value: item.project_id,
        label: item.project_name,
      }))
    );
    const dropdownData = projects.data.data.map(
      ({ project_id, project_name, description }) => ({
        id: project_id,
        name: project_name,
        description: description,
        type: "project",
      })
    );
    setProjectDropdownData(dropdownData);
    setSubProjectData(
      subProjects.data.data
        .filter((item) => item.parent_project_id !== null)
        .map((item) => ({
          value: item.parent_project_id,
          label: item.project_name,
        }))
    );
  };

  const handlefilterSubProjects = async (id) => {
    const subProjects = await sendRequest(
      "get",
      `api/subProject?project_id=${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubProjectAddData(
      subProjects.data.data
        .filter((item) => item.parent_project_id !== null)
        .map((item) => ({
          value: item.parent_project_id,
          label: item.project_name,
        }))
    );
  };

  const handleProjectChange = async (selectedOption) => {
    setSelectedProject(selectedOption);
    // console.log("Selected project:", selectedOption);
    await filterTask(selectedOption, "project");
  };

  const handleSelectProject = async (selectedOption) => {
    // console.log("selectedOption: ", selectedOption);
    await handlefilterSubProjects(selectedOption.value);
    setSelectProject(selectedOption);
    // setProjectPopup(false);
    if (TaskData.length === 0 || !isRowEmpty(TaskData[0])) {
      const newTaskData = [newTask, ...TaskData];
      setTaskData(newTaskData);
    }
    setNewTask({
      summary: "",
      due_date: "",
      assigned_to: "",
      reporter: "",
      project_id: "",
      issue_type: "",
      priority: "",
      attachment: "",
      task_status: "",
    });
  };

  const handleSelectSubProject = async (selectedOption) => {
    console.log("selectedOption: ", selectedOption);
    setSelectSubProject(selectedOption);
    setSubProjectAddData([]);
    setProjectPopup(false);
  };

  const handleSubProjectChange = async (selectedOption) => {
    setSelectedSubProject(selectedOption);
    // console.log("Selected project:", selectedOption);
    await filterTask(selectedOption, "subProject");
  };

  const handleAssigneeChange = async (selectedOption) => {
    let obj = {
      ...selectedOption,
      type: "assignee",
    };
    setSelectedAssignee(obj);
    await filterTask(obj, obj.type);
  };
  const handleReporterChange = async (selectedOption) => {
    let obj = {
      ...selectedOption,
      type: "reporter",
    };
    setSelectedReporter(obj);
    await filterTask(obj, obj.type);
  };

  const handleSubmit = async (task) => {
    if (task.summary.length <= 0) {
      return setErrorMsg("Enter task summary");
    }
    if (!selectedAssigneeValues.value) {
      return setErrorMsg("Select assignee");
    }
    if (
      !selectedStatusValues.label == "In Progress" ||
      !selectedStatusValues.label == "In Review" ||
      !selectedStatusValues.label == "Open"
    ) {
      return setErrorMsg("Select status");
    }
    let sendData = {
      project_id: project_id ? project_id * 1 : selectSubProject.value,
      summary: task.summary,
      assigned_to: selectedAssigneeValues.value * 1,
      reporter: selectedReproterValues.value * 1,
      task_status: selectedStatusValues.label,
      task_name: "",
    };
    if (task.assigned_to) {
      sendData.assigned_to = task.assigned_to;
    }
    if (task.reporter) {
      sendData.reporter = task.reporter;
    }
    let data = await sendRequest("post", "api/addtask", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.status == 1) {
      setSuccessMsg("Task added successfully");
      await getTaskData();
      await allDropDownData({ taskprojectId: tasksubprojectId });
    }
  };

  const editTask = async (data) => {
    // console.log("data: ", data);
    const adminId = localStorage.getItem("admin_id");
    if (editData && editData > 0) {
      let apiCall = await sendRequest("put", `api/edittask/${editData}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (apiCall.status == 1) {
        await getTaskData();
        setEditableRows([]);
        setSuccessMsg("Task edited");
      }
    }
  };

  useEffect(() => {
    // allDropDownData();
    const userType = localStorage.getItem("user_type");
    const adminId = localStorage.getItem("user_id");
    if (userType && adminId) {
      setUserData({ userType: userType, adminId: adminId });
    }
    allStatus();
    handlefilterProjects();
    // handlefilterSubProjects();
  }, []);

  const handleSelectChangeAssignee = async (selectedOption) => {
    // console.log("selectedOptionAssignee: ", selectedOption);
    setSelectedAssignValues({
      value: selectedOption.value,
      label: selectedOption.label,
    });
    await editTask({ assigned_to: selectedOption.value });
  };

  const handleSelectChangeReporter = async (selectedOption) => {
    // console.log("selectedOptionReporter: ", selectedOption);
    setSelectedReporterValues({
      value: selectedOption.value,
      label: selectedOption.label,
    });
    await editTask({ reporter: selectedOption.value });
  };

  const handleSelectChangeStatus = async (selectedOption) => {
    // console.log("selectedOptionStatus: ", selectedOption);
    setSelectedStatusValues({
      value: selectedOption.value,
      label: selectedOption.label,
    });
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
    // console.log("data: ", data);
    setSuccessMsg("Task deleted");
    await getTaskData();
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

  const setInputChanged = (index) => {
    const newEditableRows = [...editableRows];
    newEditableRows[index] = true;
    setEditableRows(newEditableRows);
  };

  const allStatus = async () => {
    const data = await getAllStatus();
    // console.log('Statusdata: ', data);
    setAllStatusData(data.data.data);
    // setAllStatusData(
    //   data.data.data.map((item) => ({
    //     value: item.project_status,
    //     label: item.project_status,
    //   }))
    // );
  };

  const handleToggleStatus = () => {
    setIsOpenOffCanvasProjectStatus(!isOpenOffCanvasProjectStatus);
  };

  const handleCloseProjectStatus = () => {
    setIsOpenOffCanvasProjectStatus(false);
  };

  const handleProjectStatusDetail = async (data) => {
    await filterTaskList({ data });
  };

  const handleCloseProject = () => {
    setIsOpenOffCanvasProject(false);
  };

  const handleToggleProject = () => {
    setIsOpenOffCanvasProject(!isOpenOffCanvasProject);
  };

  const handleToggleAssignee = () => {
    setIsOpenOffCanvasAssignee(!isOpenOffCanvasAssignee);
  };
  const handleToggleReporter = () => {
    setIsOpenOffCanvasReporter(!isOpenOffCanvasReporter);
  };
  const handleCloseAssignee = () => {
    setIsOpenOffCanvasAssignee(false);
  };
  const handleCloseReporter = () => {
    setIsOpenOffCanvasReporter(false);
  };

  const handleProjectData = async (data) => {
    console.log("data: ", data);
    await filterTaskList(data);
  };

  const handleSearchField = async (e) => {
    const searchVal = e.target.value;
    setSearchField(searchVal);

    if (searchVal.length >= 3) {
      console.log(searchVal);
      // handleUserList({ projectName: searchVal });
      // console.log(e, "task_name");
      await filterTask(e, "task_name");
    }
  };

  const filterTask = async (event = "", type) => {
    // console.log("event: ", event);
    // console.log("type: ", type);
    const selectedValue = event?.target?.value;
    setSelectedUserId(selectedValue);
    let url;
    if (type == "assignee") {
      url = `api/getTask?project_id=${project_id}&user_id=${event.value}`;
    }
    if (type == "reporter") {
      url = `api/getTask?project_id=${project_id}&reporter=${event.value}`;
    }
    if (type == "task_status") {
      url = `api/getTask?project_id=${project_id}&task_status='${selectedValue}'`;
    }
    if (type == "task_name") {
      // url = `api/getTask?project_id=${project_id}&task_name='${selectedValue}'`;
      url = `api/getTask?task_name=${selectedValue}`;
    }
    if (type == "dateFilter") {
      if (fromValue && toValue) {
        let startDate = moment(fromValue.$d).format("YYYY-MM-DD");
        let endDate = moment(toValue.$d).format("YYYY-MM-DD");
        url = `api/getTask?created_from_date=${startDate}&created_to_date=${endDate}`;
      }
    }
    if (type == "project") {
      // url = `api/getTask?project_id=${event.value}&user_id=${userId}`;
      url = `api/getTask?project_id=${event.value}`;
    }
    if (type == "subProject") {
      url = `api/getTask?sub_project_Id=${event.value}`;
    }

    // console.log("url: ", url);
    try {
      const data = await sendRequest(
        "get",
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTaskData(data?.data?.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const filterTaskList = async (data) => {
    // console.log("data: ", data);
    let url;
    const userId = localStorage.getItem("user_id");
    if (data && data.id && data.type == "project") {
      url = `api/getTask?project_id=${data.id}`;
    }
    if (data && data.data && data.data.type == "projectStatus") {
      url = `api/getTask?user_id=${userId}&task_status=${data.data.name}`;
    }
    if (data && data.type == "assignee") {
      url = `api/getTask?project_id=${data.project_id}&user_id=${data.id}`;
    }
    if (data && data.type == "reporter") {
      url = `api/getTask?project_id=${data.project_id}&reporter=${data.id}`;
    }
    if (data && data.data == "filterDate") {
      if (!fromValue && !toValue) {
        return console.log("fromDate toDate is not defined");
      } else {
        let startDate = moment(fromValue.$d).format("YYYY-MM-DD");
        let endDate = moment(toValue.$d).format("YYYY-MM-DD");
        url = `api/getTask?filterStartDate=${startDate}&filterEndDate=${endDate}`;
      }
    }
    if (data && data.type == "projectStatus") {
      url = `api/getTask?task_status='${data.name}'`;
    }

    try {
      const apicall = await sendRequest(
        "get",
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTaskData(apicall?.data?.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleReset = async () => {
    setProjectData([]);
    setSubProjectData([]);
    setFromValue(dayjs()), setToValue(dayjs()), setSearchField("");
    setUserListData([]);
    setSelectedAssignee("");
    setSelectedReporter("");
    setSelectedProject("");
    setSelectedSubProject("");
    await allStatus();
    await handlefilterProjects();
    // await handlefilterSubProjects();
    await allDropDownData("");
    await getTaskData();
  };

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
              breadcumr1={"Manage Tasks"}
              breadcumr1_link={"#"}
              breadcumr2={TaskData[0]?.mainProject}
              breadcumr3={TaskData[0]?.subProject}
              // breadcumr3={"Manage Tasks"}
              // button_name={"Add Tasks"}
              // button_link={"/admin/tasks/add-tasks"}
            />

            <section className="task-list-admin mt-5">
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
              <Grid container spacing={2} className="task-topbar items-center">
                <Grid item lg={2} md={3} sm={12} xs={12}>
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
                      onClick={() => setSearchField("")}
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </Grid>
                <Grid item xl={2} xs={12} className="hidden md:block">
                  <Select
                    className=""
                    options={projectData}
                    isSearchable
                    value={selectedProject}
                    onChange={handleProjectChange}
                    placeholder="Select project"
                  />
                </Grid>
                <Grid item className="hidden md:block">
                  <Select
                    className=""
                    options={subProjectData}
                    isSearchable
                    value={selectedSubProject}
                    onChange={handleSubProjectChange}
                    placeholder="Select sub project"
                  />
                </Grid>

                <Grid item className="hidden md:block">
                  <Select
                    className=""
                    options={optionsData}
                    isSearchable
                    value={selectedAssignee}
                    onChange={handleAssigneeChange}
                    placeholder="Select Assignee"
                  />
                </Grid>
                <Grid item className="hidden md:block">
                  <Select
                    className=""
                    options={optionsData}
                    isSearchable
                    value={selectedReporter}
                    onChange={handleReporterChange}
                    placeholder="Select Reporter"
                  />
                </Grid>
                <Grid item className="hidden md:block">
                  <select
                    className="select"
                    onChange={(e) => filterTask(e, "task_status")}
                  >
                    <option>Status</option>
                    {allStatusData.map((option) => (
                      <option key={option.id} value={option.project_status}>
                        {option.project_status}
                      </option>
                    ))}
                  </select>
                </Grid>
                <Grid item xl={3} md={6} xs={7} className="hidden md:grid">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <div className="datepicker-div">
                        <DatePicker
                          label="From"
                          value={fromValue}
                          onChange={(newValue) => {
                            setFromValue(newValue);
                          }}
                        />
                        <span className="inline-block mr-3 ml-3">-</span>
                        <DatePicker
                          label="To"
                          value={toValue}
                          onChange={async (newValue) => {
                            setToValue(newValue);
                            await filterTask("", "dateFilter");
                          }}
                        />
                      </div>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item className="hidden md:grid">
                  <button
                    className="text-neutral-500 link font-bold flex items-center gap-1 ml-4"
                    onClick={() => handleReset()}
                  >
                    <FaTimes />
                    Reset
                  </button>
                </Grid>
                <Grid item xs={12} className="flex md:hidden">
                  <div className="mobile-filter-task-list">
                    <button
                      className="filter-btns"
                      onClick={() => handleToggleProject()}
                    >
                      Projects <FaChevronDown />
                    </button>
                    <DynamicOffCanvas
                      anchor="bottom"
                      isOpen={isOpenOffCanvasProject}
                      onClose={handleCloseProject}
                      menuItems={projectDropdownData}
                      sendData={handleProjectData}
                    />
                    <button
                      className="filter-btns"
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
                      className="filter-btns"
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
                      className="filter-btns"
                      onClick={() => handleToggleStatus()}
                    >
                      Status <FaChevronDown />
                    </button>
                    <DynamicOffCanvas
                      anchor="bottom"
                      isOpen={isOpenOffCanvasProjectStatus}
                      onClose={handleCloseProjectStatus}
                      menuItems={ProjectStatusList}
                      sendData={handleProjectData}
                    />
                    <Grid item xl={3} md={6} xs={7} className=" md:grid">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DatePicker", "DatePicker"]}
                        >
                          <div className="datepicker-div w-60">
                            <DatePicker
                              label="From"
                              value={fromValue}
                              onChange={(newValue) => {
                                setFromValue(newValue);
                              }}
                            />
                            <span className="inline-block mr-3 ml-3">-</span>
                            <DatePicker
                              label="To"
                              value={toValue}
                              onChange={async (newValue) => {
                                setToValue(newValue);
                                await filterTask("", "dateFilter");
                              }}
                            />
                          </div>
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <button
                      className="text-neutral-500 link font-bold flex items-center gap-1 ml-8"
                      onClick={() => handleReset()}
                    >
                      <FaTimes />
                      Reset
                    </button>
                  </div>
                </Grid>
              </Grid>
              <hr />
              <div className="flex align-center justify-between task-list-heading">
                <h2 className="page-title mb-0">All Tasks</h2>
                <button
                  className="btn web-btn btn-sm  web-btn"
                  onClick={addEmptyRow}
                >
                  Add New Task
                </button>
              </div>

              <div className="task-list">
                {TaskData.length > 0 ? (
                  <>
                    {TaskData.map((task, index) => (
                      <div
                        key={task.task_id}
                        className="box"
                        onClick={() => setEditData(task.task_id)}
                      >
                        {task.task_id ? (
                          <>
                            <div className="content form-group task-list-main-input">
                              <h2 className="font-bold">{task.task_name}</h2>
                              <div className="input-group">
                                <textarea
                                  type="text"
                                  value={task.summary}
                                  disabled={!editableRows[index]}
                                  onChange={(e) => {
                                    const newData = [...TaskData];
                                    newData[index].summary = e.target.value;
                                    setTaskData(newData);
                                  }}
                                  className={` form-control`}
                                ></textarea>
                                <span
                                  className="input-edit-btn"
                                  onClick={() => {
                                    setInputValueChanged(true);
                                    setInputChanged(index);
                                  }}
                                >
                                  <MdEdit />
                                  Edit
                                </span>
                              </div>
                              {editableRows[index] ? (
                                <>
                                  <button
                                    className="ml-2 bg-blue-200 text-lg"
                                    onClick={() => {
                                      editTask({ summary: task.summary });
                                    }}
                                  >
                                    <IoCheckmark />
                                  </button>
                                  <button
                                    className="ml-2 bg-red-200 text-lg"
                                    onClick={() => {
                                      setInputValueChanged(!inputValueChanged);
                                      setEditableRows([]);
                                    }}
                                  >
                                    <RxCross2 />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="content form-group task-list-main-input">
                            {selectProject.label +
                              " - " +
                              selectSubProject.label}
                            <textarea
                              type="text"
                              value={task.summary}
                              // disabled={!editableRows[index]}
                              onChange={(e) => {
                                const newData = [...TaskData];
                                newData[index].summary = e.target.value;
                                setTaskData(newData);
                              }}
                              className={`form-control`}
                            ></textarea>
                          </div>
                        )}
                        <div className="task-list-bottom">
                          <div className="date">
                            <p>
                              <span>Assignee</span>
                              <Select
                                options={optionsData}
                                onChange={handleSelectChangeAssignee}
                                isSearchable
                                value={
                                  task.assigned_to
                                    ? {
                                        value: task.assigned_to,
                                        label: task.assigned_to_name,
                                      }
                                    : selectedAssigneeValues
                                }
                              />
                            </p>
                            {/* <p>
                              <span>Reporter</span>
                              <Select
                                options={optionsData}
                                onChange={handleSelectChangeReporter}
                                isSearchable
                                value={
                                  task.reporter
                                    ? {
                                        value: userId,
                                        label: userName,
                                      }
                                    : {
                                        value: selectedReproterValues.value * 1,
                                        label: selectedReproterValues.label,
                                      }
                                }
                              />
                            </p> */}
                            <p className="">
                              <span>Status</span>
                              <select
                                id="task_status"
                                name="task_status"
                                value={task.task_status}
                                onChange={(e) => {
                                  const newData = [...TaskData];
                                  newData[index].task_status = e.target.value;
                                  setTaskData(newData);
                                  editTask({ task_status: e.target.value });
                                }}
                              >
                                {allStatusData?.map((resp, index) => (
                                  <>
                                    <option
                                      key={index}
                                      value={resp.project_status}
                                    >
                                      {" "}
                                      {resp.project_status}{" "}
                                    </option>
                                  </>
                                ))}
                              </select>
                            </p>
                          </div>
                          {!task.task_id ? (
                            <button
                              className="btn btn-sm task-detail-btn web-btn"
                              onClick={(e) => handleSubmit(task)}
                            >
                              <FaSave />
                            </button>
                          ) : (
                            <button
                              className="btn btn-error btn-sm delete-btn"
                              onClick={(e) => {
                                deletConfirmation(task.task_id);
                              }}
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                          {task.task_id ? (
                            <Link
                              className="btn btn-sm task-detail-btn web-btn"
                              href={`/admin/tasks/add-tasks?id=${task.task_id}`}
                            >
                              <FaArrowRight />
                            </Link>
                          ) : (
                            <button
                              className="btn btn-error btn-sm delete-btn"
                              onClick={(e) => {
                                deletConfirmation(task.task_id);
                              }}
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  "No Data"
                )}
              </div>
            </section>
            {projectPopup == true ? (
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box min-h-64">
                  <span className="font-bold py-2">Select Project</span>
                  <Grid item xl={2} xs={12} className="hidden md:block">
                    <Select
                      className=""
                      options={projectData}
                      isSearchable
                      value={selectedProject}
                      onChange={handleSelectProject}
                      placeholder="Select project"
                    />
                    {subProjectAddData ? (
                      <Select
                        className=""
                        options={subProjectAddData}
                        isSearchable
                        value={selectedSubProject}
                        onChange={handleSelectSubProject}
                        placeholder="Select sub project"
                      />
                    ) : (
                      ""
                    )}
                  </Grid>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
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

export default TaskList;
