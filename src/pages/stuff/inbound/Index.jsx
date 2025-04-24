import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../../constant'
import Modal from '../../../components/Modal'
import * as XSLX from "xlsx"
import { saveAs } from 'file-saver'

export default function InboundIndex() {
    const [stuffs, setStuffs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedInbound, setSelectedInbound] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

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
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

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
                setError(err)
                setDeleteLoading(false)
            })
    }

    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const handleImagePreview = (e, imageUrl) => {
        e.preventDefault()
        setPreviewImage(imageUrl)
        setImageModalOpen(true)
    }

    const exportExcel = () => {
        const formData = stuffs.map((inbound, index) => ({
            No: index + 1,
            Category: inbound.stuff?.name || '-',
            TotalNewItem: inbound.total || 0,
            ProofFile: inbound.proof_file || '-',
            CreatedAt: new Date(inbound.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }));

        const worksheet = XSLX.utils.json_to_sheet(formData);
        const workbook = XSLX.utils.book_new();
        XSLX.utils.book_append_sheet(workbook, worksheet, "Inbound History");

        const excelBuffer = XSLX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'inbound-history.xlsx');
    }

    // Update the header section in return
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
                        <h1>Inbound History</h1>
                        <button className="btn btn-success" onClick={exportExcel}>
                            <i className="bi bi-file-excel me-2"></i>
                            Export Excel
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
                                                                    href="#"
                                                                    onClick={(e) => handleImagePreview(e, inbound.proof_file)}
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
                                                        <Modal
                                                            isOpen={imageModalOpen}
                                                            onClose={() => setImageModalOpen(false)}
                                                            title="Image Preview"
                                                        >
                                                            <div className="text-center">
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Preview"
                                                                    style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                                                                    className="img-fluid"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://placehold.co/400x400?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                        </Modal>
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
                    {selectedInbound?.proof_file && (
                        <div className="text-center mb-3">
                            <img
                                src={selectedInbound.proof_file}
                                alt="Proof"
                                style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                                className="img-thumbnail"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/200x200?text=No+Image';
                                }}
                            />
                        </div>
                    )}
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