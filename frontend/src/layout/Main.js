import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar';


const Main = () => {
    return (
        <div>
         <MenuBar/>
            <Outlet/>
        </div>
    );
};

export default Main;