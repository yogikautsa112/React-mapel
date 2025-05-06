import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import axios from 'axios'
import { API_URL } from '../constant'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function StockChart() {
    const [typeStats, setTypeStats] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch data when component mounts
    useEffect(() => {
        async function fetchData() {
            try {
                // Mengambil data dari dua endpoint
                const [stuffsResponse, lendingsResponse] = await Promise.all([
                    axios.get(`${API_URL}/stuffs`),
                    axios.get(`${API_URL}/lendings`)
                ])

                const stuffs = stuffsResponse.data.data || []
                const lendings = lendingsResponse.data.data || []

                // Menghitung jumlah total per tipe
                const typeTotals = {
                    'Lab': 0,
                    'Sarpras': 0,
                    'HTL/KLN': 0
                }

                // Menghitung jumlah yang dipinjam per tipe
                const typeBorrowed = {
                    'Lab': 0,
                    'Sarpras': 0,
                    'HTL/KLN': 0
                }

                // Menghitung total barang per tipe
                stuffs.forEach(stuff => {
                    const stuffType = stuff.type || ''
                    if (Object.prototype.hasOwnProperty.call(typeTotals, stuffType)) {
                        typeTotals[stuffType] += (stuff.stuff_stock?.total_available || 0) +
                            (stuff.stuff_stock?.total_defec || 0)
                    }
                })

                // Menghitung jumlah barang yang dipinjam per tipe
                lendings.forEach(lending => {
                    const stuffType = lending.stuff?.type || ''
                    if (Object.prototype.hasOwnProperty.call(typeBorrowed, stuffType)) {
                        typeBorrowed[stuffType] += lending.total_stuff || 0
                    }
                })

                // Menghitung persentase barang yang tidak dipinjam
                const typeNotBorrowed = Object.keys(typeTotals).map(type => {
                    const total = typeTotals[type]
                    const borrowed = typeBorrowed[type]
                    const notBorrowed = total - borrowed
                    const percentage = total > 0 ? Math.round((notBorrowed / total) * 100) : 0

                    return {
                        name: type,
                        count: notBorrowed,
                        percentage: percentage
                    }
                })

                // Urutkan berdasarkan jumlah barang yang tidak dipinjam (terbanyak dulu)
                typeNotBorrowed.sort((a, b) => b.count - a.count)

                setTypeStats(typeNotBorrowed)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    // Chart colors
    const colors = {
        backgrounds: ['rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'],
        borders: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']
    }

    // Chart data
    const labels = typeStats.map(item => item.name)
    const data = typeStats.map(item => item.count)

    // Get type with most not borrowed items
    const mostNotBorrowedType = typeStats.length ? typeStats[0].name : 'Tidak ada data'

    return (
        <div className="row">
            <div className="col-md-12 mb-3">
                <h6 className="text-muted text-center mb-2">
                    Tipe Barang Paling Banyak Tersedia
                    <span className="badge bg-success ms-2">{mostNotBorrowedType}</span>
                </h6>
                <div style={{ height: '150px', marginBottom: '1rem' }}>
                    <Pie
                        data={{
                            labels,
                            datasets: [{
                                data,
                                backgroundColor: colors.backgrounds,
                                borderColor: colors.borders,
                                borderWidth: 1,
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const value = context.raw || 0
                                            const total = context.chart.getDatasetMeta(0).total
                                            const percentage = Math.round((value / total) * 100)
                                            return `${context.label}: ${value} item (${percentage}%)`
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="col-md-12">
                <h6 className="text-muted text-center mb-2">Perbandingan Tipe Barang Tersedia</h6>
                <div style={{ height: '180px', marginBottom: '1rem' }}>
                    <Bar
                        data={{
                            labels,
                            datasets: [{
                                label: 'Jumlah Tersedia',
                                data,
                                backgroundColor: colors.backgrounds,
                                borderColor: colors.borders,
                                borderWidth: 1
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `Jumlah: ${context.raw} item`
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { precision: 0 }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}