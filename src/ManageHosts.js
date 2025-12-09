import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageHosts = () => {
    const [hosts, setHosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch Hosts from Backend on Load
    useEffect(() => {
        const fetchHosts = async () => {
            try {
                const response = await fetch('http://localhost:9000/getHosts');
                const data = await response.json();
                setHosts(data);
            } catch (error) {
                console.error("Error fetching hosts:", error);
            }
        };
        fetchHosts();
    }, []);

    // 2. Filter Logic (Search by Org Name or Username)
    const filteredHosts = hosts.filter(host =>
        (host.org_name && host.org_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (host.username && host.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 3. Delete Logic
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Host?");
        
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:9000/deleteHost/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setHosts(hosts.filter(host => host._id !== id));
                    alert("Host deleted successfully");
                } else {
                    alert("Failed to delete host.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Could not connect to server.");
            }
        }
    };

    return (
        <div className="page-wrapper">
            <div className="admin-container">
                <div className="header-section">
                    <h1>Manage Hosts</h1>
                    <Link to="/AdminHome" className="back-link">← Back to Dashboard</Link>
                </div>

                <input
                    type="text"
                    placeholder="Search by Organization or Username..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Organization</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHosts.length > 0 ? (
                                filteredHosts.map(host => (
                                    <tr key={host._id}>
                                        <td className="org-cell">{host.org_name || 'N/A'}</td>
                                        <td>{host.username}</td>
                                        <td>{host.email}</td>
                                        <td>{host.phone || 'N/A'}</td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(host._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">No hosts found</td>
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
                    color: #0d6efd; /* Blue to match Host Button */
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #0b5ed7; }
                
                .search-bar {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    box-sizing: border-box;
                }
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
                .org-cell {
                    font-weight: 600;
                    color: #0d6efd;
                }
                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .delete-btn:hover { background-color: #bb2d3b; }
                .no-results {
                    text-align: center;
                    color: #777;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
};

export default ManageHosts;