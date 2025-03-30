import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <ul>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/pets">Manage Pets</Link></li>
                <li><Link to="/admin/donations">Donations</Link></li>
                <li><Link to="/admin/adoptions">Adoptons</Link></li>
                <li><Link to="/admin/users">Users</Link></li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
