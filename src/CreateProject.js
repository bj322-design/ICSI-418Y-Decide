import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateProject = () => {
    const navigate = useNavigate();

    // Data lists
    const [users, setUsers] = useState([]); 
    const [teams, setTeams] = useState([]);

    // State to hold form input values (using *Id for select inputs)
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [productOwnerId, setProductOwnerId] = useState(''); // Stores selected ID
    const [managerId, setManagerId] = useState('');            // Stores selected ID
    const [teamId, setTeamId] = useState('');                  // Stores selected ID
    
    // State for submission messages
    const [message, setMessage] = useState(null);

    // 1. Fetch Users and Teams on component mount
    useEffect(() => {
        // Fetch Users
        axios.get('http://localhost:9000/getUsers')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setMessage({ type: 'error', text: 'Error fetching user list.' });
            });

        // Fetch Teams
        axios.get('http://localhost:9000/getTeams')
            .then((response) => setTeams(response.data))
            .catch((error) => {
                console.error("Error fetching teams:", error);
                setMessage({ type: 'error', text: 'Error fetching team list.' });
            });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(null);

        // Validation now uses the correct ID state variables
        if (!projectName || !productOwnerId || !managerId || !teamId) {
            setMessage({ type: 'error', text: 'Project Name, Product Owner, Manager, and Team are required.' });
            return;
        }

        const requestBody = {
            proj_name: projectName, 
            proj_desc: projectDescription, 
            prod_owner_id: productOwnerId, 
            mgr_id: managerId, 
            team_id: teamId 
        };

        axios.post('http://localhost:9000/createProject', requestBody)
            .then(() => {
                setMessage({ type: 'success', text: `Project "${projectName}" successfully created! Redirecting...` });
                
                // Redirect user to the Home page after a short delay
                setTimeout(() => {
                    navigate('/HostHome');
                }, 1500);
            })
            .catch((err) => {
                console.error('Project creation failed:', err);
                setMessage({ type: 'error', text: 'Error in creating project. Please check server logs.' });
            });
    };
    
    return (
        <div className="page-wrapper">
            <div className="login-container">
                <h1>Create New Project</h1>
                <form onSubmit={handleSubmit}>

                    {/* Submission Message Display */}
                    {message && (
                        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
                            {message.text}
                        </div>
                    )}

                    {/* Project Name - Input text */}
                    <div className="input-group">
                        <label htmlFor="projectName">Project Name:</label>
                        <input
                            type="text"
                            id="proj_name"
                            name="projectName"
                            required
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>

                    {/* Project Description - Textarea */}
                    <div className="input-group">
                        <label htmlFor="projectDescription">Project Description:</label>
                        <textarea
                            id="proj_desc"
                            name="projectDescription"
                            rows="4" // Set initial height
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            className="textarea-input" // Custom class for styling consistency
                        />
                    </div>

                    {/* Product Owner - Dropdown */}
                    <div className="input-group">
                        <label htmlFor="productOwner">Product Owner:</label>
                        <select
                            id="prod_owner_id"
                            name="productOwner"
                            required
                            value={productOwnerId}
                            onChange={(e) => setProductOwnerId(e.target.value)}
                            className="select-input" 
                        >
                            <option value="">Select Product Owner</option>
                            {/* FIX: Use f_name and l_name to match the MongoDB user schema */}
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.f_name} {user.l_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Manager - Dropdown */}
                    <div className="input-group">
                        <label htmlFor="manager">Manager:</label>
                        <select
                            id="managerId"
                            name="manager"
                            required
                            value={managerId} 
                            onChange={(e) => setManagerId(e.target.value)}
                            className="select-input" 
                        >
                            <option value="">Select Manager</option>
                            {/* FIX: Use f_name and l_name to match the MongoDB user schema */}
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.f_name} {user.l_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team - Dropdown */}
                    <div className="input-group">
                        <label htmlFor="team_id">Team:</label>
                        <select
                            id="teamId"
                            name="team"
                            required
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            className="select-input"
                        >
                            <option value="">Select Team</option>
                            {teams.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.team_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Create Project</button>
                </form>

                <Link to="/Home" className="back-link">← Back to Dashboard</Link>
            </div>


            <style>{`
                /* A modern, clean stylesheet for the form */
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

                /* Main container for the form (reusing login-container class) */
                .login-container {
                    background-color: #ffffff;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 420px;
                    text-align: center;
                    border: 1px solid #e0e2e5;
                }

                /* Heading styles */
                h1 {
                    color: #333;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                    font-weight: 700;
                }

                /* Input group container */
                .input-group {
                    margin-bottom: 1.5rem;
                    text-align: left;
                }

                /* Labels for input fields */
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #555;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                /* Input field styles (for text inputs, textarea, and select) */
                .input-group input, .input-group textarea, .select-input { 
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 1rem;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    font-family: inherit; 
                    resize: vertical; 
                    background-color: white; 
                }

                .input-group input:focus, .input-group textarea:focus, .select-input:focus { 
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                    outline: none;
                }

                /* Submit button */
                button[type="submit"] {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    margin-top: 1.5rem; /* Added margin for separation */
                }

                button[type="submit"]:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }

                /* Fallback button style (removed type="button" from final button) */
                button {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                /* Error Message Style */
                .error-message {
                    background-color: #ffebeb;
                    color: #d8000c;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #d8000c;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: left;
                }

                /* Success Message Style (New) */
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
            `}</style>
        </div>
    );
};


export default CreateProject;