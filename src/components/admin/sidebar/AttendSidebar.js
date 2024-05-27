/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaBars,
  FaChartBar,
  FaRegFileAlt,
  FaRegUser,
  FaRegCalendarCheck,
  FaRegBuilding,
} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { GrUserSettings } from "react-icons/gr";
import { BsBuildingGear } from "react-icons/bs";
import { LuMailPlus } from "react-icons/lu";
import { sendRequest } from "@/api_calls/sendRequest";

const AttendanceSidebar = ({ sidemenu, clickEvent }) => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");
  const [opensideMenu, setOpenSideMenu] = useState(sidemenu);

  const [permissionAccessed, setPermissionAccessed] = useState([]);

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    setOpenSideMenu(sidemenu);
  }, [sidemenu]);

  const handleLinkClick = (href) => {
    setActiveLink(href);
    localStorage.setItem("clickedsidebar", href);
  };

  useEffect(() => {
    const data = localStorage.getItem("clickedsidebar");
    setActiveLink(data);
  }, []);

  const getAllPermissions = async () => {
    const user_Id = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/permission?usertypeId=${user_Id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPermissionAccessed(data.data.data);
  };

  const getAllowedRoles = async () => {
    const user_type_Id = localStorage.getItem("user_type_id");
    const data = await sendRequest(
      "get",
      `api/permission/allowedRoles?usertypeId=${user_type_Id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      localStorage.setItem("allowedRoles", JSON.stringify(data?.data?.data));
    }
  };

  useEffect(() => {
    getAllPermissions();
    getAllowedRoles();
  }, []);
  // console.log("permissionAccessed: ", permissionAccessed);

  return (
    <aside
      className={`flex h-screen w-64 flex-col border-r mt-[-32px] ml-[-20px] px-5 py-8 fixed admin-sidebar ${opensideMenu}`}
    >
      <a href="/admin/dashboard">
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
          <label className="sidebar-h">Admin Dashboard</label>
          {/* <Link href={"/admin/dashboard"} className="nav-item active"> */}

          {permissionAccessed.map((res, index) => {
            return (
              <>
                {res.module == "Dashboard" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={permission.id}
                            href={"/admin/dashboard"}
                            as={"/admin/dashboard"}
                            className={
                              activeLink === "/admin/dashboard"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() => handleLinkClick("/admin/dashboard")}
                          >
                            <FaChartBar />
                            <span>Dashboard</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "basicDetails" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/basic-details"}
                            as={"/admin/basic-details"}
                            className={
                              activeLink === "/admin/basic-details"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/basic-details")
                            }
                          >
                            <FaRegFileAlt />
                            <span>Basic Details</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "userType" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-usertype"}
                            as={"/admin/manage-usertype"}
                            className={
                              activeLink === "/admin/manage-usertype"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-usertype")
                            }
                          >
                            <FaRegFileAlt />
                            <span>Manage User type</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "user" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-users"}
                            as={"/admin/manage-users"}
                            className={
                              activeLink === "/admin/manage-users"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-users")
                            }
                          >
                            <FaRegFileAlt />
                            <span>Manage User</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "attendance" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-attendance"}
                            // className="nav-item"
                            as={"/admin/manage-attendance"}
                            className={
                              activeLink === "/admin/manage-attendance"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-attendance")
                            }
                          >
                            <FiUsers />
                            <span>Manage Attendance</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "branch" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-company"}
                            // className="nav-item "
                            className={
                              activeLink === "/admin/manage-company"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-company")
                            }
                          >
                            <FaRegBuilding />
                            <span>Manage Branch</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "Employee" &&
                  res.permissions.map((permission) => {
                    if (permission.type === 4 && permission.check == 1) {
                      return (
                        <Link
                          key={index}
                          href={"/admin/manage-users"}
                          // className="nav-item"
                          className={
                            activeLink === "/admin/manage-users"
                              ? "nav-item active"
                              : "nav-item"
                          }
                          onClick={() => handleLinkClick("/admin/manage-users")}
                        >
                          <FaRegUser />
                          <span>Manage Employee</span>
                        </Link>
                      );
                    } else {
                      return null;
                    }
                  })}

                {res.module == "holiday" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-holiday"}
                            // className="nav-item"
                            className={
                              activeLink === "/admin/manage-holiday"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-holiday")
                            }
                          >
                            <FaRegCalendarCheck />
                            <span>Manage Holiday</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "roles" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-roles"}
                            // className="nav-item"
                            className={
                              activeLink === "/admin/manage-roles"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-roles")
                            }
                          >
                            <GrUserSettings />
                            <span>Manage Roles</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "department" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-department"}
                            // className="nav-item"
                            className={
                              activeLink === "/admin/manage-department"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-department")
                            }
                          >
                            <BsBuildingGear />
                            <span>Manage Department</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}

                {res.module == "defaultMails" ? (
                  <>
                    {res.permissions.map((permission) => {
                      if (permission.type == 4 && permission.check == 1) {
                        return (
                          <Link
                            key={index}
                            href={"/admin/manage-default-mails"}
                            // className="nav-item"
                            className={
                              activeLink === "/admin/manage-default-mails"
                                ? "nav-item active"
                                : "nav-item"
                            }
                            onClick={() =>
                              handleLinkClick("/admin/manage-default-mails")
                            }
                          >
                            <LuMailPlus />
                            <span>Manage Default Mails</span>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                ) : (
                  ""
                )}
              </>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AttendanceSidebar;
