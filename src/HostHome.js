import React from 'react';
import {useEffect} from "react"
import { Link } from 'react-router-dom';

const HostHome = () => {

    useEffect(() => {
        document.title = 'Host Home';
    }, []);

    return (
        <div className="page-wrapper">
            <div className="home-container">
                <h1>Welcome to the Host Dashboard</h1>
                <p className="subtitle">Select an action to continue.</p>

                <div className="button-group">
                    <Link to="/CreateEvent" className="nav-button create">
                        Create Event
                    </Link>
                    <Link to="/ViewEvents" className="nav-button view">
                        View Your Events
                    </Link>
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

                .home-container {
                    background-color: #ffffff;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 500px;
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
                    color: #555;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                
                /* Navigation Buttons */
                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .nav-button {
                    display: block;
                    padding: 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    color: white; /* Default text color */
                }

                /* Specific Button Styles */
                .nav-button.create {
                    background-color: #007bff;
                    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
                }
                
                .nav-button.view {
                    background-color: #28a745;
                    box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
                }
                
                .nav-button.teams {
                    background-color: #ffc107;
                    color: #333; /* Darker text for yellow background */
                    box-shadow: 0 4px 6px rgba(255, 193, 7, 0.2);
                }

                .nav-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
                }
                
                .nav-button.create:hover {
                    background-color: #0056b3;
                }
                .nav-button.view:hover {
                    background-color: #1e7e34;
                }
                .nav-button.teams:hover {
                    background-color: #e0a800;
                }
            `}</style>
        </div>
    );
};

export default HostHome;