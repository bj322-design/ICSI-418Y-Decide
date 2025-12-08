import { Link } from 'react-router-dom';
import axios from 'axios'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react"


const HostSignup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhoneNum] = useState('');
    const [org_name, setOrgName] = useState('');

    const handleSignUp = async () => {
        try {
            await axios.post('http://localhost:9000/createHost', { username, password, email, phone, org_name });
            navigate('/'); //takes you back to the login page if successfully signed up

        } catch (err) {
            alert('Error in Signing Up')
        }
    }
    useEffect(() => {
        document.title = 'Host Registration';
    }, []);


    return (
        <div className="login-container">
            <h1>Host Registration</h1>
            <form action="#" method="post">

                <div className="input-group">
                    <label htmlFor="User ID">User ID:</label>
                    <input type="text" id="UserID" name="User ID" required value={username} onChange={(e) =>
                        setUsername(e.target.value)}></input>
                </div>


                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required value={password} onChange={(e) =>
                        setPassword(e.target.value)}></input>
                </div>

                <div className="input-group">
                    <label htmlFor="Email">Email:</label>
                    <input type="text" id="Email" name="Email" required value={email} onChange={(e) =>
                        setEmail(e.target.value)}></input>
                </div>

                <div className="input-group">
                    <label htmlFor="Phone">Phone Number:</label>
                    <input type="text" id="Phone" name="Phone" required value={phone} onChange={(e) =>
                        setPhoneNum(e.target.value)}></input>
                </div>

                <div className="input-group">
                    <label htmlFor="Org Name">Organization Name:</label>
                    <input type="text" id="Org_Name" name="Org Name" required value={org_name} onChange={(e) =>
                        setOrgName(e.target.value)}></input>
                </div>


                <button type="button" name="submitBut" id="submitBut" onClick={(event) => handleSignUp(event, username, password, email, phone, org_name)}>Register
                </button>

            </form>

            <div className="signup-link">
                Already have an account? <Link to="/">Log in</Link>
            </div>


            <style jsx>{`
                /* A modern, clean stylesheet for the login and signup forms */
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

                /* Main container for both forms */
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

                /* Link text */
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
            `}</style>
        </div>
    );
};


export default HostSignup;