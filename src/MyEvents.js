import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyEvents = () => {
    const [myGroups, setMyGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});

    const currentUserId = localStorage.getItem('userId');

    // Stabilize fetchData with useCallback
    const fetchData = useCallback(async () => {
        try {
            // The /getMyGroups endpoint on the server is now updated to return full details.
            const groupRes = await axios.get('http://localhost:9000/getMyGroups', {
                params: { managerId: currentUserId }
            });

            setMyGroups(groupRes.data);

            const usersRes = await axios.get('http://localhost:9000/getUsers');
            setAllUsers(usersRes.data);
        } catch (error) {
            console.error("Error loading data", error);
        }
    }, [currentUserId]);

    useEffect(() => {
        document.title = 'My Events';
        fetchData();
    }, [fetchData]); // Dependency fix

    const handleInvite = (teamId) => {
        const userIdToInvite = selectedUser[teamId];
        if(!userIdToInvite) return alert("Please select a user first");

        axios.post('http://localhost:9000/inviteToGroup', {
            teamId: teamId,
            userIdToInvite: userIdToInvite
        }).then(() => {
            alert("User invited successfully!");
            fetchData(); // Refresh the list
        }).catch(err => alert("Failed to invite: " + err.response?.data || err.message));
    };

    const handleLeaveGroup = async (teamId, teamName) => {
        if (!window.confirm(`Are you sure you want to leave the group "${teamName}"?`)) {
            return;
        }

        try {
            const res = await axios.post('http://localhost:9000/leaveGroup', {
                teamId: teamId,
                userId: currentUserId
            });

            if (res.data.groupDeleted) {
                alert("Group deleted successfully!");
            } else {
                alert("You have left the group successfully!");
            }
            fetchData(); // Refresh the list
        } catch (error) {
            alert("Failed to leave group: " + error.response?.data?.message || error.message);
        }
    }

    // Function to render members neatly
    const renderMembers = (memberNames) => {
        // Defensive check: If memberNames is null/undefined or empty, handle gracefully
        if (!memberNames || memberNames.length === 0) {
            return <span className="member-names-list">No members.</span>;
        }

        return (
            <div className="member-names-list">
                {memberNames.map((member, index) => (
                    <span
                        key={member.id}
                        className={`member-tag ${member.isCurrentUser ? 'current-user' : ''}`}
                    >
                        {member.name}
                        {index < memberNames.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="page-wrapper">
            <div className="content-container">
                <div className="header">
                    <h1>My Groups</h1>
                    <p className="subtitle">Events you are planning or attending.</p>
                </div>

                <div className="groups-list">
                    {myGroups.length === 0 ? (
                        <div className="empty-state">
                            You aren't associated with any groups. <br/>
                            <Link to="/Home">Go Swipe!</Link>
                        </div>
                    ) : (
                        myGroups.map((group) => (
                            <div key={group._id} className="group-card">
                                <div className="group-header">
                                    <h3>{group.team_name}</h3>
                                    <span className="role-badge">{group.isManager ? 'Leader' : 'Member'}</span>
                                </div>

                                {/* Displaying Group Members (Defensive access using ?.length || 0) */}
                                <div className="members-section">
                                    <p>
                                        <strong>Members ({group.memberNames?.length || 0}):</strong>
                                    </p>
                                    {renderMembers(group.memberNames)}
                                </div>

                                {/* Invite Section - Only visible if the user is the manager */}
                                {group.isManager && (
                                    <div className="invite-section">
                                        <select
                                            className="user-select"
                                            onChange={(e) => setSelectedUser({...selectedUser, [group._id]: e.target.value})}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a friend...</option>
                                            {/* Filter out users already in the group */}
                                            {allUsers.filter(u => !group.members.includes(u._id)).map(u => (
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
                                )}

                                {/* Leave Group Button */}
                                <div className="action-section">
                                    <button
                                        className="leave-btn"
                                        onClick={() => handleLeaveGroup(group._id, group.team_name)}
                                    >
                                        Leave Group
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
                /* ... (All styles included for completeness) ... */
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

                .content-container {
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
                    min-height: 80vh;
                }
                
                .header h1 {
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

                .groups-list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                    margin-bottom: 1rem;
                }

                .empty-state {
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

                .members-section {
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f0f2f5;
                }
                
                .member-names-list {
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                    color: #555;
                    line-height: 1.4;
                    display: block;
                }
                
                .member-tag {
                    display: inline-block;
                }
                
                .member-tag.current-user {
                    font-weight: 700;
                    color: #007bff;
                }


                .invite-section {
                    display: flex;
                    gap: 0.5rem;
                    background: #f8f9fa;
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-top: 0.75rem;
                }

                .user-select {
                    flex-grow: 1;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: white;
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
                
                .action-section {
                    margin-top: 1rem;
                    text-align: right;
                }

                .leave-btn {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .leave-btn:hover {
                    background-color: #c82333;
                }
                
                .nav-dock {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding-top: 0.5rem;
                    border-top: 1px solid #e0e2e5;
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

export default MyEvents;