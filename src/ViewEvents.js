import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:9000/getEvents')
            .then((res) => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please check the server connection.");
                setLoading(false);
            });
    }, []);

    const formatDate = (isoString) => {
        if (!isoString) return 'TBD';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            weekday: 'short', // "Mon"
            year: 'numeric',  // "2025"
            month: 'short',   // "Dec"
            day: 'numeric',   // "1"
            hour: '2-digit',  // "07"
            minute: '2-digit' // "30"
        });
    };

    const renderEventList = () => {
        if (loading) {
            return <div className="loading-message">Loading events...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (events.length === 0) {
            return (
                <div className="event-item empty">
                    No events found. <Link to="/CreateEvent" className="inline-link">Create one?</Link>
                </div>
            );
        }

        return events.map((event) => (
            <div key={event._id} className="event-item">
                <div className="event-title">{event.name}</div>
                <div className="event-location">{event.location}</div>
                <div className="event-price">${event.price}</div>
                <div className="event-description">{event.desc}</div>
                <div className="event-meta">
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Start:</strong> {formatDate(event.start)} <br/>
                        <strong>End:</strong> {formatDate(event.end)}
                    </div>

                    <div>
                        <strong>Promo Image:</strong><br />
                        {event.promo_image ? (
                            <img
                                src={event.promo_image}
                                alt="Event Promo"
                                style={{ marginTop: '5px', maxWidth: '200px', borderRadius: '4px' }}
                            />
                        ) : (
                            <span>No image available</span>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="page-wrapper">
            <div className="content-container">
                <div className="header-actions">
                    <h1>All Events</h1>
                    <Link to="/CreateEvent" className="create-event-btn">
                        + Create New Event
                    </Link>
                </div>

                <p className="subtitle">List of active and archived events.</p>

                <div className="placeholder-content">
                    {renderEventList()}
                </div>

                <Link to="/HostHome" className="back-link">← Back to Dashboard</Link>
            </div>

            <style>{`
                /* Styles from HostHome.js for layout consistency */
                .page-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start; /* Aligned to top for longer content */
                    min-height: 100vh;
                    padding-top: 5vh;
                    line-height: 1.6;
                }

                .content-container {
                    background-color: #ffffff;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                    text-align: center;
                    border: 1px solid #e0e2e5;
                }
                
                /* New Header/Button Layout */
                .header-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .header-actions h1 {
                    margin-bottom: 0;
                }
                
                .create-event-btn {
                    background-color: #007bff;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
                }
                
                .create-event-btn:hover {
                    background-color: #0056b3;
                    transform: translateY(-1px);
                }


                h1 {
                    color: #333;
                    margin-bottom: 0.5rem;
                    font-size: 2rem;
                    font-weight: 700;
                }
                
                .subtitle {
                    color: #777;
                    margin-bottom: 2rem;
                    font-size: 1rem;
                    text-align: left;
                }

                .placeholder-content {
                    text-align: left;
                    margin-bottom: 2rem;
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }

                .event-item {
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                
                .event-description {
                    font-size: 0.95rem;
                    color: #444;
                    margin: 0.5rem 0;
                }

                .event-item.empty, .loading-message, .error-message {
                    background-color: #fff;
                    color: #aaa;
                    text-align: center;
                    font-style: italic;
                    padding: 1rem;
                    border-radius: 8px;
                }
                
                .error-message {
                    color: #d8000c;
                    background-color: #ffebeb;
                    border: 1px solid #d8000c;
                }

                .event-title {
                    font-weight: 600;
                    color: #007bff;
                    font-size: 1.1rem;
                }
                
                .event-meta {
                    font-size: 0.85rem;
                    color: #555;
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px dashed #eee;
                }
                
                .back-link {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 500;
                    margin-top: 1rem;
                    display: inline-block;
                }

                .inline-link {
                    color: #007bff;
                    text-decoration: underline;
                    font-weight: 600;
                }
                
                .back-link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default ViewEvents;