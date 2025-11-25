import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewTeams = () => {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success/error messages

    // 1. Fetch Teams
    const fetchTeams = () => {
        setLoading(true);
        setError(null);
        axios.get('http://localhost:9000/getTeams')
            .then((res) => {
                setTeams(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching teams:", err);
                setError("Failed to load teams. Check the server connection.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // 2. Handle Team Creation
    const handleCreateTeam = (event) => {
        event.preventDefault();
        setMessage(null);

        if (!newTeamName.trim()) {
            setMessage({ type: 'error', text: 'Team name cannot be empty.' });
            return;
        }

        const requestBody = { team_name: newTeamName.trim() };

        axios.post('http://localhost:9000/createTeam', requestBody)
            .then(() => {
                setMessage({ type: 'success', text: `Team "${newTeamName.trim()}" created!` });
                setNewTeamName(''); // Clear the input
                fetchTeams(); // Refresh the list
            })
            .catch((err) => {
                console.error('Team creation failed:', err);
                setMessage({ type: 'error', text: 'Error creating team. Please check server logs.' });
            });
    };


    const renderTeamList = () => {
        if (loading) {
            return <div className="loading-message">Loading teams...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (teams.length === 0) {
            return (
                <div className="team-item empty">
                    No teams have been created yet. Use the form below to add one.
                </div>
            );
        }

        return (
            <ul className="team-list">
                {teams.map((team) => (
                    <li key={team._id} className="team-item">
                        <span className="team-name">{team.team_name}</span>
                        <span className="team-manager">ID: {team._id}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="page-wrapper">
            <div className="content-container">
                <h1>Team Directory</h1>
                <p className="subtitle">All active teams.</p>
                
                <div className="placeholder-content">
                    {renderTeamList()}
                </div>

                {/* --- New Team Creation Form --- */}
                <div className="create-team-section">
                    <h2>Create New Team</h2>
                    
                    {/* Message Display */}
                    {message && (
                        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleCreateTeam} className="create-team-form">
                        <div className="input-group">
                            <label htmlFor="newTeamName">Team Name:</label>
                            <input
                                type="text"
                                id="newTeamName"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="e.g., Alpha Development"
                                required
                            />
                        </div>
                        <button type="submit">Add Team</button>
                    </form>
                </div>
                {/* --- End New Team Creation Form --- */}


                <Link to="/Home" className="back-link">← Back to Dashboard</Link>
            </div>

            <style>{`
                /* General Layout Styles */
                .page-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
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
                }

                .placeholder-content {
                    text-align: left;
                    margin-bottom: 2rem;
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }
                
                /* Team List Styles */
                .team-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .team-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .team-item.empty, .loading-message, .error-message {
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
                    margin-bottom: 1rem;
                }
                .success-message {
                    background-color: #e6ffed;
                    color: #008744;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #008744;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: left;
                }

                .team-name {
                    font-weight: 600;
                    color: #007bff;
                    font-size: 1.1rem;
                }

                .team-manager {
                    font-size: 0.9rem;
                    color: #555;
                    font-style: italic;
                }
                
                .back-link {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 500;
                    margin-top: 2rem;
                    display: inline-block;
                }
                
                .back-link:hover {
                    text-decoration: underline;
                }

                /* --- New Team Form Styles --- */
                .create-team-section {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    border-top: 2px solid #007bff;
                    background-color: #f7f9fc;
                    border-radius: 8px;
                    text-align: left;
                }

                .create-team-section h2 {
                    font-size: 1.4rem;
                    color: #333;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 0.5rem;
                }
                
                .create-team-form .input-group {
                    margin-bottom: 1rem;
                }
                
                .create-team-form input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 1rem;
                }

                .create-team-form button {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #28a745; /* Green for creation */
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }
                
                .create-team-form button:hover {
                    background-color: #1e7e34;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default ViewTeams;