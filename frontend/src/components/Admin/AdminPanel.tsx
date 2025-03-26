import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminProductList from './AdminProductList';

const AdminPanel: React.FC = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'ADMIN') {
        return <div>Доступ запрещен</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Панель администратора</h1>
            <AdminProductList />
        </div>
    );
};

export default AdminPanel;