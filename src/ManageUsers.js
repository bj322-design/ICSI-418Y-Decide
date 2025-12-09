import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
    // 1. Mock Data: This simulates your database
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 3, name: "Alice Johnson", email: "alice@tech.com", role: "Admin" },
        { id: 4, name: "Bob Wilson", email: "bob@network.com", role: "User" },
        { id: 5, name: "Charlie Brown", email: "charlie@school.edu", role: "User" },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // 2. Handle Search: Filter users based on name or email
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Handle Delete: Remove user from the state
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user? This cannot be undone.");
        if (confirmDelete) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    return (
        <div className="page-wrapper">
            <div className="admin-container">
                <div className="header-section">
                    <h1>Manage Users</h1>
                    <Link to="/AdminHome" className="back-link">← Back to Dashboard</Link>
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Users Table */}
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-results">No users found</td>
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
                    max-width: 800px;
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
                    color: #6f42c1;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #59359a; }

                .search-bar {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    box-sizing: border-box; /* Fixes padding width issues */
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .user-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px; /* Ensures table doesn't squash on small screens */
                }

                .user-table th, .user-table td {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }

                .user-table th {
                    background-color: #f8f9fa;
                    color: #555;
                    font-weight: 600;
                }

                .role-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .role-badge.admin { background-color: #e2e6ea; color: #333; }
                .role-badge.user { background-color: #e3f2fd; color: #0d6efd; }

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

export default ManageUsers;