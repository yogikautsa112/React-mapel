import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../../constant'
import Modal from '../../../components/Modal'

export default function InboundIndex() {
    const [stuffs, setStuffs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedInbound, setSelectedInbound] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchStuffs()
    }, [])

    const fetchStuffs = () => {
        setLoading(true)
        setError(null)
        axios.get(`${API_URL}/inbound-stuffs`)
            .then(res => {
                const data = res.data.data
                setStuffs(data)
            })
            .catch(err => handleRequestError(err, 'fetch'))
            .finally(() => setLoading(false))
    }

    console.log(stuffs)

    const handleDelete = (inbound) => {
        setSelectedInbound(inbound)
        setModalOpen(true)
    }

    const confirmDelete = () => {
        setDeleteLoading(true)
        axios.delete(`${API_URL}/inbound-stuffs/${selectedInbound.id}`)
            .then(() => {
                fetchStuffs()
                setModalOpen(false)
                setDeleteLoading(false)
                setAlert('Inbound record deleted successfully')
            })
            .catch(err => {
                handleRequestError(err, 'delete')
                setDeleteLoading(false)
            })
    }

    const handleRequestError = (err, action) => {
        if (err.response?.status === 401) {
            localStorage.clear()
            navigate('/login')
        } else {
            setError({ message: err.response?.data?.message || `Failed to ${action} inbound record` })
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
                    <div className="col-12">
                        <h1>Inbound History</h1>
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
                                                <th>#</th>
                                                <th>Stuff</th>
                                                <th>Total New Item</th>
                                                <th>Proof File</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stuffs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center">No inbound records found</td>
                                                </tr>
                                            ) : (
                                                stuffs.map((inbound, index) => (
                                                    <tr key={inbound.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{inbound.stuff?.name}</td>
                                                        <td>{inbound.total || 0}</td>
                                                        <td>
                                                            {inbound.proof_file && (
                                                                <a
                                                                    href={inbound.proof_file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <img
                                                                        src={inbound.proof_file}
                                                                        alt="Proof"
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                        className="img-thumbnail"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://placehold.co/50x50?text=No+Image';
                                                                        }}
                                                                    />
                                                                </a>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(inbound)}
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
                onClose={() => {
                    setModalOpen(false)
                    setError(null)
                }}
                title="Delete Inbound Record"
            >
                {error && <div className="alert alert-danger">{error.message}</div>}

                <div>
                    <p className="fw-bold text-danger">
                        Are you sure you want to delete this inbound record?
                    </p>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setModalOpen(false)}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={confirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}