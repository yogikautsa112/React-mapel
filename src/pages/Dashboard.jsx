import React from 'react';

export default function Dashboard() {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <h4 className="mb-4">Dashboard Menu</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white">Home</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white">Profile</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link text-white">Settings</a>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="col-md-9 col-lg-10 p-4">
                    <div className="row">
                        {/* Welcome Card */}
                        <div className="col-12 mb-4">
                            <div className="card bg-primary text-white">
                                <div className="card-body d-flex align-items-center">
                                    <img
                                        src="URL_ADDRESS.placeholder.com/150x150"
                                        className="rounded-circle me-3"
                                        alt="Profile"
                                        style={{ width: "60px", height: "60px" }}
                                    />
                                    <div>
                                        <h4 className="card-title mb-0">Welcome back!</h4>
                                        <p className="card-text">What would you like to do today?</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Cards */}
                        <div className="col-md-4 mb-4">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Projects</h5>
                                    <h2>12</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Tasks</h5>
                                    <h2>25</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Messages</h5>
                                    <h2>8</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}