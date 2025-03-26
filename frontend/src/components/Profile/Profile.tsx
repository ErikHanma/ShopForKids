// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile, uploadAvatar } from '../../services/api';
import './Profile.css';
import {Link} from "react-router-dom";

const Profile: React.FC = () => {
    const { user, logout, refreshUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const response = await getProfile();
                setFullName(response.data.fullName || '');
                setPhone(response.data.phone || '');
                setBirthDate(response.data.birthDate || '');
                setAvatarPreview(response.data.avatarUrl || null);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            const updatedData = { fullName, phone, birthDate };
            await updateProfile(updatedData);
            await refreshUser(); // Обновляем данные в контексте
            alert('Профиль обновлён');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Ошибка обновления профиля');
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatar) return;
        try {
            const response = await uploadAvatar(avatar);
            setAvatarPreview(response.data);
            await refreshUser(); // Обновляем данные в контексте
            alert('Аватарка загружена');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Ошибка загрузки аватарки');
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    if (!user) {
        return <p>Вы не авторизованы.</p>;
    }

    return (
        <div className="profile-page">
            <h1>Профиль пользователя</h1>
            <div className="profile-content">
                <div className="profile-section">
                    <h2>Аватарка</h2>
                    <div className="avatar-block">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Аватарка" className="avatar-img" />
                        ) : (
                            <div className="avatar-placeholder">Нет аватарки</div>
                        )}
                        <input type="file" accept="image/*" onChange={handleAvatarChange} />
                        <button onClick={handleUploadAvatar}>Загрузить аватарку</button>
                    </div>
                </div>
                <div className="profile-section">
                    <h2>Личные данные</h2>
                    <div className="profile-form">
                        <label>
                            ФИО:
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                            />
                        </label>
                        <label>
                            Телефон:
                            <input
                                type="text"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </label>
                        <label>
                            Дата рождения:
                            <input
                                type="date"
                                value={birthDate}
                                onChange={e => setBirthDate(e.target.value)}
                            />
                        </label>
                        <button onClick={handleUpdateProfile}>Сохранить изменения</button>
                    </div>
                </div>
                <div className="profile-section">
                    <h2>Публичные данные</h2>
                    <p className="disclaimer">
                        Информация, которую вы укажете в этом разделе, публичная. Она указывается рядом с отзывами и видна другим пользователям сети Интернет. Размещая свои персональные данные в данном разделе, вы раскрываете их неопределенному кругу лиц.
                    </p>
                </div>

            </div>
            <button onClick={logout}>Выйти</button>
        </div>
    );
};

export default Profile;