import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constant";

export default function Login() {
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState([]);
    let navigate = useNavigate();

    function LoginProcess(e) {
        e.preventDefault();
        axios.post(API_URL + '/login', login)
            .then(res => {
                localStorage.setItem('access_token', res.data.data.access_token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));
                navigate('/dashboard');
            })
            .catch(err => {
                setError(err.response.data);
            });
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <form className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "90%" }} onSubmit={LoginProcess}>
                <div className="card-header bg-primary text-white text-center py-3">
                    <h4 className="mb-0">Login</h4>
                </div>
                {
                    Object.keys(error).length > 0 && (
                        <div className="alert alert-danger m-3 mb-0">
                            <ul className="mb-0">
                                {
                                    Object.entries(error.data).length > 0 
                                        ? Object.entries(error.data).map(([key, value], index) => (
                                            <li key={`error-${key}-${index}`}>{value}</li>
                                        )) 
                                        : <li key="error-message">{error.message}</li>
                                }
                            </ul>
                        </div>
                    )
                }
                <div className="card-body p-4">
                    <div className="mb-4">
                        <label className="form-label text-muted">Username</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-person"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter your username"
                                value={login.username}
                                onChange={(e) => setLogin({ ...login, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={login.password}
                                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-primary py-2" type="submit">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}