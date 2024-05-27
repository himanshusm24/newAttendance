/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Wallet, Newspaper, Plus } from "lucide-react";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendRequest } from "@/api_calls/sendRequest";
import { List } from "lucide-react";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { FaBarsProgress } from "react-icons/fa6";
import { FaBars, FaChartBar, FaEdit } from "react-icons/fa";
import { LuFolderCog, LuFolderCheck } from "react-icons/lu";
import secureLocalStorage from "react-secure-storage";

const TaskSidebar = ({ sidemenu, clickEvent, addEvent, subAddEvent }) => {
  const router = useRouter();
  const [opensideMenu, setOpenSideMenu] = useState(sidemenu);
  const [projectData, setProjectData] = useState([]);
  const [subProjectData, setSubProjectData] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState([]);
  const [activeLink, setActiveLink] = useState("");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const projectSidebarData = secureLocalStorage.getItem("projectData");

  // const allProjects = async () => {
  //   const data = await sendRequest(
  //     "get",
  //     "api/getProject",
  //     {},
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   setProjectData(data?.data?.data);
  // };

  const getSubProjects = async (id) => {
    const data = await sendRequest(
      "get",
      `api/subProject?project_id=${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSubProjectData(data?.data?.data);
  };

  useEffect(() => {
    setOpenSideMenu(sidemenu);
  }, [sidemenu]);

  useEffect(() => {
    // allProjects();
    setProjectData(JSON.parse(projectSidebarData));
    const data = localStorage.getItem("clickedsidebar");
    setActiveLink(data);
  }, []);

  const handleProjectClick = (projectId) => {
    // if (expandedProjects.includes(projectId)) {
    //   setExpandedProjects(expandedProjects.filter((id) => id !== projectId));
    // } else {
    //   setExpandedProjects([projectId]);
    // }
    const newExpandedRows = [...expandedProjects];
    const currentIndex = newExpandedRows.indexOf(projectId);
    if (currentIndex !== -1) {
      newExpandedRows.splice(currentIndex, 1);
    } else {
      newExpandedRows.splice(0, newExpandedRows.length, projectId);
    }

    setExpandedProjects(newExpandedRows);
    // setExpandedProjects(null);
    // setExpandedProjects(currentIndex)
  };

  const handleLinkClick = (href) => {
    setActiveLink(href);
    localStorage.setItem("clickedsidebar", href);
  };

  return (
    <aside
      className={`flex h-screen w-64 flex-col border-r mt-[-32px] ml-[-20px] px-5 py-8 fixed admin-sidebar ${opensideMenu} overflow-y-auto overflow-x-hidden `}
    >
      <a href="/admin/task-dashboard">
        <img src="/img/7oclock-logo.png" className="logo" alt="Image" />
      </a>

      <button
        className="sidebar-main-btns"
        onClick={() => {
          localStorage.removeItem("sidebar");
          clickEvent(true);
        }}
      >
        <FaBars />
        Main menu
      </button>

      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav>
          <label className="sidebar-h">Task Management</label>

          <Link
            href={"/admin/task-dashboard"}
            className={`nav-item ${
              activeLink === "/admin/task-dashboard"
                ? "nav-item active"
                : "nav-item"
            }`}
            onClick={() => handleLinkClick("/admin/task-dashboard")}
          >
            <FaChartBar />
            <span>Dashboard</span>
          </Link>

          <button
            className="nav-item "
            onClick={() => {
              addEvent("addPorject");
            }}
          >
            <LuFolderCheck />
            <span>Create Projects</span>
          </button>

          <Link
            href={"/admin/projects/listProject"}
            // className="nav-item"
            className={`nav-item ${
              activeLink === "/admin/projects/listProject"
                ? "nav-item active"
                : "nav-item"
            }`}
            onClick={() => handleLinkClick("/admin/projects/listProject")}
          >
            <LuFolderCog />
            <span>Manage Projects</span>
          </Link>

          <Link
            href={"/admin/tasks/list-tasks"}
            // className="nav-item"
            className={`nav-item ${
              activeLink === "/admin/tasks/list-tasks"
                ? "nav-item active"
                : "nav-item"
            }`}
            onClick={() => handleLinkClick("/admin/tasks/list-tasks")}
          >
            <LuFolderCog />
            <span>Manage Tasks</span>
          </Link>

          <ul className="menu dropdown-menus mt-2">
            <li className="d-flex dropdown-item">
              <details>
                <summary>Management</summary>
                <ul>
                  <li>
                    <Link
                      href={"/admin/task-status"}
                      onClick={() => handleLinkClick("/admin/task-status")}
                    >
                      Status
                    </Link>
                  </li>
                  {/* <li>
                    <a>Submenu 2</a>
                  </li> */}
                </ul>
              </details>
            </li>
          </ul>

          <ul className="menu dropdown-menus mt-2">
            {projectData?.map((res, index) => (
              <li key={index} className="d-flex dropdown-item">
                {/* <details open={expandedProjects.includes(res.project_id)}> */}
                <details
                  onClick={() => {
                    console.log(res.project_id);
                    console.log("CKUCSCASC");
                    getSubProjects(res.project_id);
                    handleProjectClick(res.project_id);
                  }}
                >
                  <summary>
                    <FaRegFolderOpen />
                    {/* <Link href="/admin/projects/listProject"> */}
                    {res.project_name}
                    {/* </Link> */}
                  </summary>

                  {subProjectData.length != 0 ? (
                    <ul>
                      {subProjectData.map((res, index) => (
                        <li key={index} onClick={() => console.log("CLICKED")}>
                          <summary
                            onClick={() => {
                              console.log(res.project_id);
                              router.push(
                                `/admin/tasks/list-tasks?project=${res.project_id}`
                              );
                            }}
                          >
                            <FaBarsProgress /> {res.project_name}
                          </summary>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No sub project added yet"
                  )}
                </details>

                <div className="dropdown plus-dropdown">
                  <summary tabIndex={0} role="button">
                    <Plus onClick={() => console.log("clicked")} />
                  </summary>
                  <ul className="menu dropdown-content z-[1]">
                    <li>
                      <button
                        onClick={() => {
                          console.log(res.project_id);
                          subAddEvent(res.project_id);
                        }}
                      >
                        <FaBarsProgress />
                        Add Sub Project
                      </button>
                    </li>
                    <li>
                      <button>
                        <FaRegTrashAlt />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default TaskSidebar;
