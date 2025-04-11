import React from 'react'

export default function SideBar() {
    return (
        <>
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
            </div>
        </>
    )
}
