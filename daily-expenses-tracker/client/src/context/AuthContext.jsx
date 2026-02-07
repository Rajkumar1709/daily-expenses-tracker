import { createContext, useState, useEffect } from 'react';
import StorageService from '../services/StorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('expense_tracker_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            if (StorageService.isAuthenticated()) {
                const storedUser = StorageService.getUser();
                setUser(storedUser);
                setToken('offline-session-token');
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (userData) => {
        // In offline mode, register simply saves the user locally
        const newUser = {
            name: userData.name,
            email: userData.email,
            id: 'local-user-' + Date.now()
        };

        StorageService.saveUser(newUser);

        setUser(newUser);
        setToken('offline-session-token');
        return { success: true };
    };

    const login = async (userData) => {
        // Simplified offline login: matches email if user exists
        const storedUser = StorageService.getUser();

        if (storedUser && storedUser.email === userData.email) {
            // Re-establish session
            StorageService.saveUser(storedUser);
            setUser(storedUser);
            setToken('offline-session-token');
            return { success: true };
        } else if (!storedUser) {
            // Allow "login" to act as register if no user found locally (optional UX choice)
            // But for now, returning error to encourage registration
            return { success: false, msg: 'No local account found. Please Register.' };
        }

        // Security Note: Offline apps typically don't hash passwords securely 
        // unless using advanced crypto libraries. We assume device security.
        return { success: false, msg: 'Invalid credentials' };
    };

    const logout = () => {
        StorageService.clearSession();
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
