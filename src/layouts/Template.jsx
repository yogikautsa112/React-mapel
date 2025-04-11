import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'

export default function Template() {
    return (
        <div className="min-vh-100 d-flex flex-column p-0">
            <Navbar />
            <div className="flex-grow-1 bg-light w-100">
                <Outlet />
            </div>
            <footer className="bg-dark text-white py-3">
                <div className="container-fluid text-center">
                    <small>&copy; 2024 Inventaris System. All rights reserved.</small>
                </div>
            </footer>
        </div>
    )
}