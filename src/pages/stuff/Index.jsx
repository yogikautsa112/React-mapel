import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../constant'
import Modal from '../../components/Modal'

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [mode, setMode] = useState('create') // 'create' | 'edit' | 'delete'
    const [formData, setFormData] = useState({ id: null, name: '', type: '' })
    const [deleteId, setDeleteId] = useState(null)
    const [formInbound, setFormInbound] = useState({
        stuff_id: "",
        total: 0,
        proof_file: null
    })
    const [isModalInbound, setIsModalInbound] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchStuffs()
    }, [])

    const fetchStuffs = () => {
        axios.get(`${API_URL}/stuffs`)
            .then(res => setStuffs(res.data.data))
            .catch(setError)
            .finally(() => setLoading(false))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isEditing = mode === 'edit'
        const method = isEditing ? 'patch' : 'post'
        const url = isEditing
            ? `${API_URL}/stuffs/${formData.id}`
            : `${API_URL}/stuffs`

        axios[method](url, formData)
            .then(() => {
                fetchStuffs()
                closeModal()
                setAlert(`Category ${isEditing ? 'updated' : 'added'} successfully`)
            })
            .catch(err => handleRequestError(err, isEditing ? 'update' : 'add'))
    }

    const handleDelete = (stuff) => {
        setFormData({ id: stuff.id, name: stuff.name })
        setDeleteId(stuff.id)
        setMode('delete')
        setModalOpen(true)
    }

    const confirmDelete = () => {
        axios.delete(`${API_URL}/stuffs/${deleteId}`)
            .then(() => {
                fetchStuffs()
                closeModal()
                setAlert('Category deleted successfully')
            })
            .catch(err => handleRequestError(err, 'delete'))
    }

    const handleEdit = (stuff) => {
        setFormData({
            id: stuff.id,
            name: stuff.name,
            type: stuff.type || ''
        })
        setMode('edit')
        setModalOpen(true)
    }

    const handleInbound = (stuff) => {
        setFormInbound({
            stuff_id: stuff.id,
            total: 0,
            proof_file: null
        })
        setIsModalInbound(true)
    }

    // Update handleSubmitInbound to only include Content-Type header
    const handleSubmitInbound = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('stuff_id', formInbound.stuff_id)
        formData.append('total', formInbound.total)
        formData.append('proof_file', formInbound.proof_file)

        axios.post(`${API_URL}/inbound-stuffs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                fetchStuffs()
                setIsModalInbound(false)
                setFormInbound({ stuff_id: "", total: 0, proof_file: null })
                setAlert('Stock Inbound added successfully')
            })
            .catch(err => handleRequestError(err, 'add inbound'))
    }

    const closeModal = () => {
        setModalOpen(false)
        setFormData({ id: null, name: '', type: '' })
        setDeleteId(null)
        setMode('create')
        setError(null)
    }

    const handleRequestError = (err, action) => {
        if (err.response?.status === 401) {
            localStorage.clear()
            navigate('/login')
        } else {
            setError({ message: err.response?.data?.message || `Failed to ${action} category` })
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mt-4">
                {alert && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {alert}
                        <button type="button" className="btn-close" onClick={() => setAlert('')} aria-label="Close"></button>
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h1>Categories List</h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setMode('create')
                                setModalOpen(true)
                            }}
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
                                                <th className='text-center' colSpan={2}>Stock</th>
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
                                                            {stuff.stuff_stock?.total_available || "-"}
                                                        </td>
                                                        <td className="text-center">
                                                            <span className={stuff.stuff_stock?.total_defec < 3 ? 'text-danger' : ''}>
                                                                {stuff.stuff_stock?.total_defec || "-"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary me-2"
                                                                onClick={() => handleInbound(stuff)}
                                                            >
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-info me-2"
                                                                onClick={() => handleEdit(stuff)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(stuff)}
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

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={
                    mode === 'delete'
                        ? "Delete Category"
                        : mode === 'edit'
                            ? "Edit Category"
                            : "Add New Category"
                }
            >
                {error && <div className="alert alert-danger">{error.message}</div>}

                {mode === 'delete' ? (
                    <div>
                        <p className="fw-bold text-danger">
                            Are you sure you want to delete "{formData.name}"?
                        </p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control mb-2"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <label className="form-label">Type</label>
                            <select
                                name="type"
                                className="form-select mb-3"
                                value={formData.type || ''}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select</option>
                                <option value="HTL/KLN">HTL/KLN</option>
                                <option value="Lab">Lab</option>
                                <option value="Sarpras">Sarpras</option>
                            </select>

                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {mode === 'edit' ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal
                isOpen={isModalInbound}
                onClose={() => setIsModalInbound(false)}
                title={`Add Stock Inbound`}
            >
                {error && <div className="alert alert-danger">{error.message}</div>}

                <form onSubmit={handleSubmitInbound}>
                    <div className="form-group">
                        <label className="form-label">
                            Add Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="total"
                            className="form-control mb-3"
                            value={formInbound.total}
                            onChange={(e) => setFormInbound({ ...formInbound, total: e.target.value })}
                            min="1"
                            required
                        />

                        <label className="form-label">
                            Proof File <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            name="proof_file"
                            className="form-control mb-3"
                            onChange={(e) => setFormInbound({ ...formInbound, proof_file: e.target.files[0] })}
                            accept="image/*,.pdf"
                            required
                        />

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsModalInbound(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Stock
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}
