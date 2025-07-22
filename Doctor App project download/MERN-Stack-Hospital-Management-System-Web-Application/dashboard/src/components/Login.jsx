import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password,  role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("Admin");

      navigateTo("/"); // Optional: Redirect based on role if needed
    } catch (error) {
  const message =
    error?.response?.data?.message || "Login failed. Please try again.";
  toast.error(message);
}

  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const roles = ["Admin", "Doctor"];

  return (
    <section className="container form-component">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="form-title">WELCOME TO ZEECARE</h1>
      <p>Only Admins and Doctors are allowed to access these resources!</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((r, index) => (
            <option value={r} key={index}>
              {r}
            </option>
          ))}
        </select>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
