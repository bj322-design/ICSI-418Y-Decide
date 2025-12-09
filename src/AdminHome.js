import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
    return (
        <div className="page-wrapper">
            <div className="home-container">
                <h1>Welcome to the Admin Dashboard</h1>
                <p className="subtitle">System Overview and Controls</p>

                <div className="button-group">
                    <Link to="/ManageUsers" className="nav-button admin-users">
                        Manage Users
                    </Link>

                    <Link to="/ManageHosts" className="nav-button admin-hosts">
                        Manage Hosts
                    </Link>

                    <Link to="/ManageEvents" className="nav-button admin-events">
                        Manage Events
                    </Link>

                    <Link to="/SettleDispute" className="nav-button admin-dispute">
                        Settle Disputes
                    </Link>

                    <Link to="/" className="nav-button logout">
                        Log Out
                    </Link>
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
                    color: white;
                }
                
                .nav-button.admin-users {
                    background-color: #6f42c1;
                    box-shadow: 0 4px 6px rgba(111, 66, 193, 0.2);
                }
                
                .nav-button.admin-hosts {
                    background-color: #0d6efd; 
                    box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
                }
                
                .nav-button.admin-events {
                    background-color: #20c997;
                    box-shadow: 0 4px 6px rgba(32, 201, 151, 0.2);
                }
                
                .nav-button.admin-dispute {
                    background-color: #fd7e14; /* Orange color */
                    box-shadow: 0 4px 6px rgba(253, 126, 20, 0.2);
                }
                
                .nav-button.logout {
                    background-color: #6c757d; 
                    box-shadow: 0 4px 6px rgba(108, 117, 125, 0.2);
                    padding: 0.5rem 1rem; 
                    font-size: 0.9rem;    
                    width: 50%;          
                    align-self: center; 
                }

                .nav-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
                }
                
                .nav-button.admin-users:hover {
                    background-color: #59359a;
                }
                .nav-button.admin-hosts:hover {
                    background-color: #0b5ed7;
                }
                .nav-button.admin-events:hover {
                    background-color: #1aa179;
                }
                .nav-button.admin-dispute:hover {
                    background-color: #d96b11;
                }
                .nav-button.logout:hover {
                    background-color: #5a6268;  
                }
            `}</style>
        </div>
    );
};

export default AdminHome;