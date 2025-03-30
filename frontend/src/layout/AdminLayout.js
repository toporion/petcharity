import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';


const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="p-4 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
