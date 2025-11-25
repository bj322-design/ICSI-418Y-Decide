import 'bootstrap/dist/css/bootstrap.css';
import {React, useState} from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event, username, password) => {
    axios.get('http://localhost:9000/getUser', { params: { username, password}})
        .then((res) => {
            if (res.data) {
                navigate('/Home');
                //navigate('/CreateProject'); //Brings you to the create project tab
                //alert('Login Successful')
            }
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                 alert('Wrong Credentials');
            } else {
                alert('Error in Login');
            }
        });
}

    return (
        <div class="login-container">
            <h1>Login</h1>
            <form action="#" method="post">
                <div className="input-group">
                    <label htmlFor="User ID">User ID:</label>
                    <input type="text" id="User ID" name="User ID" required value = {username} onChange = {(e) =>
                        setUsername(e.target.value)}></input>
                </div>
                <div class="input-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required value = {password} onChange = {(e) =>
                        setPassword(e.target.value)}></input>
                </div>
                 <button type="button" onClick={(event) => {
                    handleLogin(event, username, password)
                }}>Login</button>
            </form>

            <div className="signup-link">
                Don't have an account? <Link to="/Signup">Sign up</Link>
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
            `}</style>
        </div>



    );
};





export default Login;
