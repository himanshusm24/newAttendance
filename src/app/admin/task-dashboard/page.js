"use client";
import React, { useEffect, useState } from "react";
import "../../theme2.css";
import {
  LuFiles,
  LuFolderOpenDot,
  LuFileText,
  LuFileScan,
  LuFileSearch,
  LuFileCheck2,
  LuFileLock2,
} from "react-icons/lu";
import { PieChart } from "@mui/x-charts/PieChart";
// Component
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import { generateColors } from "@/utils/generateColors";

// Api call
import { sendRequest } from "@/api_calls/sendRequest";

const Dashboard = () => {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [totalProjects, setTotalProject] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [totalOpenTask, setTotalOpenTask] = useState(0);
  const [totalInProgressTask, setTotalInProgressTask] = useState(0);
  const [totalInReviewTask, setTotalInReviewTask] = useState(0);
  const [totalDoneTask, setTotalDoneTask] = useState(0);
  const [totalOnHoldTask, setTotalOnHoldTask] = useState(0);
  const [userStatus, setUserStatus] = useState([]);
  const [userColors, setUserColors] = useState([]);

  const handleAllProjects = async () => {
    try {
      const dashboardData = await sendRequest(
        "get",
        "api/dashboard",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = dashboardData.data.data[0];
      const userStatusData = dashboardData?.data?.userResult;
      const transformedData = userStatusData.map((user) => ({
        label: user.userName,
        id: user.userId,
        value: user.user_task_count,
      }));
      const usercolors = await generateColors(userStatusData.length);
      setUserColors(usercolors);
      setTotalProject(data.total_project_count);
      setTotalTask(data.task_count);
      setTotalOpenTask(data.open_task_count);
      setTotalInProgressTask(data.in_progress_task_count);
      setTotalInReviewTask(data.in_review_task_count);
      setTotalOnHoldTask(data.on_hold_task_count);
      setTotalDoneTask(data.done_task_count);
      setUserStatus(transformedData);
    } catch (error) {
      console.error("Error fetching project or task data:", error);
    }
  };

  useEffect(() => {
    handleAllProjects();
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
          <section className="web-wrapper dashboard">
            <div className="flex align-center justify-between mb-4">
              <h2 className="page-title mb-0">Admin Dashboard</h2>
            </div>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="dashboard-box">
                <LuFolderOpenDot className="icon default-color" />
                <div className="content">
                  <h2 className="number">{totalProjects}</h2>
                  <p className="title">Total Project</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFiles className="icon default-color" />
                <div className="content">
                  <h2 className="number">{totalTask}</h2>
                  <p className="title">Total Task</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFileScan className="icon bg-neutral-200 text-neutral-600" />
                <div className="content">
                  <h2 className="number">{totalOpenTask}</h2>
                  <p className="title">Task Open</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFileText className="icon bg-blue-50 text-blue-800" />
                <div className="content">
                  <h2 className="number">{totalInProgressTask}</h2>
                  <p className="title">Task In Progress</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFileSearch className="icon bg-cyan-50 text-cyan-800" />
                <div className="content">
                  <h2 className="number">{totalInReviewTask}</h2>
                  <p className="title">Task In Review</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFileCheck2 className="icon bg-green-50 text-green-800" />
                <div className="content">
                  <h2 className="number">{totalDoneTask}</h2>
                  <p className="title">Task Done</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuFileLock2 className="icon bg-red-50 text-red-800" />
                <div className="content">
                  <h2 className="number">{totalOnHoldTask}</h2>
                  <p className="title">Task On Hold</p>
                </div>
              </div>
              <div className="dashboard-box chart xl:col-span-2 lg:col-span-3 col-span-2">
                <h2 className="page-title w-full">All Issue - Status</h2>
                <PieChart
                  colors={[
                    "#525252",
                    "#1565c0",
                    "#00838f",
                    "#2e7d32",
                    "#c62828",
                    "#ef6c00",
                  ]}
                  series={[
                    {
                      data: [
                        { id: 0, value: totalOpenTask, label: "Open" },
                        {
                          id: 1,
                          value: totalInProgressTask,
                          label: "In Progress",
                        },
                        {
                          id: 2,
                          value: totalInReviewTask,
                          label: "In Review",
                        },
                        { id: 3, value: totalDoneTask, label: "Done" },
                        { id: 4, value: totalOnHoldTask, label: "On Hold" },
                      ],
                      innerRadius: 30,
                      outerRadius: 150,
                      paddingAngle: 2,
                      cornerRadius: 5,
                      startAngle: -180,
                      endAngle: 180,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  width={500}
                  height={320}
                />
              </div>
              <div className="dashboard-box chart xl:col-span-2 lg:col-span-3 col-span-2">
                <h2 className="page-title w-full">All Member - Open Tasks</h2>
                <PieChart
                  // colors={[
                  //   "#dc2626",
                  //   "#d97706",
                  //   "#65a30d",
                  //   "#059669",
                  //   "#0891b2",
                  //   "#7c3aed",
                  //   "#c026d3",
                  //   "#db2777",
                  // ]}
                  colors={userColors}
                  series={[
                    {
                      data: userStatus,
                      innerRadius: 30,
                      outerRadius: 150,
                      paddingAngle: 2,
                      cornerRadius: 5,
                      startAngle: -180,
                      endAngle: 180,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  width={500}
                  height={320}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
