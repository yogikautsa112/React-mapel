import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constant';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        availableItems: 0,
        needAttention: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [stuffsResponse, inboundResponse] = await Promise.all([
                axios.get(`${API_URL}/stuffs`),
                axios.get(`${API_URL}/inbound-stuffs`)
            ]);

            const stuffs = stuffsResponse.data.data;
            const inbounds = inboundResponse.data.data;

            // Calculate stats
            const totalItems = stuffs.length;
            const availableItems = stuffs.filter(item => item.stuff_stock?.total_available > 0).length;
            const needAttention = stuffs.filter(item => item.stuff_stock?.total_defec > 0).length;

            setStats({
                totalItems,
                availableItems,
                needAttention
            });

            // Get recent activities
            const recent = inbounds
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
                .map(inbound => ({
                    id: inbound.id,
                    title: 'New item added',
                    description: `Added ${inbound.total} ${inbound.stuff?.name}`,
                    date: new Date(inbound.created_at).toLocaleDateString('id-ID')
                }));

            setRecentActivity(recent);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

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
                            <Link to="/dashboard/admin/stuff" className="nav-link text-white">
                                <i className="bi bi-box-seam me-2"></i>Categories
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/dashboard/admin/profile" className="nav-link text-white">
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
                                            <h2>{stats.totalItems}</h2>
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
                                            <h2>{stats.availableItems}</h2>
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
                                            <h2>{stats.needAttention}</h2>
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
                                        {recentActivity.length === 0 ? (
                                            <p className="text-center text-muted my-3">No recent activity</p>
                                        ) : (
                                            recentActivity.map(activity => (
                                                <div key={activity.id} className="list-group-item">
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h6 className="mb-1">{activity.title}</h6>
                                                        <small>{activity.date}</small>
                                                    </div>
                                                    <p className="mb-1">{activity.description}</p>
                                                </div>
                                            ))
                                        )}
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