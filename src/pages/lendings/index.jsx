import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constant'
import Modal from '../../components/Modal'

export const Lendings = () => {
    const [stuffs, setStuffs] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStuff, setSelectedStuff] = useState(null)
    const [alert, setAlert] = useState({ show: false, message: '', type: '' })
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        note: ''
    })

    // const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        axios.get(`${API_URL}/stuffs`)
            .then(res => {
                setStuffs(res.data.data || [])
            })
            .catch(err => {
                if(err.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                console.error('Error fetching data:', err)
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    const addLendings = async (data) => {
        try {
            // First create the lending with proper data structure
            const lendingData = {
                stuff_id: data.stuff_id,
                name: data.name,
                notes: data.note,
                total_stuff: parseInt(data.quantity),
            }

            await axios.post(`${API_URL}/lendings`, lendingData)
            
            // Then update the stuff stock
            await axios.patch(`${API_URL}/stuffs/${data.stuff_id}`, {
                total_available: selectedStuff.stuff_stock.total_available - data.quantity
            })

            // Update the local state directly
            setStuffs(prevStuffs => prevStuffs.map(stuff => {
                if (stuff.id === data.stuff_id) {
                    return {
                        ...stuff,
                        stuff_stock: {
                            ...stuff.stuff_stock,
                            total_available: stuff.stuff_stock.total_available - data.quantity
                        }
                    }
                }
                return stuff
            }))
            
            setModalOpen(false)
        } catch (error) {
            setError(error)
            setAlert({
                show: true,
                message: error.response?.data?.message || 'Failed to add lending',
                type: 'danger'
            })
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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedStuff) return

        try {
            const data = {
                ...formData,
                stuff_id: selectedStuff.id,
                quantity: parseInt(formData.quantity)
            }

            if (data.quantity > selectedStuff.stuff_stock.total_available) {
                setAlert({
                    show: true,
                    message: 'Quantity exceeds available stock!',
                    type: 'danger'
                })
                return
            }

            await addLendings(data)
            setAlert({
                show: true,
                message: 'Lending added successfully!',
                type: 'success'
            })
            setFormData({ name: '', quantity: '', note: '' })
            setModalOpen(false)
        } catch (error) {
            setAlert({
                show: true,
                message: error.response?.data?.message || 'Failed to add lending',
                type: 'danger'
            })
        }
    }

    return (
        <>
            {alert.show && (
                <div className="container mt-3">
                    <div className={`alert alert-${alert.type} alert-dismissible fade show py-3 px-4`} role="alert">
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
                    </div>
                </div>
            )}

            <div className="container">
                <div className='row g-4 my-5'>
                    {stuffs.map((stuff) => (
                        <div key={stuff.id} className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <h5 className="card-title mb-3">{stuff.name}</h5>
                                    <p className="card-text">
                                        Total Available: {stuff.stuff_stock?.total_available || 0}
                                    </p>
                                    <button
                                        className='btn btn-outline-primary'
                                        disabled={!stuff.stuff_stock?.total_available}
                                        onClick={() => {
                                            setSelectedStuff(stuff)
                                            setModalOpen(true)
                                        }}
                                    >
                                        {stuff.stuff_stock?.total_available > 0 ? "Select" : "Stock Not Available"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setSelectedStuff(null)
                    setFormData({ name: '', quantity: '', note: '' })
                }}
                title={`Add Lending - ${selectedStuff?.name || ''}`}
            >
                {error && <div className="alert alert-danger">{error.message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">
                            Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="1"
                            max={selectedStuff?.stuff_stock?.total_available}
                            className="form-control mb-3"
                            required
                        />

                        <label className='form-label'>
                            Note
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            className="form-control mb-3"
                            rows={3}
                        ></textarea>

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Lending
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}
