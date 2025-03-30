import React from 'react';
import logo from '../assets/logo1.png';
import { Link } from 'react-router-dom';
import UseAuth from '../hook/UseAuth';

const MenuBar = () => {
    const { user, isAuthenticated, signOut } = UseAuth();

    const userAvatar = user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

    const links = (
        <div className='flex gap-6'>
            <Link to="/"><li>Home</li></Link>
            <Link to="/services"><li>Services</li></Link>
            <Link to="/adoption"><li>Adoption</li></Link>
            <Link to="/donation"><li>Donation</li></Link>
        </div>
    );

    return (
        <div>
            <div className="navbar bg-base-200">
                {/* Navbar Start */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <img className="w-12" src={logo} alt="Logo" />
                </div>

                {/* Navbar Center */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">{links}</ul>
                </div>

                {/* Navbar End */}
                <div className="navbar-end">
                    {isAuthenticated ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="avatar btn btn-ghost btn-circle">
                                <div className="w-12 rounded-full">
                                    <img src={userAvatar} alt="User Avatar" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><button onClick={signOut}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuBar;
