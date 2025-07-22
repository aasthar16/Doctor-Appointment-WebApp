import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    const role = user?.role;

    const endpoint =
      role === "Admin"
        ? "http://localhost:5000/api/v1/user/admin/logout"
        : "http://localhost:5000/api/v1/user/doctor/logout";

    try {
      const { data } = await axios.get(endpoint, { withCredentials: true });
      toast.success(data.message);
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed!");
    }
  };

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(false);
  };

  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(false);
  };

  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(false);
  };

  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(false);
  };

  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(false);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className={show ? "show sidebar" : "sidebar"}>
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <FaUserDoctor onClick={gotoDoctorsPage} />

          {user?.role === "Admin" && (
            <>
              <MdAddModerator onClick={gotoAddNewAdmin} />
              <IoPersonAddSharp onClick={gotoAddNewDoctor} />
              <AiFillMessage onClick={gotoMessagesPage} />
            </>
          )}

          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>

      <div className="wrapper">
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
