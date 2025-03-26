import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItemQuantity, removeFromCart } from '../../services/api';
import { CartItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCartItems([]);
                return;
            }
            try {
                const response = await getCart();
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
        fetchCart();
    }, [user]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handleQuantityChange = async (id: number, delta: number) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity < 1) return;
            try {
                await updateCartItemQuantity(id, newQuantity);
                setCartItems(cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                ));
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        }
    };

    const handleRemoveItem = async (id: number) => {
        try {
            await removeFromCart(id);
            setCartItems(cartItems.filter(item => item.id !== id));
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const totalPrice = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Пожалуйста, выберите товары для оформления.');
            return;
        }
        const selectedIds = selectedItems.join(',');
        navigate(`/order?items=${selectedIds}`);
    };

    return (
        <div className="cart-page">
            <div className="select-all-block">
                <label>
                    <input
                        type="checkbox"
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onChange={handleSelectAll}
                    />
                    Выбрать всё
                </label>
            </div>
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>Ваша корзина пуста или вы не авторизованы.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                                <img
                                    src={item.product.imageUrls.length > 0 ? item.product.imageUrls[0] : item.product.imageUrl}
                                    alt={item.product.name}
                                />
                                <div className="item-details">
                                    <h3>{item.product.name}</h3>
                                    <p>{item.product.description}</p>
                                    <p>Цена: {item.product.price} руб.</p>
                                    <div className="quantity">
                                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-summary">
                    <button onClick={handleCheckout} disabled={selectedItems.length === 0}>
                        Перейти к оформлению
                    </button>
                    <h2>Итого: {totalPrice} руб.</h2>
                </div>
            </div>
        </div>
    );
};

export default Cart;