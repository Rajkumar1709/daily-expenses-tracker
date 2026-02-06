import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/user');
                    setUser(res.data);
                } catch (err) {
                    console.error("Error loading user", err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Registration Error' };
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Login Error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
