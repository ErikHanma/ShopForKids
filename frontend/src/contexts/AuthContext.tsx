import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getProfile } from '../services/api';

interface User {
    username: string;
    email: string;
    role: string;
    avatarUrl?: string;
    fullName?: string;
    phone?: string;
    birthDate?: string;
}

interface AuthContextType {
    user: User | null;
    register: (username: string, password: string, email: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const register = async (username: string, password: string, email: string) => {
        try {
            const response = await api.post('/api/auth/register', { username, password, email });
            if (response.status === 200) {
                // После успешной регистрации сразу обновляем данные пользователя
                await refreshUser();
            }
        } catch (error) {
            console.error('Error: Registration failed', error);
            throw new Error('Registration failed');
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/api/auth/login', { username, password });
            console.log('Login response:', response.data);
            await refreshUser();
        } catch (error: any) {
            console.error('Error details:', error.response?.data);
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        api.post('/api/auth/logout', {}, { withCredentials: true });
        deleteCookie('jwt');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null); // Если профиль не удалось загрузить, сбрасываем пользователя
        }
    };

    // Проверяем авторизацию при загрузке приложения
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};