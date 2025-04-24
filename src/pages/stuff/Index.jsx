import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../constant'
import Modal from '../../components/Modal'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([])
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [isInboundModal, setInboundModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({ id: null, name: '', type: '' })
    const [formInbound, setFormInbound] = useState({ stuff_id: '', total: 0, proof_file: null })
    const [mode, setMode] = useState('create') // create | edit | delete
    const [deleteId, setDeleteId] = useState(null)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => { fetchStuffs() }, [])

    const fetchStuffs = () => {
        setLoading(true)
        axios.get(`${API_URL}/stuffs`)
            .then(res => setStuffs(res.data.data || []))
            .catch(err => handleError(err))
            .finally(() => setLoading(false))
    }

    const handleError = (err, action = 'process') => {
        if (err.response?.status === 401) {
            localStorage.clear()
            navigate('/login')
        } else {
            setError({ message: err.response?.data?.message || `Failed to ${action}` })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isEdit = mode === 'edit'
        const method = isEdit ? 'patch' : 'post'
        const url = `${API_URL}/stuffs${isEdit ? `/${formData.id}` : ''}`

        axios[method](url, formData)
            .then(() => {
                fetchStuffs()
                closeModal()
                setAlert(`Category ${isEdit ? 'updated' : 'added'} successfully`)
            })
            .catch(err => handleError(err, isEdit ? 'update' : 'add'))
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
            .catch(err => handleError(err, 'delete'))
    }

    const handleEdit = (stuff) => {
        setFormData({ id: stuff.id, name: stuff.name, type: stuff.type || '' })
        setMode('edit')
        setModalOpen(true)
    }

    const handleInbound = (stuff) => {
        setFormInbound({ stuff_id: stuff.id, total: 0, proof_file: null })
        setInboundModal(true)
    }

    const handleSubmitInbound = (e) => {
        e.preventDefault()
        const form = new FormData()
        form.append('stuff_id', formInbound.stuff_id)
        form.append('total', formInbound.total)
        form.append('proof_file', formInbound.proof_file)

        axios.post(`${API_URL}/inbound-stuffs`, form)
            .then(() => {
                fetchStuffs()
                setInboundModal(false)
                setAlert('Stock Inbound added successfully')
            })
            .catch(err => handleError(err, 'add inbound'))
    }

    const closeModal = () => {
        setModalOpen(false)
        setFormData({ id: null, name: '', type: '' })
        setDeleteId(null)
        setMode('create')
        setError(null)
    }

    const exportExcel = () => {
        const data = stuffs.map((s, i) => ({
            No: i + 1, Title: s.name, Type: s.type,
            TotalAvailable: s.stuff_stock?.total_available || 0,
            TotalDefec: s.stuff_stock?.total_defec || 0
        }))
        const sheet = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, sheet, "Categories")
        const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, 'categories.xlsx')
    }

    const filtered = stuffs.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border" role="status" /></div>
    }

    return (
        <div className="container mt-4">
            {alert && (
                <div className="alert alert-success alert-dismissible fade show">
                    {alert}
                    <button className="btn-close" onClick={() => setAlert('')} />
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Categories List</h1>
                <div>
                    <button className="btn btn-primary me-2" onClick={() => { setMode('create'); setModalOpen(true) }}>
                        <i className="bi bi-plus-circle me-2" />Add New Category
                    </button>
                    <button className="btn btn-success" onClick={exportExcel}>Export</button>
                </div>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="card">
                <div className="card-body table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>No</th><th>Name</th><th className="text-center">Available</th><th className="text-center">Defect</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No categories found</td></tr>
                            ) : filtered.map((s, i) => (
                                <tr key={s.id}>
                                    <td>{i + 1}</td>
                                    <td>{s.name || '-'}</td>
                                    <td className="text-center">{s.stuff_stock?.total_available ?? '-'}</td>
                                    <td className="text-center text-danger">
                                        {s.stuff_stock?.total_defec ?? '-'}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleInbound(s)}><i className="bi bi-plus" /></button>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(s)}><i className="bi bi-pencil" /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s)}><i className="bi bi-trash" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal} title={`${mode === 'edit' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add'} Category`}>
                {error && <div className="alert alert-danger">{error.message}</div>}
                {mode === 'delete' ? (
                    <>
                        <p className="text-danger fw-bold">Delete "{formData.name}"?</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>Name <span className="text-danger">*</span></label>
                        <input type="text" name="name" className="form-control mb-2" value={formData.name} onChange={handleChange} required />
                        <label>Type</label>
                        <select name="type" className="form-select mb-3" value={formData.type} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{mode === 'edit' ? 'Update' : 'Add'}</button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Inbound Modal */}
            <Modal isOpen={isInboundModal} onClose={() => setInboundModal(false)} title="Add Stock Inbound">
                {error && <div className="alert alert-danger">{error.message}</div>}
                <form onSubmit={handleSubmitInbound}>
                    <label>Quantity <span className="text-danger">*</span></label>
                    <input type="number" className="form-control mb-2" min="1" value={formInbound.total} onChange={(e) => setFormInbound({ ...formInbound, total: e.target.value })} required />
                    <label>Proof File <span className="text-danger">*</span></label>
                    <input type="file" className="form-control mb-3" accept="image/*,.pdf" onChange={(e) => setFormInbound({ ...formInbound, proof_file: e.target.files[0] })} required />
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-secondary" onClick={() => setInboundModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Stock</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
