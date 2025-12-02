import 'bootstrap/dist/css/bootstrap.css';
import {React, useState} from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        if (event) event.preventDefault();

        try {
            const res = await axios.get('http://localhost:9000/getUser', {
                params: { username, password }
            });

            if(res.data) {
                localStorage.setItem('userId', res.data._id);
                localStorage.setItem('firstName', res.data.f_name);
                console.log("Login Success! User ID Stored: ", res.data._id);
                navigate('/Home'); // Redirect Users to Home
                return;
            }
        }

        catch(err)
        {
            if(err.response && err.response.status === 404) {
                try {
                    const hostRes = await axios.get('http://localhost:9000/getHost', {
                        params: { username, password }
                    });

                    if (hostRes.data) {
                        navigate('/HostHome'); // Redirect Hosts to HostHome
                    }
                }

                catch (hostErr)
                {
                    if(hostErr.response && hostErr.response.status === 404)
                    {
                        alert('Wrong Credentials');
                    }

                    else {
                        alert('Error in Login System');
                    }
                }
            }

            else
            {
                alert('Error in Login');
            }
        }
    };

    return (
        <div className="page-wrapper">
            <div className="login-container">
                <h1>Welcome Back</h1>
                <p className="subtitle">Login to decide your next plan.</p>
                <form onSubmit={handleLogin}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Log In</button>
                </form>
                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>

            <div className="hostreg-link">
                Looking to host an event? <Link to="/HostSignup">Register</Link>
            </div>
    
    
            <style>{`
                /* A modern, clean stylesheet for the login form */
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    line-height: 1.6;
                }

                /* Main login container */
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

                /* Input field styles */
                .input-group input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 1rem;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }

                .input-group input:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                    outline: none;
                }

                /* Submit button */
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

                button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }

                /* Signup link text */
                .signup-link {
                    margin-top: 2rem;
                    font-size: 0.9rem;
                    color: #555;
                }

                .signup-link a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .signup-link a:hover {
                    text-decoration: underline;
                }
                
                /* Host Signup link text */
                .hostreg-link {
                    margin-top: 0.25rem;
                    font-size: 0.9rem;
                    color: #555;
                }

                .hostreg-link a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .hostreg-link a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Login;
