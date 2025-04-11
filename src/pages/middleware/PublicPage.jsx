import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicPage() {
    const authentication = localStorage.getItem("access_token");

    // Kalau udah login, lempar ke dashboard
    return authentication ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
