import React from 'react';
import UsersTable from '../components/UsersTable';

const AdminUsers = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <p>Manage user accounts and permissions.</p>
            <UsersTable/>
        </div>
    );
};

export default AdminUsers;
