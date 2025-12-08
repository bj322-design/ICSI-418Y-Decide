import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserSettings = () => {
    const [userData, setUserData] = useState({
        username: '',
        f_name: '',
        l_name: '',
        password: '',
        profile_image: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const currentUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    // 1. Fetch current user data on load
    const fetchUserData = useCallback(async () => {
        if (!currentUserId) {
            setStatus('Error: User not logged in.');
            setLoading(false);
            return;
        }

        const GET_USER_DETAILS_URL = `http://localhost:9000/getUserDetailsById?userId=${currentUserId}`;

        try {
            const response = await axios.get(GET_USER_DETAILS_URL);
            const user = response.data;

            setUserData({
                username: user.username || '',
                f_name: user.f_name || '',
                l_name: user.l_name || '',
                password: '',
                profile_image: user.profile_image || ''
            });
            setPreviewImage(user.profile_image || ''); // Set current image URL for preview
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile data:", err);
            setStatus("Could not load current profile data.");
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        document.title = 'Account Settings';
        fetchUserData();
    }, [fetchUserData]);

    // 2. Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Handle file selection and preview
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // 4. Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Saving...');

        const formData = new FormData();
        formData.append('userId', currentUserId);

        formData.append('username', userData.username);
        formData.append('f_name', userData.f_name);
        formData.append('l_name', userData.l_name);

        if (userData.password) {
            formData.append('password', userData.password);
        }

        if (profileImageFile) {
            formData.append('profile_image', profileImageFile);
        }

        try {
            const response = await axios.post('http://localhost:9000/updateUserProfile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus(`Success: ${response.data.message}`);

            const updatedUser = response.data.updatedUser;

            if (updatedUser.username) {
                localStorage.setItem('username', updatedUser.username);
            }

            setProfileImageFile(null);
            setPreviewImage(updatedUser.profile_image || '');

            setUserData(prev => ({
                ...prev,
                username: updatedUser.username,
                f_name: updatedUser.f_name,
                l_name: updatedUser.l_name,
                password: '',
                profile_image: updatedUser.profile_image
            }));


        } catch (error) {
            console.error("Update failed:", error.response || error);
            setStatus(`Error: ${error.response?.data?.message || 'Update failed.'}`);
        }
    };

    // 5. Handle account deletion
    const handleDeleteAccount = async () => {
        if (!window.confirm("WARNING: Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all associated data.")) {
            return;
        }

        setStatus('Deleting...');
        try {
            await axios.post('http://localhost:9000/deleteUser', { userId: currentUserId });

            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('currentEventIndex');

            alert("Account successfully deleted. Redirecting to login.");
            navigate('/login');
        } catch (error) {
            console.error("Deletion failed:", error.response || error);
            setStatus(`Error: Deletion failed (${error.response?.data?.message || 'Server error'}).`);
        }
    };


    // Fallback initials display when no image exists (either default or uploaded)
    const renderAvatarFallback = () => {
        const initials = userData.f_name?.[0] + userData.l_name?.[0];
        return (
            <div className="avatar-initials-fallback">
                {initials || '?'}
            </div>
        );
    }

    // Fallback loading message
    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="settings-container">
                    <div className="status-msg">Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="settings-container">

                {/* Header */}
                <div className="app-header">
                    <h1>Account Settings</h1>
                    <p className="subtitle">Update your profile information and credentials.</p>
                </div>

                {/* MOVED: DELETE BUTTON CONTAINER (Below subtitle, above form) */}
                <div className="delete-button-container">
                    <button onClick={handleDeleteAccount} className="delete-account-btn" disabled={status.includes('Deleting')}>
                        Delete Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="card-area">

                        {/* Status Message Area */}
                        {status && (
                            <div className={`status-message ${status.startsWith('Error') ? 'error-status' : 'success-status'}`}>
                                {status}
                            </div>
                        )}

                        {/* Visual Box 1: Profile Picture Update */}
                        <div className="settings-section profile-image-settings">
                            <h3>Profile Picture</h3>
                            <div className="image-upload-area">
                                <div className="current-avatar-container">
                                    {/* Display image if previewImage (local or remote URL) is available, otherwise show initials */}
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile Preview"
                                            className="profile-preview-image"
                                        />
                                    ) : (
                                        renderAvatarFallback()
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="profile_image"
                                    name="profile_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profile_image" className="upload-btn">
                                    Upload New Picture
                                </label>
                                <small>Max size 5MB. Will display on Profile tab.</small>
                            </div>
                        </div>

                        {/* Visual Box 2: Name and Username */}
                        <div className="settings-section info-settings">
                            <h3>Basic Information</h3>
                            <div className="input-group">
                                <label htmlFor="f_name">First Name</label>
                                <input
                                    type="text"
                                    name="f_name"
                                    value={userData.f_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="l_name">Last Name</label>
                                <input
                                    type="text"
                                    name="l_name"
                                    value={userData.l_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <small>Changing this requires availability check.</small>
                            </div>
                        </div>

                        {/* Visual Box 3: Password Update */}
                        <div className="settings-section password-settings">
                            <h3>Security</h3>
                            <div className="input-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={status.includes('Saving') || status.includes('Deleting')}>
                        {status.includes('Saving') ? 'Saving...' : 'Save All Changes'}
                    </button>
                </form>


                <hr className={"divider"}/>

                {/* Navigation Dock */}
                <div className="nav-dock">
                    <Link to="/Home" className="dock-link">Home</Link>
                    <Link to="/Profile" className="dock-link">← Back to Profile</Link>
                </div>
            </div>

            <style>{`
                /* Base Styles */
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

                .settings-container {
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
                
                .app-header h1 {
                    color: #333;
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -1px;
                }
                
                .subtitle {
                    color: #777;
                    margin: 0 0 1.5rem 0;
                    font-size: 0.9rem;
                }
                
                /* NEW CSS ADJUSTMENTS FOR DELETE BUTTON */
                .delete-button-container {
                    /* Positions the button below the header block */
                    text-align: center;
                    margin-bottom: 1.5rem; /* Space before the card area */
                    padding: 0; 
                }

                /* DELETE BUTTON STYLES */
                .delete-account-btn {
                    background-color: #dc3545; 
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .delete-account-btn:hover:not(:disabled) {
                    background-color: #c82333; 
                }

                .delete-account-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                /* END NEW STYLES */


                .settings-form {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .card-area {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                /* Status Message */
                .status-message {
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin: -1rem 0 0.5rem;
                }
                .success-status {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .error-status {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                /* Settings Boxes */
                .settings-section {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 10px;
                    text-align: left;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .settings-section h3 {
                    margin-top: 0;
                    color: #495057;
                    font-size: 1.2rem;
                    border-bottom: 2px solid #dee2e6;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }

                /* Input Group Styling */
                .input-group {
                    margin-bottom: 15px;
                }
                .input-group:last-of-type {
                    margin-bottom: 0;
                }

                .input-group label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #555;
                    margin-bottom: 5px;
                }
                
                .input-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    box-sizing: border-box;
                    font-size: 1rem;
                }

                .input-group small {
                    display: block;
                    color: #777;
                    font-size: 0.8rem;
                    margin-top: 4px;
                }

                /* Image Upload Styles */
                .image-upload-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding-top: 10px;
                }

                .current-avatar-container {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #ccc;
                    border: 3px solid #007bff;
                }
                
                .profile-preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .avatar-initials-fallback {
                    width: 100%;
                    height: 100%;
                    background-color: #007bff;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 600;
                }

                .upload-btn {
                    background-color: #007bff;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                
                .upload-btn:hover {
                    background-color: #0056b3;
                }

                /* Save Button */
                .save-btn {
                    background-color: #28a745;
                    color: white;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .save-btn:hover:not(:disabled) {
                    background-color: #218838;
                }
                
                .save-btn:disabled {
                    background-color: #90ee90;
                    cursor: not-allowed;
                }


                /* Dock Styles */
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

export default UserSettings;