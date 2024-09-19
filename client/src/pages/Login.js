import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      const { success, message, user, token } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === 1) {
          navigate("/dashboard");
        } else if (user.role === 0 && user.slug) {
          navigate(`/club/:${user.slug}/`);
        } else {
          alert("User slug is missing.");
        }
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <>
      <header
        id="header"
        className="headers d-flex align-items-center sticky-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="/" className="active">
                  Home
                  <br />
                </a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
          </nav>
        </div>
      </header>

      <div id="www">
        <div>
          <a href="/" className="logo text-center me-auto">
            <h1 className="sitename" style={{ color: "#e04622" }}>
              SONA PUNJAB
            </h1>
          </a>
        </div>
        <div className="form-containers">
          <form onSubmit={handleSubmit}>
            <h4 className="title">LOGIN HERE</h4>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <button type="submit" id="l" className="btn btn-primary">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
