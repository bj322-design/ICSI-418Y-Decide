import React, { useState, useEffect } from 'react';
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

    // headcount + chat
    const [headcount, setHeadcount] = useState(0);
    const [chatLog, setChatLog] = useState([]);
    const [chatMessage, setChatMessage] = useState("");

    const hostId = "social_planner_user_1"; 
    const hostName = "Host (You)";

    useEffect(() => {
        let interval = null;
        if (createdSession) {
            const fetchUpdates = () => {
                axios.get(`http://localhost:9000/sessionDetails/${createdSession.session_code}`)
                    .then((res) => {
                        setHeadcount(res.data.headcount);
                        setChatLog(res.data.chat_log);
                    })
                    .catch(err => console.error("Polling error", err));
            };

            fetchUpdates();
            interval = setInterval(fetchUpdates, 3000);
        }
        return () => clearInterval(interval); 
    }, [createdSession]);


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
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setError("No events found. Try a different search.");
            } else {
                setError("Server error.");
            }
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!chatMessage.trim()) return;

        axios.post('http://localhost:9000/sendMessage', {
            session_code: createdSession.session_code,
            sender: hostName,
            message: chatMessage
        })
        .then(() => {
            setChatMessage("");
            setChatLog([...chatLog, { sender: hostName, message: chatMessage }]);
        })
        .catch(err => console.error("Chat error", err));
    };

    return (
        <div className="page-wrapper">
            <div className="planner-container">
                <h1>Social Planner Dashboard</h1>

                {!createdSession ? (
                    <>
                        <p className="subtitle">Start a group decision session.</p>
                        <form onSubmit={handleCreateSession} className="planner-form">
                            {error && <div className="error-message">{error}</div>}
                            <div className="input-group">
                                <label>Where is the group going?</label>
                                <input type="text" placeholder="e.g. Albany" value={location} onChange={(e) => setLocation(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Activity Vibe?</label>
                                <input type="text" placeholder="e.g. Food" value={activityType} onChange={(e) => setActivityType(e.target.value)} />
                            </div>
                            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Create Group Session"}</button>
                        </form>
                    </>
                ) : (
                    <div className="dashboard-grid">
                        {/* LEFT COLUMN: info + stats */}
                        <div className="info-column">
                            <div className="invite-box">
                                <span className="invite-label">Invite Code:</span>
                                <div className="code-display">{createdSession.session_code}</div>
                            </div>
                            
                            <div className="stats-card">
                                <h3>📊 Live Status</h3>
                                <p><strong>{headcount}</strong> Friends Joined</p>
                                <p><strong>{eventCount}</strong> Events Found</p>
                            </div>

                            <button onClick={() => setCreatedSession(null)} className="btn-secondary">End Session</button>
                            <Link to="/Home" className="back-link">Back to Home</Link>
                        </div>

                        {/* RIGHT COLUMN: Chat */}
                        <div className="chat-column">
                            <h3>Group Chat</h3>
                            <div className="chat-window">
                                {chatLog.length === 0 ? (
                                    <p className="empty-chat">No messages yet.</p>
                                ) : (
                                    chatLog.map((msg, index) => (
                                        <div key={index} className={`chat-bubble ${msg.sender === hostName ? 'mine' : 'theirs'}`}>
                                            <strong>{msg.sender}: </strong> {msg.message}
                                        </div>
                                    ))
                                )}
                            </div>
                            <form onSubmit={handleSendMessage} className="chat-input-area">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .page-wrapper { font-family: 'Inter', sans-serif; background-color: #f0f2f5; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
                .planner-container { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 800px; text-align: center; }
                
                /* Grid for Dashboard */
                .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; }
                @media (max-width: 600px) { .dashboard-grid { grid-template-columns: 1fr; } }

                .invite-box { background: #e8f0fe; border: 2px dashed #007bff; padding: 1rem; border-radius: 10px; text-align: center; margin-bottom: 20px; }
                .code-display { font-size: 2rem; font-weight: 800; letter-spacing: 3px; color: #333; }
                
                .stats-card { background: #f9f9f9; padding: 1rem; border-radius: 8px; margin-bottom: 20px; }
                .stats-card p { margin: 5px 0; }

                /* Chat Styles */
                .chat-column { border-left: 1px solid #eee; padding-left: 20px; display: flex; flex-direction: column; height: 400px; }
                .chat-window { flex-grow: 1; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 10px; margin-bottom: 10px; border: 1px solid #eee; }
                .empty-chat { color: #aaa; text-align: center; margin-top: 50%; font-style: italic; }
                
                .chat-bubble { padding: 8px 12px; margin-bottom: 8px; border-radius: 10px; font-size: 0.9rem; max-width: 80%; }
                .chat-bubble.mine { background: #007bff; color: white; align-self: flex-end; margin-left: auto; }
                .chat-bubble.theirs { background: #e9ecef; color: #333; }

                .chat-input-area { display: flex; gap: 10px; }
                .chat-input-area input { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc; }
                .chat-input-area button { width: auto; padding: 8px 16px; font-size: 0.9rem; }

                /* Form Styles */
                .planner-form .input-group { text-align: left; margin-bottom: 1.5rem; }
                .planner-form input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 8px; }
                button { width: 100%; padding: 1rem; background-color: #007bff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
                button:hover { background-color: #0056b3; }
                .btn-secondary { background-color: #6c757d; }
                .back-link { display: block; margin-top: 20px; color: #007bff; text-decoration: none; text-align: center; }
            `}</style>
        </div>
    );
};

export default SocialPlanner;
