import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { Product } from '../types';
import { FaSearch, FaUser, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTh } from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getSuggestions = async (inputValue: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/search?query=${inputValue}`);
            return response.data as Product[];
        } catch (error) {
            console.error('Ошибка поиска:', error);
            return [];
        }
    };

    const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
        const suggestions = await getSuggestions(value);
        setSuggestions(suggestions);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) => {
        setValue(newValue);
    };

    const onSuggestionSelected = (
        event: React.FormEvent<HTMLElement>,
        { suggestion }: { suggestion: Product }
    ) => {
        if (suggestion.id) {
            navigate(`/products/${suggestion.id}`);
            setValue('');
            setSuggestions([]);
        }
    };

    const renderSuggestion = (suggestion: Product) => (
        <div>{suggestion.name}</div>
    );

    const inputProps: Autosuggest.InputProps<Product> = {
        placeholder: 'Искать в GiftStore...',
        value,
        onChange,
    };

    return (
        <header className="header">
            <div className="container">
                <NavLink to="/" className="logo">
                    GiftStore
                </NavLink>
                <NavLink to="/products" className="catalog-btn">
                    <FaTh className="catalog-icon" />
                    Каталог
                </NavLink>
                <div className="search-container">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={(suggestion: Product) => suggestion.name}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        onSuggestionSelected={onSuggestionSelected}
                    />
                    <button className="search-btn">
                        <FaSearch />
                    </button>
                </div>
                <nav className="nav">
                    <ul className="nav-list">
                        {user ? (
                            <>
                                <li>
                                    <NavLink to="/profile" className="nav-icon">
                                        <FaUser />
                                        <span>Профиль</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/cart" className="nav-icon">
                                        <FaShoppingCart />
                                        <span>Корзина</span>
                                    </NavLink>
                                </li>
                                {user.role === 'ADMIN' && (
                                    <li>
                                        <NavLink to="/admin" className="nav-icon">
                                            <FaUser />
                                            <span>Админ</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <button onClick={handleLogout} className="nav-icon logout-btn">
                                        <FaSignOutAlt />
                                        <span>Выход</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/login" className="nav-icon">
                                        <FaSignInAlt />
                                        <span>Вход</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/register" className="nav-icon">
                                        <FaUser />
                                        <span>Регистрация</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;