import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyEvents = () => {
    const [myGroups, setMyGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        document.title = 'My Events'; 
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const groupRes = await axios.get('http://localhost:9000/getMyGroups', {
                params: { managerId: currentUserId }
            });

            setMyGroups(groupRes.data);

            const usersRes = await axios.get('http://localhost:9000/getUsers');
            setAllUsers(usersRes.data);
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    const handleInvite = (teamId) => {
        const userIdToInvite = selectedUser[teamId];
        if(!userIdToInvite) return alert("Please select a user first");

        axios.post('http://localhost:9000/inviteToGroup', {
            teamId: teamId,
            userIdToInvite: userIdToInvite
        }).then(() => {
            alert("User invited successfully!");
        }).catch(err => alert("Failed to invite: " + err.response?.data || err.message));
    };

    return (
        <div className="page-wrapper">
            <div className="content-container">
                <div className="header">
                    <h1>My Groups</h1>
                    <p className="subtitle">Events you are leading.</p>
                </div>

                <div className="groups-list">
                    {myGroups.length === 0 ? (
                        <div className="empty-state">
                            You haven't liked any events yet. <br/>
                            <Link to="/Home">Go Swipe!</Link>
                        </div>
                    ) : (
                        myGroups.map((group) => (
                            <div key={group._id} className="group-card">
                                <div className="group-header">
                                    <h3>{group.team_name}</h3>
                                    <span className="role-badge">Leader</span>
                                </div>

                                <div className="members-section">
                                    <p><strong>Members:</strong> {group.members.length}</p>
                                </div>

                                <div className="invite-section">
                                    <select
                                        className="user-select"
                                        onChange={(e) => setSelectedUser({...selectedUser, [group._id]: e.target.value})}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a friend...</option>
                                        {allUsers.map(u => (
                                            <option key={u._id} value={u._id}>
                                                {u.f_name} {u.l_name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="invite-btn"
                                        onClick={() => handleInvite(group._id)}
                                    >
                                        Invite
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="nav-dock">
                    <Link to="/Home" className="dock-link">← Back to Swiping</Link>
                </div>
            </div>

            <style>{`
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
                    max-width: 500px;
                    text-align: center;
                    border: 1px solid #e0e2e5;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 80vh;
                    max-height: 850px;
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

                .divider {
                    border: 0;
                    height: 1px;
                    background: #e0e2e5;
                    margin: 1rem 0;
                    width: 100%;
                }

                /* Nav Dock */
                .nav-dock {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding-top: 0.5rem;
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

                .groups-scroll-area {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                    margin-bottom: 1rem;
                    border-top: 1px solid #f0f2f5;
                    border-bottom: 1px solid #f0f2f5;
                }

                .groups-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .groups-scroll-area::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                }
                .groups-scroll-area::-webkit-scrollbar-thumb {
                    background: #ccc; 
                    border-radius: 3px;
                }

                .status-msg {
                    color: #777;
                    font-size: 1rem;
                    font-style: italic;
                    margin-top: 2rem;
                }

                .group-card {
                    background: white;
                    border: 1px solid #e0e2e5;
                    border-radius: 12px;
                    padding: 1.25rem;
                    margin-bottom: 1rem;
                    text-align: left;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .group-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border-color: #007bff;
                }

                .group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .group-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #333;
                    font-weight: 700;
                }

                .role-badge {
                    background-color: #ffc107;
                    color: #333;
                    font-size: 0.7rem;
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .group-info {
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 1rem;
                }

                .invite-section {
                    display: flex;
                    gap: 0.5rem;
                    background: #f8f9fa;
                    padding: 0.75rem;
                    border-radius: 8px;
                }

                .user-select {
                    flex-grow: 1;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: white;
                }

                .user-select:focus {
                    outline: none;
                    border-color: #007bff;
                }

                .invite-btn {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .invite-btn:hover {
                    background-color: #218838;
                }
            `}</style>
        </div>
    );
};

export default MyEvents;