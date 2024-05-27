"use client";
import React, { useEffect, useState } from "react";
import { sendRequest } from "@/api_calls/sendRequest";
import THeader from "@/components/theader/page";
import { useRouter } from "next/navigation";

const AddProject = () => {
  const [task, setTask] = useState({
    project_name: "",
    description: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.project_name) {
      return;
    }
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("admin_id");
    let sendData = {
      project_name: task.project_name,
      description: task.description,
    };

    let data = await sendRequest("post", "api/addProjectMob", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // await createLog(adminId, `new project ${sendData.project_name}`, "post");

    // setSuccessMsg(data.data.message);
    // setTask({
    //   project_name: "",
    //   description: "",
    // });
    if (data.status == 1) {
      router.push("/projects");
    }
  };

  return (
    <div>
      <THeader heading="Add Project" routes="/projects" />
      <div className="projects">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Project *
              </label>
              <input
                type="text"
                id="project_name"
                name="project_name"
                value={task.project_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="label" className="label-text">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <button type="submit" className="btn web-btn mt-2 w-full">
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
