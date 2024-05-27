"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/admin/sidebar/page";
import "./header.css";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

const menuItems = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "About",
    href: "#",
  },
  {
    name: "Contact",
    href: "#",
  },
];

const Header = ({ clickEvent, sidebarVisible }) => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    let user_type = localStorage.getItem("user_type");

    if (user_type !== "Admin") {
      router.push("/admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_contact");
    localStorage.removeItem("company_name");
    localStorage.removeItem("allowedRoles");
    localStorage.removeItem("clickedsidebar");
    localStorage.removeItem("sidebar");
    localStorage.removeItem("projectData");
    router.push("/admin");
  };

  const handleCompanyName = () => {
    let data = localStorage.getItem("company_name");
    setCompanyName(data);
  };

  useEffect(() => {
    handleCompanyName();
  }, []);

  return (
    <>
      <div className="header">
        <div className="web-wrapper">
          <div className="flex items-center justify-between">
            <div className="hidden grow items-start lg:flex">
              <h2 className="header-heading"> {companyName} </h2>
            </div>
            <div className="hidden lg:block">
              <button
                type="button"
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={logout}
              >
                Logout
              </button>
            </div>
            <div className="lg:hidden">
              {/* <h2 className="header-heading">Admin Dashboard</h2> */}
              <a href="/admin/dashboard">
                <img
                  src="/img/7oclock-logo.png"
                  className="mobile-logo"
                  alt="Image"
                />
              </a>
            </div>
            <div className="lg:hidden ">
              {sidebarVisible == true ? (
                <CloseIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={clickEvent}
                />
              ) : (
                <Menu className="h-6 w-6 cursor-pointer" onClick={clickEvent} />
              )}
            </div>
          </div>
        </div>

        {sidebarVisible && <div className="overlay" onClick={clickEvent}></div>}
      </div>
    </>
  );
};

export default Header;
