import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SocialPlanner = () => {
    // inputs
    const [location, setLocation] = useState('');
    const [activityType, setActivityType] = useState('');
    const [loading, setLoading] = useState(false);
    
    // session data
    const [createdSession, setCreatedSession] = useState(null);
    const [eventCount, setEventCount] = useState(0);
    const [error, setError] = useState(null);

    const hostId = "social_planner_user_1"; 

    const handleCreateSession = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        axios.post('http://localhost:9000/startGroupSession', {
            host_id: hostId,
            location: location,
            activity_type: activityType
        })
        .then((res) => {
            setCreatedSession(res.data.session);
            setEventCount(res.data.event_count);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setError("No events found matching your criteria. Try broader search terms.");
            } else {
                setError("Server error. Please try again.");
            }
        });
    };

    return (
        <div className="page-wrapper">
            <div className="planner-container">
                <h1>Social Planner Dashboard</h1>
                <p className="subtitle">Start a group decision session.</p>

                {!createdSession ? (
                    <form onSubmit={handleCreateSession} className="planner-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="input-group">
                            <label>Where is the group going?</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Albany, NY" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>What vibe are you looking for?</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Italian, Hiking, Concert" 
                                value={activityType}
                                onChange={(e) => setActivityType(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Searching..." : "Create Group Session"}
                        </button>
                    </form>
                ) : (
                    <div className="session-success">
                        <div className="success-icon">🎉</div>
                        <h2>Session Created!</h2>
                        <p>We found <strong>{eventCount}</strong> events matching your criteria.</p>
                        
                        <div className="invite-box">
                            <span className="invite-label">Group Invite Code:</span>
                            <div className="code-display">{createdSession.session_code}</div>
                        </div>

                        <p className="share-instruction">
                            Share this code with your friends so they can join!
                        </p>

                        <div className="stats-box">
                            <h3>Live Headcount</h3>
                            <p>0 Participants joined (Refresh to update)</p>
                        </div>

                        <button onClick={() => setCreatedSession(null)} className="btn-secondary">
                            Start Another Session
                        </button>
                        
                        <Link to="/Home" className="back-link">Back to Home</Link>
                    </div>
                )}
            </div>

            <style>{`
                .page-wrapper {
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f2f5;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .planner-container {
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                }
                h1 { color: #333; margin-bottom: 0.5rem; }
                .subtitle { color: #666; margin-bottom: 2rem; }
                .input-group { text-align: left; margin-bottom: 1.5rem; }
                .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
                .input-group input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 8px; }
                button { width: 100%; padding: 1rem; background-color: #007bff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
                button:hover { background-color: #0056b3; }
                .invite-box { background-color: #e8f0fe; border: 2px dashed #007bff; padding: 1.5rem; border-radius: 10px; margin: 2rem 0; }
                .code-display { font-size: 2.5rem; font-weight: 800; letter-spacing: 5px; color: #333; }
                .btn-secondary { background-color: #6c757d; margin-top: 10px; }
                .back-link { display: block; margin-top: 20px; color: #007bff; text-decoration: none; }
            `}</style>
        </div>
    );
};

export default SocialPlanner;
