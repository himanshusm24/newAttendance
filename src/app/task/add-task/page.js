/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaRegFilePdf } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";
import { useRouter } from "next/navigation";
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
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [projectId, setProjectId] = useState("");
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [projectStatusDetail, setProjectStatusDetail] = useState([]);
  const [allocatedUserDataAssignee, setAllocatedUserDataAssignee] = useState(
    []
  );
  const [allocatedUserDataReporter, setAllocatedUserDataReporter] = useState(
    []
  );
  const [attchmentData, setAttachmentData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const params = useSearchParams();
  const taskId = params.get("taskId");

  const [projectBtnName, setProjectBtnName] = useState("Select Project");
  const [subprojectBtnName, setSubProjectBtnName] =
    useState("Select SubProject");
  const [attachmentId, setAttachmentId] = useState([]);
  const [isOpenOffCanvasProjects, setIsOpenOffCanvasProjects] = useState(false);
  const [isOpenOffCanvasSubProjects, setIsOpenOffCanvasSubProjects] =
    useState(false);
  const [isOpenOffCanvasAssignee, setIsOpenOffCanvasAssignee] = useState(false);
  const [isOpenOffCanvasReporter, setIsOpenOffCanvasReporter] = useState(false);
  const [isOpenOffCanvasPriority, setIsOpenOffCanvasPriority] = useState(false);
  const [subProjectAddData, setSubProjectAddData] = useState([]);

  const router = useRouter();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleAllProjects();
    allStatus();
  }, []);

  const handleAllProjects = async () => {
    const userId = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUser?userId=${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("handleAllProjects: ", data);
    //   await allocatedUser(newData.project_id);
    const allProjects = data?.data?.data.map(
      ({ project_id, project_name, user_id }) => ({
        id: project_id,
        name: project_name,
        type: "allProjects",
        user_id: user_id,
      })
    );
    setProjectData(allProjects);
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
  const handleToggleProjects = () => {
    setIsOpenOffCanvasProjects(!isOpenOffCanvasProjects);
  };
  const handleToggleSubProjects = () => {
    setIsOpenOffCanvasSubProjects(!isOpenOffCanvasSubProjects);
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
  const handleCloseProjects = () => {
    setIsOpenOffCanvasProjects(false);
  };
  const handleCloseSubProjects = () => {
    setIsOpenOffCanvasSubProjects(false);
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
    console.log("handleProjectStatus: ", data);
    if (data.type == "allProjects") {
      setProjectBtnName(data.name);
      // setProjectId(data.id);
      await handlefilterSubProjects(data.id);
      await allocatedUser(data.id);
    }
    if (data.type == "allSubProject") {
      setProjectId(data.id);
    }
    if (data.type == "Issue") {
      setIssueType(data.name);
    }
    if (data.type == "priority") {
      setPriority(data.name);
    }
    if (data.type == "allocatedUser") {
      setAssignee(data.name);
      setAssigneeId(data.id);
    }
    if (data.type == "reporter") {
      setReporter(data.name);
      setReporterId(data.id);
    }
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
          // value: item.project_id,
          // label: item.project_name,
          id: item.project_id,
          name: item.project_name,
          type: "allSubProject",
        }))
    );
  };

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

  const allocatedUser = async (project_id) => {
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUser?project_id=${project_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const assigneeData = data.data.data.map(
      ({ user_id, name, project_id }) => ({
        id: user_id,
        name: name,
        type: "allocatedUser",
        project_id: project_id,
      })
    );
    const reporterData = data.data.data.map(
      ({ user_id, name, project_id }) => ({
        id: user_id,
        name: name,
        type: "reporter",
        project_id: project_id,
      })
    );
    setAllocatedUserDataAssignee(assigneeData);
    setAllocatedUserDataReporter(reporterData);
  };

  const autoSize = (element) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const uploadAttachment = async (event) => {
    const file = event.target.files[0];
    let formData = new FormData();
    formData.append("attachment", file);
    const data = await sendRequest("post", `api/uploadAttachment`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const newId = data.data.data.insertId;
    setAttachmentId((prevAttachmentId) => [...prevAttachmentId, newId]);
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

  const handleCreateTask = async () => {
    if (!summary) {
      showAlert("error", "Fill summary");
      return;
    }
    if (!projectId) {
      showAlert("error", "select project");
      return;
    }
    if (!assigneeId) {
      showAlert("error", "select assignee");
      return;
    }
    if (!reporterId) {
      showAlert("error", "select reporter");
      return;
    }

    const sendData = {
      project_id: projectId * 1,
      issue_type: issueType,
      summary: summary,
      assigned_to: assigneeId * 1,
      reporter: reporterId * 1,
      description: description,
      priority: priority,
    };
    const apicall = await sendRequest("post", "api/addtask", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("apicall: ", apicall);
    if (apicall.status == "1") {
      // console.log(apicall.data.data.insertId);
      let taskID = apicall.data.data.insertId;

      const updateRequests = attachmentId.map(async (res) => {
        const updateAttachment = await sendRequest(
          "put",
          `api/updateAttachement?taskId=${taskID}&id=${res}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log("updateAttachment: ", updateAttachment);
        return updateAttachment;
      });
      const updateResults = await Promise.all(updateRequests);

      showAlert("success", "Task created Successfully");

      router.push("/task");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data ">
      <THeader heading="Add Task" routes="/task" />
      <ToastContainer />
      <div className="px-2">
        {/* first box */}
        <div className="pt-2">
          <div className="grid grid-cols-4 pb-2">
            <label className=" w-full border rounded-md focus:outline-none focus:border-blue-500 col-span-2">
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleProjects}
              >
                {/* {"Select Projects"} */}
                {projectBtnName}
              </button>
            </label>
            {subProjectAddData ? (
              <label className=" w-full border rounded-md focus:outline-none focus:border-blue-500 col-span-2">
                <button
                  className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                  onClick={handleToggleSubProjects}
                >
                  {/* {"Select Projects"} */}
                  {subprojectBtnName}
                </button>
              </label>
            ) : (
              ""
            )}
            <DynamicOffCanvas
              anchor="bottom"
              isOpen={isOpenOffCanvasSubProjects}
              onClose={handleCloseSubProjects}
              menuItems={subProjectAddData}
              sendData={handleProjectStatus}
            />
            <DynamicOffCanvas
              anchor="bottom"
              isOpen={isOpenOffCanvasProjects}
              onClose={handleCloseProjects}
              menuItems={projectData}
              sendData={handleProjectStatus}
            />
          </div>
          <div className="grid grid-cols-5 pt-2">
            <div className="mb-2 col-span-5 relative">
              <textarea
                type="text"
                id="summary"
                name="summary"
                placeholder="Summary"
                onChange={(e) => {
                  setSummary(e.target.value);
                  autoSize(e.target);
                }}
                ref={(textarea) => {
                  if (textarea) autoSize(textarea);
                }}
                className="w-full px-3 border rounded-md focus:outline-none focus:border-blue-500 taskTextArea"
              />
            </div>
          </div>
          <div className="grid grid-cols-3"></div>

          <div className=" text-xs py-2 ">
            <label htmlFor="label" className="label-text text-xs font-bold">
              Description
            </label>
            <textarea
              className="w-full px-3 border rounded-md focus:outline-none focus:border-blue-500 taskTextArea mt-2"
              name="description"
              onChange={(e) => {
                setDescription(e.target.value);
                autoSize(e.target);
              }}
              ref={(textarea) => {
                if (textarea) autoSize(textarea);
              }}
              placeholder="Add a description"
            ></textarea>
          </div>
        </div>

        {/* Attachment */}
        <div className="p-2">
          <label htmlFor="label" className="label-text text-xs font-bold">
            Attachment
          </label>
          <br />
          <div className="grid grid-cols-5">
            {attchmentData?.map((fileData, index) => (
              <div
                className=" px-2 cursor-pointer justify-center items-center text-6xl"
                key={index}
              >
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
          <br />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={uploadAttachment} />
          </Button>
        </div>

        {/* Second box */}
        <div className="p-2">
          <div className="grid grid-cols-2">
            <div className="p-2">
              <label htmlFor="label" className=" text-xs font-bold">
                Priority
              </label>
              <br />
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasPriority}
                onClose={handleClosePriority}
                menuItems={PriorityData}
                sendData={handleProjectStatus}
              />
              <button onClick={handleTogglePriority}>
                {priority || "Select priority"}
              </button>
              {/* <p>{priority}</p> */}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-2">
              <label htmlFor="label" className=" text-xs font-bold">
                Assignee
              </label>
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleAssignee}
              >
                {assignee || "Select"}
              </button>

              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasAssignee}
                onClose={handleCloseAssignee}
                menuItems={allocatedUserDataAssignee}
                sendData={handleProjectStatus}
              />
            </div>
            <div className="p-2">
              <label htmlFor="label" className=" text-xs font-bold">
                Reporter
              </label>
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleReporter}
              >
                {reporter || "Select"}
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
          <div>
            <button className="btn web-btn" onClick={() => handleCreateTask()}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
