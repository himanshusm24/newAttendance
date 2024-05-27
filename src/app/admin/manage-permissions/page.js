"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { useSearchParams } from "next/navigation";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer } from "react-toastify";
import showAlert from "@/api_calls/alert/alert";

const Permissions = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const params = useSearchParams();
  const UserPermissionId = params.get("id");
  const UserPermissionType = params.get("name");

  const [allPermissions, setAllPermissions] = useState([]);

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    getAllPermissions();
    getAllPermissionsRelations();
  }, []);

  const getAllPermissions = async () => {
    const data = await sendRequest(
      "get",
      `api/permission?usertypeId=${UserPermissionId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    // setUserTypeList(data.data.data);
    setAllPermissions(data.data.data);
  };

  const getAllPermissionsRelations = async () => {
    const data = await sendRequest(
      "get",
      `api/user-permission-relation?usertypeId=${UserPermissionId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const handleCheckboxToggle = (groupIndex, permissionIndex) => {
    const updatedPermissions = [...allPermissions];
    updatedPermissions[groupIndex].permissions[permissionIndex].check =
      updatedPermissions[groupIndex].permissions[permissionIndex].check === 1
        ? 0
        : 1;
    setAllPermissions(updatedPermissions);
  };

  const convertedData = allPermissions.flatMap((item) =>
    item.permissions.map((permission) => ({
      usertypeId: UserPermissionId,
      permissionId: permission.id,
      check: permission.check,
    }))
  );

  const handleSaveChanges = async () => {
    // console.log("convertedData: ", convertedData);
    const data = await sendRequest(
      "post",
      "api/user-permission-relation/setPermission",
      { data: convertedData },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data", data);
    showAlert("success", "Permission Updated");
  };

  return (
    <div className="main-wrapper">
      <ToastContainer />
      <Sidebar
        sidemenu={`${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}
      />
      <div className="rightside">
        <Header
          clickEvent={() => {
            setSidebarVisible(!isSidebarVisible);
          }}
          sidebarVisible={isSidebarVisible}
        />

        <section className="mx-auto w-full">
          <BreadCrum
            breadcumr1={"Manage Permissions"}
            breadcumr1_link={"/admin/manage-permissions"}
            button_name={"Add Permission"}
            button_link={"manage-permissions/add-permission"}
          />

          {/* <div className="p-4">
            <h1>{UserPermissionType}</h1>
            {allPermissions.map((permissionGroup, index) => (
              <div key={index} className="py-2">
                <h2 className="font-bold mb-2">{permissionGroup.module}:</h2>
                <div>
                  {permissionGroup.permissions.map((res, index) => (
                    <label>
                      <input
                        type="checkbox"
                        id={`add-${index}`}
                        checked={res.check === 1}
                        onChange={() => {
                          console.log(permissionGroup);
                        }}
                      />
                      {res.type}({res.id})
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-2 text-sm">
              <button className="btn web-btn text-white sm:mt-0 md:mt-4">
                Save Changes
              </button>
              <button className="btn btn-warning mx-5 px-8">Cancel</button>
            </div>
          </div> */}

          <div className="p-4">
            <h1>{UserPermissionType}</h1>
            {allPermissions.map((permissionGroup, groupIndex) => (
              <div key={groupIndex} className="py-2">
                <h2 className="font-bold mb-2">{permissionGroup.module}:</h2>
                <div>
                  {permissionGroup.permissions.map((res, permissionIndex) => (
                    <label key={permissionIndex}>
                      <input
                        type="checkbox"
                        id={`add-${permissionIndex}`}
                        checked={res.check === 1}
                        onChange={() =>
                          handleCheckboxToggle(groupIndex, permissionIndex)
                        }
                      />
                      {res.type == 1 ? "Add" : ""} {res.type == 2 ? "Edit" : ""}{" "}
                      {res.type == 3 ? "Delete" : ""}{" "}
                      {res.type == 4 ? "View" : ""} 
                      {/* ({res.id}) */}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-2 text-sm">
              <button
                className="btn web-btn text-white sm:mt-0 md:mt-4"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              {/* <button className="btn btn-warning mx-5 px-8">Cancel</button> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Permissions;