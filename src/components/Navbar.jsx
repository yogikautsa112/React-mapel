import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar() {
  let navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access_token") !== null;

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow p-0">
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand d-flex align-items-center py-2">
          <i className="bi bi-box-seam me-2"></i>
          Inventaris
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link px-3 py-2">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link px-3 py-2">
                    <i className="bi bi-person-circle me-1"></i>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/stuff" className="nav-link px-3 py-2">
                    <i className="bi bi-card-list me-1"></i>
                    Stuffs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/inbound-stuff" className="nav-link px-3 py-2">
                    <i className="bi bi-android me-1"></i>
                    Inbound
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link px-3 py-2"
                    onClick={logoutHandler}
                    style={{ border: 'none' }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link px-3 py-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
