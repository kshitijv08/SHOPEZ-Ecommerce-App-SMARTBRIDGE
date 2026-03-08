import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('shopez_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const { data } = await API.get('/auth/me');
                    setUser(data);
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('shopez_token', data.token);
        localStorage.setItem('shopez_user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (formData) => {
        const { data } = await API.post('/auth/register', formData);
        localStorage.setItem('shopez_token', data.token);
        localStorage.setItem('shopez_user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('shopez_token');
        localStorage.removeItem('shopez_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
