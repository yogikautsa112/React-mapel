import React, { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData({
        username: parsedUser.username,
        email: parsedUser.email,
        role: parsedUser.role,
      });
    }
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="position-relative">
              <div className="bg-primary text-white text-center py-5 rounded-top">
                <div className="position-relative">
                  <img
                    src="https://ui-avatars.com/api/?name=${userData.username}&background=random"
                    className="rounded-circle border-3 border-white border shadow"
                    alt="Profile"
                    style={{ width: "120px", height: "120px", marginBottom: "-60px" }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body px-4 pt-5 pb-4 text-center">
              <h3 className="mb-4">{userData.username}</h3>
              <div className="row g-4 justify-content-center">
                <div className="col-sm-6">
                  <div className="p-3 border rounded bg-light">
                    <div className="text-muted mb-1">
                      <i className="bi bi-envelope me-2"></i>Email
                    </div>
                    <div className="fw-medium">{userData.email}</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded bg-light">
                    <div className="text-muted mb-1">
                      <i className="bi bi-person-badge me-2"></i>Role
                    </div>
                    <div className="fw-medium text-capitalize">{userData.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
