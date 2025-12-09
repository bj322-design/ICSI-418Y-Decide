import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SettleDispute = () => {
    const [disputes, setDisputes] = useState([]);

    // 1. Fetch Disputes on Load
    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const response = await fetch('http://localhost:9000/getDisputes');
                const data = await response.json();
                setDisputes(data);
            } catch (error) {
                console.error("Error fetching disputes:", error);
            }
        };
        fetchDisputes();
    }, []);

    // 2. Resolve (Delete) Logic
    const handleResolve = async (id) => {
        const confirmResolve = window.confirm("Mark this dispute as settled? This will remove it from the list.");
        
        if (confirmResolve) {
            try {
                const response = await fetch(`http://localhost:9000/resolveDispute/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setDisputes(disputes.filter(d => d._id !== id));
                    alert("Dispute settled successfully.");
                } else {
                    alert("Failed to settle dispute.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Server error.");
            }
        }
    };

    // Helper for date formatting
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="page-wrapper">
            <div className="admin-container">
                <div className="header-section">
                    <h1>Settle Disputes</h1>
                    <Link to="/AdminHome" className="back-link">← Back to Dashboard</Link>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Reporter</th>
                                <th>Accused</th>
                                <th>Reason</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disputes.length > 0 ? (
                                disputes.map(dispute => (
                                    <tr key={dispute._id}>
                                        <td className="reporter-cell">@{dispute.reporter_username}</td>
                                        <td className="accused-cell">@{dispute.accused_username}</td>
                                        <td>{dispute.reason}</td>
                                        <td>{formatDate(dispute.date)}</td>
                                        <td>
                                            <button 
                                                className="resolve-btn"
                                                onClick={() => handleResolve(dispute._id)}
                                            >
                                                Mark Resolved
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">No active disputes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .page-wrapper {
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    padding: 2rem;
                    min-height: 100vh;
                }
                .admin-container {
                    background-color: #ffffff;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 900px;
                }
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                h1 {
                    color: #333;
                    font-size: 1.8rem;
                    margin: 0;
                }
                .back-link {
                    color: #fd7e14; /* Orange to match Home Button */
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #d96b11; }
                
                .table-responsive { overflow-x: auto; }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px;
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }
                .data-table th {
                    background-color: #f8f9fa;
                    color: #555;
                    font-weight: 600;
                }
                
                /* Specific styles for columns */
                .reporter-cell { color: #0d6efd; font-weight: 500; }
                .accused-cell { color: #dc3545; font-weight: 500; }

                .resolve-btn {
                    background-color: #20c997; /* Green for "Resolved" */
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }
                .resolve-btn:hover { background-color: #1aa179; }
                
                .no-results {
                    text-align: center;
                    color: #777;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
};

export default SettleDispute;