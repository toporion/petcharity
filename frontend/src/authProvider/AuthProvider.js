import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/login', { email, password });

            if (res.data.success) {
                const token = res.data.jwtToken;
                console.log("Received Token:", token);  // ✅ Check if token is received

                if (token) {
                    localStorage.setItem('token', token);
                    const decodedUser = jwtDecode(token);
                    console.log("Decoded User:", decodedUser);  // ✅ Check if user is decoded correctly
                    setUser(decodedUser);
                    setIsAuthenticated(true);
                }
                return res;
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Stored Token:", token);  // ✅ Debugging: Check if token exists

        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                console.log("Decoded User from Storage:", decodedUser);  // ✅ Debugging: Check if user is correctly decoded
                setUser(decodedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const authInfo = { user, loading, isAuthenticated, loginUser, signOut };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
