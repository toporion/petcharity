import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar';
import FloatingChat from '../components/FloatingChat';
import { AuthContext } from '../authProvider/AuthProvider';

const Main = () => {
const {user}=useContext(AuthContext)

    return (
        <div>
            <MenuBar />
            <Outlet />
            <FloatingChat userId={user?._id} />
           
        </div>
    );
};

export default Main;
