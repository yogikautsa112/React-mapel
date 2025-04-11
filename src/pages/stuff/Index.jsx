import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constant'
import axios from 'axios'

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        axios.get(API_URL + '/stuffs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                // Ensure we're setting an array
                console.log(res.data)
                setStuffs(res.data.data)
                setIsLoaded(true)
            })
            .catch(err => {
                setError(err)
                setIsLoaded(true)
            })
    }, [token])

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            axios.delete(`${API_URL}/stuff/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    setStuffs(prevStuffs => prevStuffs.filter(s => s.id !== id))
                })
                .catch(err => setError(err))
        }
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                Error: {error.message}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mt-4">
                <div className="row mb-4">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h1>Categories List</h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/stuff/create')}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Add New Category
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th rowSpan={2}>No</th>
                                                <th rowSpan={2}>Name</th>
                                                <th colSpan={2}>Stock</th>
                                                <th rowSpan={2}>Action</th>
                                            </tr>
                                            <tr>
                                                <th className="text-center">Available</th>
                                                <th className="text-center">Defect</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stuffs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No categories found</td>
                                                </tr>
                                            ) : (
                                                stuffs.map((stuff, index) => (
                                                    <tr key={stuff.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{stuff.name}</td>
                                                        <td className="text-center">
                                                            <span>
                                                                {stuff.stuff_stock?.total_available || 0}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className={stuff.stuff_stock?.total_defec < 3 ? 'text-danger' : ''}>
                                                                {stuff.stuff_stock?.total_defec || 0}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className='btn btn-sm btn-primary me-2'>
                                                                <i className='bi bi-plus'></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info me-2"
                                                                onClick={() => navigate(`/stuff/${stuff.id}/edit`)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger me-2"
                                                                onClick={() => handleDelete(stuff.id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
