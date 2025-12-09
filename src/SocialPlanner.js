import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SocialPlanner = () => {
    // Inputs
    const [location, setLocation] = useState('');
    const [activityType, setActivityType] = useState('');
    const [joinCode, setJoinCode] = useState(''); // NEW: State for joining
    const [loading, setLoading] = useState(false);
    
    // Session Data
    const [createdSession, setCreatedSession] = useState(null);
    const [eventCount, setEventCount] = useState(0);
    const [error, setError] = useState(null);

    // Live Data
    const [headcount, setHeadcount] = useState(0);
    const [chatLog, setChatLog] = useState([]);
    const [chatMessage, setChatMessage] = useState("");

    const hostId = "social_planner_user_1"; 
    const hostName = "Host (You)"; // In a real app, get this from Login

    // --- POLLING EFFECT ---
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
            // Fetch immediately, then every 3 seconds
            fetchUpdates();
            interval = setInterval(fetchUpdates, 3000);
        }
        return () => clearInterval(interval); 
    }, [createdSession]);

    // --- HANDLER: CREATE SESSION ---
    const handleCreateSession = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        axios.post('http://localhost:9000/startGroupSession', {
            host_id: hostId, location, activity_type: activityType
        }).then((res) => {
            setCreatedSession(res.data.session);
            setEventCount(res.data.event_count);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            if (err.response && err.response.status === 404) setError("No events found.");
            else setError("Server error.");
        });
    };

    // --- NEW HANDLER: JOIN SESSION ---
    const handleJoinSession = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Verify code exists
        axios.get(`http://localhost:9000/sessionDetails/${joinCode}`)
            .then((res) => {
                // If successful, set session state so dashboard loads
                setCreatedSession({ session_code: joinCode });
                setHeadcount(res.data.headcount);
                setChatLog(res.data.chat_log);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError("Invalid Session Code. Please try again.");
            });
    };

    // --- HANDLER: SEND MESSAGE ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!chatMessage.trim()) return;
        axios.post('http://localhost:9000/sendMessage', {
            session_code: createdSession.session_code,
            sender: hostName, 
            message: chatMessage
        }).then(() => {
            setChatMessage("");
            setChatLog([...chatLog, { sender: hostName, message: chatMessage }]);
        }).catch(err => console.error("Chat error", err));
    };

    return (
        <div className="page-wrapper">
            <div className="home-container" style={{ minHeight: 'auto', display: 'block' }}>
                <div className="app-header">
                    <h1>Group Plan</h1>
                </div>

                {!createdSession ? (
                    <div className="planner-content">
                        <p className="subtitle">Start a new session or join friends.</p>
                        
                        {error && <div className="error-message">{error}</div>}

                        {/* CREATE FORM */}
                        <form onSubmit={handleCreateSession} className="planner-form">
                            <div className="input-group">
                                <label>Location</label>
                                <input type="text" placeholder="e.g. Albany" value={location} onChange={(e) => setLocation(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Activity</label>
                                <input type="text" placeholder="e.g. Food" value={activityType} onChange={(e) => setActivityType(e.target.value)} />
                            </div>
                            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Create Session"}</button>
                        </form>
                        
                        <div className="divider-text">OR</div>

                        {/* NEW JOIN FORM */}
                        <form onSubmit={handleJoinSession} className="join-form">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    placeholder="Enter 4-digit Join Code" 
                                    value={joinCode} 
                                    onChange={(e) => setJoinCode(e.target.value)} 
                                    required 
                                    style={{textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold'}}
                                />
                            </div>
                            <button type="submit" className="btn-secondary" disabled={loading}>
                                {loading ? "Joining..." : "Join Existing Session"}
                            </button>
                        </form>

                        <br />
                        <Link to="/Home" className="back-link">Cancel</Link>
                    </div>
                ) : (
                    <div className="session-active-view">
                        <div className="invite-section">
                            <span className="invite-label">Join Code:</span>
                            <div className="code-display">{createdSession.session_code}</div>
                        </div>
                        
                        <div className="stats-row">
                            <span>👥 {headcount} Joined</span>
                            {/* Only show event count if we have it (creators do, joiners might not initially) */}
                            {eventCount > 0 && <span>🎉 {eventCount} Options</span>}
                        </div>

                        <div className="chat-section">
                            <div className="chat-window">
                                {chatLog.length === 0 ? <p className="empty-chat">Start the discussion...</p> : 
                                    chatLog.map((msg, i) => (
                                        <div key={i} className={`chat-bubble ${msg.sender === hostName ? 'mine' : 'theirs'}`}>
                                            <strong>{msg.sender}: </strong> {msg.message}
                                        </div>
                                    ))
                                }
                            </div>
                            <form onSubmit={handleSendMessage} className="chat-input">
                                <input type="text" placeholder="Message..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                                <button type="submit">Send</button>
                            </form>
                        </div>

                        <button onClick={() => setCreatedSession(null)} className="btn-secondary">End Session</button>
                    </div>
                )}
            </div>

            <style>{`
                .page-wrapper { font-family: 'Inter', sans-serif; background-color: #f0f2f5; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
                .home-container { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 600px; text-align: center; border: 1px solid #e0e2e5; }
                .app-header h1 { color: #333; font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; }
                .subtitle { color: #777; margin-bottom: 1.5rem; }
                
                .error-message { background-color: #ffebeb; color: #d8000c; padding: 10px; border-radius: 6px; margin-bottom: 15px; }

                .input-group { text-align: left; margin-bottom: 1rem; }
                .input-group label { display: block; font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.5rem; }
                .input-group input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; }
                
                button { width: 100%; padding: 0.8rem; background-color: #007bff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
                button:hover { background-color: #0056b3; }
                .btn-secondary { background-color: #6c757d; margin-top: 10px; }
                
                .divider-text { margin: 15px 0; font-weight: bold; color: #ccc; font-size: 0.8rem; }
                
                .invite-section { background: #e8f0fe; border: 2px dashed #007bff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
                .code-display { font-size: 2.5rem; font-weight: 800; letter-spacing: 5px; color: #333; }
                .stats-row { display: flex; justify-content: space-around; margin-bottom: 1rem; font-weight: 600; color: #555; }

                .chat-section { border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; }
                .chat-window { height: 250px; overflow-y: auto; background: #fafafa; padding: 10px; text-align: left; }
                .empty-chat { text-align: center; color: #aaa; font-style: italic; margin-top: 100px; }
                .chat-bubble { padding: 8px 12px; margin-bottom: 8px; border-radius: 12px; font-size: 0.9rem; max-width: 80%; width: fit-content; }
                .chat-bubble.mine { background: #007bff; color: white; margin-left: auto; border-bottom-right-radius: 0; }
                .chat-bubble.theirs { background: #e9ecef; color: #333; margin-right: auto; border-bottom-left-radius: 0; }
                .chat-input { display: flex; border-top: 1px solid #eee; }
                .chat-input input { flex-grow: 1; border: none; padding: 12px; outline: none; }
                .chat-input button { width: auto; border-radius: 0; margin: 0; }
                .back-link { display: inline-block; color: #777; text-decoration: none; font-weight: 600; margin-top: 10px; }
            `}</style>
        </div>
    );
};

export default SocialPlanner;
