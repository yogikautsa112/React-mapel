import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'

export default function Template() {
    return (
        <div className="d-flex flex-column vh-100">
            <Navbar />
            <main className="flex-grow-1 bg-light">
                <Outlet />
            </main>
            <footer className="bg-dark text-white py-3">
                <div className="container-fluid text-center">
                    <small>&copy; 2024 Inventaris System. All rights reserved.</small>
                </div>
            </footer>
        </div>
    )
}