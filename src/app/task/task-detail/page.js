/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaRegFilePdf } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmark } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

// Component
import THeader from "@/components/theader/page";
import DynamicOffCanvas from "@/components/searchFilter/page";
// Api call
import { sendRequest } from "@/api_calls/sendRequest";
import showAlert from "@/api_calls/alert/alert";
import { ToastContainer } from "react-toastify";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TaskDetail = () => {
  const [taskDetail, setTaskDetail] = useState([]);
  const [summary, setSummary] = useState("");
  const [task_status, setTaskStatus] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [priority, setPriority] = useState("");
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [projectStatusDetail, setProjectStatusDetail] = useState([]);
  const [summaryChanged, setSummaryChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [allocatedUserDataAssignee, setAllocatedUserDataAssignee] = useState(
    []
  );
  const [allocatedUserDataReporter, setAllocatedUserDataReporter] = useState(
    []
  );
  const [attchmentData, setAttachmentData] = useState([]);

  const [projectName, setProjectName] = useState("");

  const params = useSearchParams();
  const taskId = params.get("taskId");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleTaskList();
    allStatus();
  }, []);

  const handleTaskList = async () => {
    const data = await sendRequest(
      "get",
      `api/getTask?task_id=${taskId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTaskDetail(data?.data?.data[0]);
    const newData = data.data.data[0];
    setSummary(newData.summary);
    setTaskStatus(newData.task_status);
    setDescription(newData.description);
    setIssueType(newData.issue_type);
    setAssignee(newData.assigned_to_name);
    setReporter(newData.reporter_name);
    setPriority(newData.priority);
    setAttachmentData(data?.data.attachmentData);
    setProjectName(newData?.subProject);
    await allocatedUser(newData.subProjectId);
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
    const formattedData = data.data.data.map(({ id, project_status }) => ({
      id,
      name: project_status,
      type: "project_status",
    }));
    setProjectStatusDetail(formattedData);
  };

  const [isOpenOffCanvasIssue, setIsOpenOffCanvasIssue] = useState(false);
  const [isOpenOffCanvasStatus, setIsOpenOffCanvasStatus] = useState(false);
  const [isOpenOffCanvasAssignee, setIsOpenOffCanvasAssignee] = useState(false);
  const [isOpenOffCanvasReporter, setIsOpenOffCanvasReporter] = useState(false);
  const [isOpenOffCanvasPriority, setIsOpenOffCanvasPriority] = useState(false);

  const handleToggleIssue = () => {
    setIsOpenOffCanvasIssue(!isOpenOffCanvasIssue);
  };
  const handleToggleStatus = () => {
    setIsOpenOffCanvasStatus(!isOpenOffCanvasStatus);
  };
  const handleToggleAssignee = () => {
    setIsOpenOffCanvasAssignee(!isOpenOffCanvasAssignee);
  };
  const handleToggleReporter = () => {
    setIsOpenOffCanvasReporter(!isOpenOffCanvasReporter);
  };
  const handleTogglePriority = () => {
    setIsOpenOffCanvasPriority(!isOpenOffCanvasPriority);
  };

  const handleCloseIssue = () => {
    setIsOpenOffCanvasIssue(false);
  };
  const handleCloseStatus = () => {
    setIsOpenOffCanvasStatus(false);
  };
  const handleCloseAssignee = () => {
    setIsOpenOffCanvasAssignee(false);
  };
  const handleCloseReporter = () => {
    setIsOpenOffCanvasReporter(false);
  };
  const handleClosePriority = () => {
    setIsOpenOffCanvasPriority(false);
  };

  const handleProjectStatus = async (data) => {
    // console.log("data: ", data);
    await editTask(data);
  };

  const IssueData = [
    {
      id: 1,
      type: "Issue",
      name: "Bug",
    },
    {
      id: 2,
      type: "Issue",
      name: "Improvement",
    },
    {
      id: 3,
      type: "Issue",
      name: "New Feature",
    },
  ];
  const PriorityData = [
    {
      id: 1,
      type: "priority",
      name: "High",
    },
    {
      id: 2,
      type: "priority",
      name: "Medium",
    },
    {
      id: 3,
      type: "priority",
      name: "Low",
    },
  ];

  const editTask = async (data) => {
    console.log("data: ", data);
    let obj = {};
    if (data.type == "project_status") {
      obj = { task_status: data.name };
    }
    if (data.type == "Issue") {
      obj = { issue_type: data.name };
    }
    if (data.type == "priority") {
      obj = { priority: data.name };
    }
    if (data.type == "description") {
      obj = { description: description };
    }
    if (data.type == "summary") {
      obj = { summary: summary };
    }
    if (data.type == "allocatedUser") {
      obj = { assigned_to: data.id };
    }
    if (data.type == "reporter") {
      obj = { reporter: data.id };
    }
    // console.log("obj: ", obj);
    let apiCall = await sendRequest("put", `api/edittask/${taskId}`, obj, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("apiCall: ", apiCall);
    if (apiCall.status == 1) {
      if (data.type == "project_status") {
        showAlert("success", `Task edited to ${data.name}`);
      }
      if (data.type == "Issue") {
        showAlert("success", `Task edited to ${data.name}`);
      }
      if (data.type == "priority") {
        showAlert("success", `Task edited to ${data.name}`);
      }
      if (data.type == "description") {
        showAlert("success", `Task edited to ${description}`);
      }
      if (data.type == "summary") {
        showAlert("success", `Task edited to ${summary}`);
      }
      if (data.type == "allocatedUser") {
        showAlert("success", `Task edited to ${data.name}`);
      }
      if (data.type == "reporter") {
        showAlert("success", `Task edited to ${data.name}`);
      }
      setSummaryChanged(false);
      setDescriptionChanged(false);
      await handleTaskList();
    }
  };

  const allocatedUser = async (project_id) => {
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUserassingee?projectId=${project_id}`,
      // `api/getallocatedProjectUser?projectId=${project_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("allocatedUser: ", data);
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
    setAllocatedUserDataAssignee(assigneeData);
    setAllocatedUserDataReporter(reporterData);
  };

  const autoSize = (element) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const uploadAttachment = async (event) => {
    if (taskId) {
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append("attachment", file);
      console.log("formData: ", formData);
      const data = await sendRequest(
        "post",
        `api/uploadAttachment/${taskId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await handleTaskList();
    }
  };

  function renderFile(fileData) {
    if (typeof fileData === "string" && isValidURL(fileData)) {
      if (fileData.endsWith(".png") || fileData.endsWith(".jpg")) {
        return (
          <img
            className="flex"
            src={fileData}
            alt="file"
            width={200}
            height={180}
          />
        );
      } else if (fileData.endsWith(".pdf")) {
        return (
          <div>
            <FaRegFilePdf />
          </div>
        );
      } else if (fileData.endsWith(".csv") || fileData.endsWith(".xlsx")) {
        return (
          <p>
            <GrDocumentCsv />
          </p>
        );
      }
    }
    return <p>Unsupported file</p>;
  }

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative home-page-data">
      {/* <TaskHeader page_name={"home"} /> */}
      <THeader heading="Task-detail" routes="/task" />
      <ToastContainer />
      <div className="web-wrapper">
        <div className="task-details project-details mt-4">
          {/* first box */}
          <div className="flex align-center justify-between mb-4">
            <h2 className="page-title mb-0">{taskDetail.task_name}</h2>
            <h3 className="font-bold">{projectName}</h3>
            <label className="">
              <button
                className="btn btn-primary btn-sm text-capitalize"
                onClick={handleToggleStatus}
              >
                {task_status} <FaChevronDown />
              </button>
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasStatus}
                onClose={handleCloseStatus}
                menuItems={projectStatusDetail}
                sendData={handleProjectStatus}
              />
            </label>
          </div>
          <div className="form-group">
            <textarea
              type="text"
              id="summary"
              name="summary"
              placeholder="Summary"
              // disabled={!summaryChanged}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                autoSize(e.target);
              }}
              ref={(textarea) => {
                if (textarea) autoSize(textarea);
              }}
              onClick={() => {
                setSummaryChanged(!summaryChanged);
              }}
              className="form-control"
            />
            {/* <MdEdit
                className="absolute right-2 bottom-2 text-gray-500 cursor-pointer"
                onClick={() => {
                  setSummaryChanged(!summaryChanged);
                }}
              /> */}
            {summaryChanged ? (
              <>
                <button
                  className="ml-2 bg-blue-200 text-lg"
                  onClick={async () => {
                    editTask({ summary: summary, type: "summary" });
                  }}
                >
                  <IoCheckmark />
                </button>
                <button
                  className="ml-2 bg-red-200 text-lg"
                  onClick={() => setSummaryChanged(!summaryChanged)}
                >
                  <RxCross2 />
                </button>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="form-group">
            <label htmlFor="label" className="label-text">
              Description
            </label>
            <textarea
              className="form-control"
              name="description"
              // disabled={!descriptionChanged}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                autoSize(e.target);
              }}
              onClick={() => {
                setDescriptionChanged(!descriptionChanged);
              }}
              ref={(textarea) => {
                if (textarea) autoSize(textarea);
              }}
              placeholder="Add a description"
            ></textarea>
            {/* <MdEdit
              className="ml-2 text-gray-500 cursor-pointer"
              onClick={() => {
                setDescriptionChanged(!descriptionChanged);
              }}
            /> */}
            {descriptionChanged ? (
              <>
                <button
                  className="ml-2 bg-blue-200 text-lg"
                  onClick={async () => {
                    editTask({
                      type: "description",
                      description: description,
                    });
                  }}
                >
                  <IoCheckmark />
                </button>
                <button
                  className="ml-2 bg-red-200 text-lg"
                  onClick={() => setDescriptionChanged(!descriptionChanged)}
                >
                  <RxCross2 />
                </button>
              </>
            ) : (
              ""
            )}
          </div>

          {/* Attachment */}
          <div className="form-group">
            <label htmlFor="label" className="label-text">
              Attachment
            </label>
            <div className="grid grid-cols-5">
              {attchmentData?.map((fileData, index) => (
                <div
                  className=" px-2 cursor-pointer justify-center items-center text-6xl"
                  key={index}
                >
                  {/* {index + 1} */}
                  <a
                    href={fileData.files}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {renderFile(fileData.files)}
                  </a>
                </div>
              ))}
            </div>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="w-full upload-btn"
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={uploadAttachment} />
            </Button>
          </div>

          {/* Second box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Issue Type
              </label>
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasIssue}
                onClose={handleCloseIssue}
                menuItems={IssueData}
                sendData={handleProjectStatus}
              />
              <button onClick={handleToggleIssue} className="form-control">
                {issueType}
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Priority
              </label>
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasPriority}
                onClose={handleClosePriority}
                menuItems={PriorityData}
                sendData={handleProjectStatus}
              />
              <button onClick={handleTogglePriority} className="form-control">
                {priority}
              </button>
              {/* <p>{priority}</p> */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Assignee
              </label>
              <button className="form-control" onClick={handleToggleAssignee}>
                {assignee}
              </button>

              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasAssignee}
                onClose={handleCloseAssignee}
                menuItems={allocatedUserDataAssignee}
                sendData={handleProjectStatus}
              />
            </div>
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Reporter
              </label>
              <button className="form-control" onClick={handleToggleReporter}>
                {reporter}
              </button>

              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasReporter}
                onClose={handleCloseReporter}
                menuItems={allocatedUserDataReporter}
                sendData={handleProjectStatus}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Due Date
              </label>
              <p className="form-control">
                {moment(taskDetail?.due_date).format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Created
              </label>
              <p className="form-control">
                {moment(taskDetail?.created_at).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
