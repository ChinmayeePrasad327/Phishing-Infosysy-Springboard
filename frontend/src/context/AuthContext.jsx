import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        if (apiService.isAuthenticated()) {
            try {
                const userData = await apiService.getUserProfile();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                apiService.logout();
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (username, password) => {
        const data = await apiService.login(username, password);
        await fetchUser();
        return data;
    };

    const logout = () => {
        apiService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
