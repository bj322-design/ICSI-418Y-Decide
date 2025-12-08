import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('userId');

    // Use useCallback to memoize the fetch function and ensure proper dependency tracking
    const fetchProfileData = useCallback(async () => {
        if (!currentUserId) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        // New endpoint now correctly returns the profile_image field
        const GET_USER_DETAILS_URL = `http://localhost:9000/getUserDetailsById?userId=${currentUserId}`;

        try {
            const response = await axios.get(GET_USER_DETAILS_URL);
            const user = response.data;

            setUserData({
                username: user.username,
                firstName: user.f_name,
                lastName: user.l_name,
                email: user.email,
                profile_image: user.profile_image || '', // Retrieve the image URL
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile data:", err);
            setError("Error loading profile data. Please check server logs.");
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        document.title = 'My Profile';
        fetchProfileData();
    }, [fetchProfileData]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('currentEventIndex');
        navigate('/login');
    };

    // Helper to render the avatar content (image or initials)
    const renderAvatar = () => {
        const initials = userData.firstName?.[0] + userData.lastName?.[0];

        if (userData.profile_image) {
            // Display the uploaded image
            return (
                <img
                    src={userData.profile_image}
                    alt={`${userData.firstName} Profile`}
                    className="avatar-image"
                />
            );
        } else {
            // Display initials as a fallback
            return (
                <div className="avatar-initials">
                    {initials}
                </div>
            );
        }
    }


    return (
        <div className="page-wrapper">
            <div className="profile-container">
                {/* Header */}
                <div className="app-header">
                    <h1>My Profile</h1>
                </div>

                {/* Profile Card Area (Simulating the visual 'box' of data) */}
                <div className="card-area">
                    {loading && <div className="status-msg">Loading user data...</div>}
                    {error && <div className="status-msg error">{error}</div>}

                    {!loading && userData && (
                        <div className="profile-card">

                            {/* Visual Box 1: Avatar/Initials */}
                            <div className="profile-header-box">
                                <div className="avatar-circle">
                                    {renderAvatar()}
                                </div>
                                <h2>{userData.firstName} {userData.lastName}</h2>
                                <p className="username-tag">@{userData.username}</p>
                            </div>

                            {/* Visual Box 2: Core Details */}
                            <div className="details-box">
                                <h3>Contact Information</h3>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>User ID:</strong> {currentUserId}</p>
                            </div>

                            {/* Visual Box 3: Actions */}
                            <div className="action-box">
                                <button onClick={() => navigate('/UserSettings')} className="action-btn settings-btn">
                                    Account Settings
                                </button>
                                <button onClick={handleLogout} className="action-btn logout-btn">
                                    Log Out
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                <hr className={"divider"}/>

                {/* Navigation Dock */}
                <div className="nav-dock">
                    <Link to="/Home" className="dock-link">Home</Link>
                    <Link to="/Events" className="dock-link">My Events</Link>
                    <Link to="/SocialPlanner" className="dock-link">Plan</Link>
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

                .profile-container {
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
                    min-height: 700px; 
                }
                
                .app-header h1 {
                    color: #333;
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                }
                
                /* Profile Card Area */
                .card-area {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 1.5rem;
                }
                
                .status-msg {
                    color: #777;
                    font-size: 1rem;
                    font-style: italic;
                    margin-top: 50px;
                }
                
                .profile-card {
                    width: 100%;
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    text-align: center;
                }

                /* Visual Box 1: Header/Avatar */
                .profile-header-box {
                    background: #e9ecef; /* Light gray background */
                    padding: 2rem 1.5rem;
                    border-radius: 12px 12px 0 0;
                    margin-bottom: 1rem;
                }

                .avatar-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px auto;
                    overflow: hidden;
                    background-color: #007bff; /* Primary color for initials fallback */
                }
                
                .avatar-initials {
                    color: white;
                    font-size: 2rem;
                    font-weight: 600;
                }
                
                .avatar-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-header-box h2 {
                    margin: 0;
                    color: #333;
                    font-size: 1.5rem;
                }
                
                .username-tag {
                    color: #6c757d;
                    margin: 0;
                    font-size: 0.9rem;
                }

                /* Visual Box 2: Details */
                .details-box {
                    background: #f8f9fa; /* Lighter background */
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 0 1rem 1rem 1rem;
                    text-align: left;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .details-box h3 {
                    margin-top: 0;
                    color: #495057;
                    font-size: 1.1rem;
                    border-bottom: 1px solid #dee2e6;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }
                
                .details-box p {
                    margin: 5px 0;
                    font-size: 0.95rem;
                    color: #555;
                }
                
                /* Visual Box 3: Actions */
                .action-box {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 0 1rem 1.5rem 1rem;
                }

                .action-btn {
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s, opacity 0.2s;
                    border: 1px solid transparent;
                }

                .settings-btn {
                    background-color: #28a745;
                    color: white;
                }
                
                .settings-btn:hover {
                    background-color: #218838;
                }

                .logout-btn {
                    background-color: #dc3545;
                    color: white;
                }
                
                .logout-btn:hover {
                    background-color: #c82333;
                }

                /* Divider and Dock Styles (Copied from Home/MyEvents) */
                .divider {
                    border: 0;
                    height: 1px;
                    background: #e0e2e5;
                    margin: 0 0 1rem 0;
                    width: 100%;
                }

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

export default Profile;