import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios'

const SWIPE_INDEX_KEY = 'currentEventIndex';

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(() => {
        const storedIndex = localStorage.getItem(SWIPE_INDEX_KEY);
        // Ensure the stored value is a non-negative number before parsing
        return storedIndex && !isNaN(parseInt(storedIndex)) && parseInt(storedIndex) >= 0
            ? parseInt(storedIndex)
            : 0;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




    const currentUserId = localStorage.getItem('userId');

    // Effect 1: Fetch data only on mount
    useEffect(() => {
        document.title = 'Home';
        axios.get('http://localhost:9000/getEvents')
            .then((res) => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events: ", err);
                setError("Could not load events.");
                setLoading(false);
            });
    }, []);

    // Effect 2: Save index whenever it changes
    useEffect(() => {
        localStorage.setItem(SWIPE_INDEX_KEY, currentIndex.toString());
    }, [currentIndex]);

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

    const handleAction = (action) => {
        const currentEvent = events[currentIndex];

        if(action === 'join') {
            axios.post('http://localhost:9000/likeEvent', {
                userId: currentUserId,
                eventId: currentEvent._id,
                eventName: currentEvent.name
            }).then((res) => {
                const responseData = res.data;
                console.log("Like Event Response: ", responseData);

                // Check the flag returned from the server:
                // Only navigate if a new group was actually created (alreadyInGroup is false)
                if (!responseData.alreadyInGroup) {
                    navigate('/Events'); // Navigate to /Events ONLY if a new group was created
                } else {
                    console.log("User is already in a group. Remaining on /Home screen.");
                    // The user remains on the /Home screen and continues to the next card.
                }
            }).catch((err) => console.error("Error joining event: ", err));
        }
        moveToNextCard(); // Always move to the next card.

    }

    const moveToNextCard = () => {
        // Using modulo for cleaner, circular array looping
        if (events.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }
    };

    const currentEvent = events.length > 0 ? events[currentIndex] : null;

    return (
        <div className="page-wrapper">
            <div className="home-container">
                {/* Header */}
                <div className="app-header">
                    <h1>decide.</h1>
                </div>

                {/* Swipe Card Area */}
                <div className="card-area">
                    {loading && <div className="status-msg">Loading events...</div>}

                    {error && <div className="status-msg error">{error}</div>}

                    {!loading && !error && events.length === 0 && (
                        <div className="status-msg">
                            No events found. <br/>
                            <Link to="/CreateEvent" style={{ color: '#007bff' }}>Create one?</Link>
                        </div>
                    )}

                    {!loading && currentEvent && (
                        <div className="event-card">
                            <div className="card-image-container">
                                {currentEvent.promo_image ? (
                                    <img
                                        src={currentEvent.promo_image}
                                        alt={currentEvent.name}
                                        className="card-image"
                                    />
                                ) : (
                                    <div className="card-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                                <div className="price-tag">
                                    {currentEvent.price ? `$${currentEvent.price}` : `Free`}
                                </div>
                            </div>

                            <div className="card-content">
                                <h2>{currentEvent.name}</h2>
                                {currentEvent.description} <br/>
                                <p className="event-details">
                                    {currentEvent.location} <br/>
                                    <span className="event-time">{formatDate(currentEvent.start)}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Swiping Action Buttons */}
                <div className="action-controls">
                    <button onClick={() => handleAction('pass')} className="action-button pass" disabled={!currentEvent}>
                        ✕
                    </button>
                    <button onClick={() => handleAction('join')} className="action-button join" id="acceptInvite" disabled={!currentEvent}>
                        ♥
                    </button>
                </div>

                <hr className={"divider"}/>

                {/* Navigation Buttons */}
                <div className="nav-dock">
                    <Link to="/SocialPlanner" className="dock-link">Plan Chat</Link>
                    <Link to="/Events" className="dock-link">My Events</Link>
                    <Link to="/Profile" className="dock-link">Profile</Link>
                    <Link to="/UserSettings" className="dock-link">Settings</Link>
                </div>
            </div>

            <style>{`
                /* General Layout Consistency */
                .page-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    line-height: 1.6;
                }

                .home-container {
                    background-color: #ffffff;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                    text-align: center;
                    border: 1px solid #e0e2e5;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 850px;
                }
                
                .app-header h1 {
                    color: #333;
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                }
                
                .subtitle {
                    color: #777;
                    margin: 0 0 1rem 0;
                    font-size: 0.9rem;
                }
                
                /* Card Styles */
                .card-area {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    position: relative;
                }
                
                .status-msg {
                    color: #777;
                    font-size: 1rem;
                    font-style: italic;
                }
                
                .status-msg.error {
                    color: #dc3545
                }
                
                .event-card {
                    background: white;
                    border: 1px solid #e0e2e5;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                    width: 100%;
                    height: 500px;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease;
                }

                .card-image-container {
                    height: 350px;
                    position: relative;
                    background-color: #f0f2f5;
                    overflow: hidden;
                }

                .card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .card-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-weight: 600;
                }

                .price-tag {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                }

                .card-content {
                    padding: 1.25rem;
                    text-align: left;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .card-content h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.4rem;
                    color: #333;
                    line-height: 1;
                }

                .event-details {
                    margin: 0;
                    color: #555;
                    font-size: 0.95rem;
                }

                .event-time {
                    color: #007bff;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: block;
                    margin-top: 4px;
                }

                /* Action Buttons */
                .action-controls {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 1.5rem;
                }

                .action-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .action-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .action-button:hover:not(:disabled) {
                    transform: scale(1.1);
                }

                .action-button.pass {
                    background-color: #ffffff;
                    border: 2px solid #dc3545;
                    color: #dc3545;
                }

                .action-button.join {
                    background-color: #28a745;
                    color: white;
                    box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
                }

                .divider {
                    border: 0;
                    height: 1px;
                    background: #e0e2e5;
                    margin: 0 0 1rem 0;
                    width: 100%;
                }

                /* Bottom Navigation Dock */
                .nav-dock {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }

                .dock-link {
                    text-decoration: none;
                    color: #777;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.5rem;
                    transition: color 0.2s;
                }

                .dock-link:hover {
                    color: #007bff;
                }
            `}</style>
        </div>
    );
};

export default Home;