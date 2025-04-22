import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <h4 className="mb-4">Inventory Menu</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <Link to="/dashboard" className="nav-link text-white active">
                                <i className="bi bi-speedometer2 me-2"></i>Dashboard
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/stuff" className="nav-link text-white">
                                <i className="bi bi-box-seam me-2"></i>Categories
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/profile" className="nav-link text-white">
                                <i className="bi bi-person-circle me-2"></i>Profile
                            </Link>
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
                                    <i className="bi bi-person-circle fs-1 me-3"></i>
                                    <div>
                                        <h4 className="card-title mb-0">Welcome to Inventory Management</h4>
                                        <p className="card-text">Monitor and manage your inventory efficiently</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="col-md-4 mb-4">
                            <div className="card bg-success text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title">Total Items</h5>
                                            <h2>150</h2>
                                        </div>
                                        <i className="bi bi-box-seam fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card bg-info text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title">Available</h5>
                                            <h2>120</h2>
                                        </div>
                                        <i className="bi bi-check-circle fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card bg-warning text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title">Need Attention</h5>
                                            <h2>30</h2>
                                        </div>
                                        <i className="bi bi-exclamation-triangle fs-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Recent Activity</h5>
                                </div>
                                <div className="card-body">
                                    <div className="list-group">
                                        <div className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h6 className="mb-1">New item added</h6>
                                                <small>3 days ago</small>
                                            </div>
                                            <p className="mb-1">Added 5 new laptops to inventory</p>
                                        </div>
                                        <div className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h6 className="mb-1">Stock update</h6>
                                                <small>5 days ago</small>
                                            </div>
                                            <p className="mb-1">Updated projector stock count</p>
                                        </div>
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