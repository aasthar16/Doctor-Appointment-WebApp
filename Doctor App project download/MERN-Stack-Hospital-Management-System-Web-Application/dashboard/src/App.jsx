import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
