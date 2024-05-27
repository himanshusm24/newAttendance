/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { confirmAlert } from "react-confirm-alert";
import { withAuth } from "@/utils/authorization";
import showAlert from "@/api_calls/alert/alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer } from "react-toastify";

// Component
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
// Api call
import { sendRequest } from "@/api_calls/sendRequest";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { CreateUser } from "@/api_calls/admin/user/create-user";
import { useSearchParams } from "next/navigation";
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { UpdateUser } from "@/api_calls/admin/user/update-user";
import { getRole } from "@/api_calls/admin/roles/get-roles";
import { getDepartment } from "@/api_calls/admin/department/get-department";

const AddUsers = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [branchId, setBranchId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [aadhar_no, setAadharNo] = useState("");
  const [pan_no, setPanNo] = useState("");
  const [paid_leave, setPaidleave] = useState("");
  const [password, setPassword] = useState("");
  const [user_id, setUserId] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Employee");
  const [editMessage, setEditMessage] = useState("");
  const [roleDetail, setRoleDetail] = useState([]);
  const [departmentDetail, setDepartmentDetail] = useState([]);
  const [userType, setUserType] = useState("");
  const [userTypeDetail, setUserTypeDetail] = useState([]);

  const [disabledInput, setDisabledInput] = useState(false);

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    getCompanyList();
    getEmployeeDetails();
    getRoleData();
    getDepartmentData();
    getUserType();
  }, []);

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data.data.data;
    setCompanyList([...companyList, ...list]);
  };

  const getRoleData = async () => {
    const data = await getRole();
    setRoleDetail(data.data.data);
  };
  const getDepartmentData = async () => {
    const data = await getDepartment();
    setDepartmentDetail(data.data.data);
  };

  const getEmployeeDetails = async () => {
    const user_id = atob(params.get("user_id"));
    if (user_id > 0) {
      setDisabledInput(true);
    }
    if (user_id > 0) {
      setUserId(user_id);
      const data = await UserListss(user_id);
      const userData = data.data.data[0];
      const dateOfBirth = moment(userData.dob).format("YYYY-MM-DD");
      setBranchId(userData.branch_id);
      setName(userData.name);
      setDesignation(userData.designation);
      setRole(userData.role_id);
      setDepartment(userData.department_id);
      setEmail(userData.email);
      setDob(dateOfBirth);
      setContact(userData.contact);
      setGender(userData.gender);
      setAadharNo(userData.aadhar_no);
      setPanNo(userData.pan_no);
      setPaidleave(userData.paid_leave);
      setUserType(userData.user_type);
      setBtnName("Update Employee");
      setEditMessage(
        "(Please Enter Password, If you want to change your password)"
      );
    }
  };

  const addUser = async (event) => {
    event.preventDefault();

    let obj = {
      branch_id: branchId,
      name: name,
      designation: designation,
      role_id: role,
      department_id: department,
      user_type: userType,
      email: email,
      contact: contact,
      gender: gender,
      paid_leave: paid_leave,
      aadhar_no: aadhar_no,
      pan_no: pan_no,
      password: password,
    };
    // if (aadhar_no != "") {
    //   obj = {
    //     ...obj,
    //     aadhar_no: aadhar_no,
    //   };
    // }
    // if (pan_no != "") {
    //   obj = {
    //     ...obj,
    //     pan_no: pan_no,
    //   };
    // }
    if (dob != "") {
      obj = {
        ...obj,
        dob: dob != "" && dob != "Invalid date" ? dob : "",
      };
    }
    const user_id = atob(params.get("user_id"));

    console.log(obj);

    const reponse =
      user_id > 0 ? await UpdateUser(obj, user_id) : await CreateUser(obj);

    if (reponse.status == true && reponse.data.data.affectedRows == 1) {
      /* confirmAlert({
        message: "Data submitted",
        buttons: [
          {
            label: "Ok",
            onClick: (e) => {
              router.push("/admin/manage-users");
            },
          },
        ],
      }); */

      showAlert("success", "User Updated Successfully");
      router.push("/admin/manage-users");
    } else {
      /* setErrorMsg(reponse.message); */
      showAlert("error", reponse.message);
    }
  };

  const getUserType = async () => {
    const data = await sendRequest(
      "get",
      "api/user-type",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserTypeDetail(data.data.data);
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
            breadcumr1={"Manage Employee"}
            breadcumr1_link={"/admin/manage-users"}
            breadcumr2={btnName}
            button_name={"Employee List"}
            button_link={"/admin/manage-users"}
          />
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
          {successMsg != "" && successMsg != null ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
              role="alert"
            >
              <span className="block sm:inline">{successMsg}</span>
            </div>
          ) : (
            ""
          )}
          <div className="mt-3">
            <div className="card">
              <div className="card-header bg-white p-3 pb-4 border">
                <h3 className="font-bold">{btnName}</h3>
              </div>
              <div className="card-body bg-white py-2">
                <form onSubmit={addUser} method="post" autoComplete="off">
                  <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Branch List</span>
                      </div>
                      <select
                        className="input select select-bordered w-full"
                        name="company"
                        onChange={(e) => {
                          setBranchId(e.target.value);
                        }}
                        value={branchId}
                      >
                        <option value="" disabled selected>
                          Select Branch
                        </option>
                        {companyList?.map((company, index) => {
                          return (
                            <>
                              <option value={company.id} key={index}>
                                {company.name}
                              </option>
                            </>
                          );
                        })}
                      </select>
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Employee Name</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Name"
                        className="input input-bordered w-full"
                        name="name"
                        minLength={5}
                        maxLength={50}
                        required={true}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        value={name}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Employee Designation</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Designation"
                        name="designation"
                        className="input input-bordered w-full"
                        required={true}
                        onChange={(e) => {
                          setDesignation(e.target.value);
                        }}
                        value={designation}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Email Address</span>
                      </div>
                      <input
                        type="email"
                        placeholder="Employee Email"
                        className="input input-bordered w-full"
                        name="email"
                        required={true}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">User Type</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="department"
                        value={userType}
                        required={true}
                        onChange={(e) => {
                          setUserType(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select User Type
                        </option>
                        {userTypeDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Department</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="department"
                        value={department}
                        required={true}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Department
                        </option>
                        {departmentDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Role</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="role"
                        value={role}
                        required={true}
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Role
                        </option>
                        {roleDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Contact Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Employee Contact"
                        className="input input-bordered w-full"
                        name="contact"
                        required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setContact(e.target.value);
                          }
                        }}
                        value={contact}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Gender</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="gender"
                        value={gender}
                        required={true}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Date of Birth</span>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        name="dob"
                        min={moment()
                          .subtract(80, "years")
                          .format("YYYY-MM-DD")}
                        max={moment()
                          .subtract(10, "years")
                          .format("YYYY-MM-DD")}
                        // required={true}
                        onChange={(e) => {
                          setDob(e.target.value);
                        }}
                        value={dob}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Aadhar Number</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Aadhar Number"
                        className="input input-bordered w-full"
                        name="aadhar_no"
                        // required={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 16) {
                            setAadharNo(e.target.value);
                          }
                        }}
                        value={aadhar_no}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Pan Number</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Pan Number"
                        className="input input-bordered w-full"
                        name="pan_no"
                        // require={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setPanNo(e.target.value);
                          }
                        }}
                        value={pan_no}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Paid Leave</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Employee Paid Leave"
                        className="input input-bordered w-full"
                        name="paid_leave"
                        // require={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 4) {
                            setPaidleave(e.target.value);
                          }
                        }}
                        value={paid_leave}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">
                          Password <small>{editMessage}</small>
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Password"
                        className="input input-bordered w-full"
                        name="password"
                        require={true}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <hr />
                    <div className="w-full">
                      <button
                        type="submit"
                        className="btn web-btn text-white sm:mt-0 md:mt-4"
                      >
                        {btnName}
                      </button>
                      <button
                        type="reset"
                        className="btn btn-warning mx-5 px-8"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// export default AddUsers;

const ManageAddUsersPage = withAuth(AddUsers, "User");

export default ManageAddUsersPage;
