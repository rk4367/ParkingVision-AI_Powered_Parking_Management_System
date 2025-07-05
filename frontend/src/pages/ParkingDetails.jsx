import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ParkingDetails.css'

const ParkingDetails = () => {
  const { lotId } = useParams()
  const navigate = useNavigate()
  const [parkingData, setParkingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/parking-details?lot=${lotId}`)
        setParkingData(response.data)
      } catch (err) {
        console.error('Error fetching parking details:', err)
        // Mock data for development
        setParkingData({
          total: lotId === '1' ? 25 : 30,
          available: lotId === '1' ? 12 : 8,
          occupied: lotId === '1' ? 13 : 22,
          history: [
            { time: '10:00:00', available: 15, occupied: 10 },
            { time: '10:05:00', available: 14, occupied: 11 },
            { time: '10:10:00', available: 13, occupied: 12 },
            { time: '10:15:00', available: 12, occupied: 13 },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
    const interval = setInterval(fetchDetails, 5000)
    return () => clearInterval(interval)
  }, [lotId])

  if (loading) {
    return (
      <div className="parking-details">
        <div className="loading">Loading parking details...</div>
      </div>
    )
  }

  return (
    <div className="parking-details">
      <div className="back-btn-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <h1 style={{ margin: 0 }}>Parking Lot {lotId} Details</h1>
        <button
          className="configure-btn top-right"
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowModal(true)}
        >
          Configure Coordinates
        </button>
      </div>

      <div className="details-stats">
        <div className="detail-stat">
          <div className="detail-stat-value">{parkingData?.total || 0}</div>
          <div className="detail-stat-label">Total Slots</div>
        </div>
        <div className="detail-stat">
          <div className="detail-stat-value available">{parkingData?.available || 0}</div>
          <div className="detail-stat-label">Available</div>
        </div>
        <div className="detail-stat">
          <div className="detail-stat-value occupied">{parkingData?.occupied || 0}</div>
          <div className="detail-stat-label">Occupied</div>
        </div>
      </div>

      <div className="video-container">
        <h2>Live Video Feed</h2>
        <div className="video-wrapper">
          <img 
            src={`/api/video-stream?lot=${lotId}`} 
            alt={`Parking Lot ${lotId} Video Feed`}
            className="video-feed"
          />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Configure Parking Coordinates</h2>
            <p>To configure parking coordinates, please run the following command in your backend terminal:</p>
            <pre style={{ background: '#f4f4f4', padding: '0.75rem', borderRadius: '4px', margin: '1rem 0', fontSize: '1.1rem' }}>
              python core/parking_monitor.py
            </pre>
            <p>Follow the on-screen instructions in the terminal and video window.</p>
            <button className="configure-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParkingDetails 