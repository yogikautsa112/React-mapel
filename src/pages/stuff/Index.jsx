import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constant'
import axios from 'axios'
import Modal from '../../components/Modal'

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        type: '',
    })
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        axios.get(API_URL + '/stuffs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res.data)
                setStuffs(res.data.data)
                setIsLoaded(true)
            })
            .catch(err => {
                setError(err)
                setIsLoaded(true)
            })
    }, [token])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        setIsOpen(false)
    }

    if (error) {
        return (
            <div className="alert alert-danger my-3 me-3" role="alert">
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
                            onClick={() => setIsOpen(true)}
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
                                                            {stuff.stuff_stock?.total_available || 0}
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
                                                                onClick={() => ""}
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

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"Add New Category"}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <label className="form-label">Type</label>
                        <select
                            className='form-select'
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                    </div>
                    <button type='submit' className='btn btn-primary mt-3'>Add</button>
                </form>
            </Modal>
        </>
    )
}
