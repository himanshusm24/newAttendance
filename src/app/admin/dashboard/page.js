"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { AttedanceListDashBoard } from "@/api_calls/admin/attendance/attendanceListDashboard";
import moment from "moment";
import { FaUserLarge } from "react-icons/fa6";
import { LuUsers, LuBuilding, LuUserCheck2, LuUserX2 } from "react-icons/lu";
import { withAuth } from "@/utils/authorization";

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [totalCompany, setTotalCompany] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);

  const allCompany = async () => {
    const data = await CompanyLists();
    setTotalCompany(data?.data?.data?.length);
  };

  const allUsers = async () => {
    const data = await UserListss();
    setTotalUsers(data?.data?.data.length);
  };

  const attendanceCount = async () => {
    const data = await AttedanceListDashBoard(
      moment(new Date()).format("YYYY-MM-DD")
    );
    console.log("data: ", data?.data.data);
    setTotalAttendance(data?.data?.data);
  };

  useEffect(() => {
    allCompany();
    allUsers();
    attendanceCount();
  }, []);

  // console.log("todayDate", moment(new Date()).format("YYYY-MM-DD"));

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
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="dashboard-box">
                <LuBuilding className="icon default-color" />
                <div className="content">
                  <h2 className="number">{totalCompany}</h2>
                  <p className="title">Total Branches</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuUsers className="icon default-color" />
                <div className="content">
                  <h2 className="number">{totalUsers}</h2>
                  <p className="title">Total Users</p>
                </div>
              </div>
              {/* <div className="dashboard-box">
                    <h2 className="number">{totalAttendance.totalAttendance}</h2>
                    <p className="title">Today Attendance</p>
              </div> */}
              <div className="dashboard-box">
                <LuUserCheck2 className="icon bg-green-50 text-green-800" />
                <div className="content">
                  <h2 className="number">{totalAttendance?.presentEmployee}</h2>
                  <p className="title">Today Present</p>
                </div>
              </div>
              <div className="dashboard-box">
                <LuUserX2 className="icon bg-red-50 text-red-800" />
                <div className="content">
                  <h2 className="number">{totalAttendance?.absentEmployee}</h2>
                  <p className="title">Today Absent</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

// export default Dashboard;

// export default withAuth(Dashboard, ['Admin', 'SuperAdmin']);
// export default withAuth(Dashboard, "Dashboard");

const ManageDashboardPage = withAuth(Dashboard, "Dashboard");

export default ManageDashboardPage;

