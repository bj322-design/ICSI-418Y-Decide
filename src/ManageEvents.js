import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch Events from Backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:9000/getEvents');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    // 2. Filter Logic
    const filteredEvents = events.filter(event =>
        (event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 3. Delete Logic (Using fetch, NOT app.delete)
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        
        if (confirmDelete) {
            try {
                // Front-end sends a request to the Back-end
                const response = await fetch(`http://localhost:9000/deleteEvent/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setEvents(events.filter(event => event._id !== id));
                    alert("Event deleted successfully");
                } else {
                    alert("Failed to delete event.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Could not connect to server.");
            }
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="page-wrapper">
            <div className="admin-container">
                <div className="header-section">
                    <h1>Manage Events</h1>
                    <Link to="/AdminHome" className="back-link">← Back to Dashboard</Link>
                </div>

                <input
                    type="text"
                    placeholder="Search by Event Name or Location..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Location</th>
                                <th>Date & Time</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <tr key={event._id}>
                                        <td className="name-cell">{event.name}</td>
                                        <td>{event.location}</td>
                                        <td>{formatDate(event.start)}</td>
                                        <td>${event.price}</td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(event._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">No events found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .page-wrapper {
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    padding: 2rem;
                    min-height: 100vh;
                }
                .admin-container {
                    background-color: #ffffff;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 900px;
                }
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                h1 {
                    color: #333;
                    font-size: 1.8rem;
                    margin: 0;
                }
                .back-link {
                    color: #20c997;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #1aa179; }
                .search-bar {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    box-sizing: border-box;
                }
                .table-responsive { overflow-x: auto; }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px;
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }
                .data-table th {
                    background-color: #f8f9fa;
                    color: #555;
                    font-weight: 600;
                }
                .name-cell {
                    font-weight: 600;
                    color: #20c997;
                }
                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .delete-btn:hover { background-color: #bb2d3b; }
                .no-results {
                    text-align: center;
                    color: #777;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
};

export default ManageEvents;