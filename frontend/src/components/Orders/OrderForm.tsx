import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCart, createOrder, updatePaymentStatus } from '../../services/api';
import { CartItem, Order } from '../../types';
import './OrderForm.css';

const OrderForm: React.FC = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [paymentMethod, setPaymentMethod] = useState('sbp');
    const [address, setAddress] = useState('');
    const [leaveAtDoor, setLeaveAtDoor] = useState(false);
    const [doNotCall, setDoNotCall] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCart();
                const allItems = response.data;
                const selectedIds = new URLSearchParams(location.search)
                    .get('items')
                    ?.split(',')
                    .map(Number) || [];
                setSelectedItems(selectedIds);
                const filteredItems = allItems.filter(item => selectedIds.includes(item.id));
                setCartItems(filteredItems);
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
            }
        };
        fetchCart();
    }, [location.search]);

    const handleSubmit = async () => {
        if (!user) {
            alert('Пожалуйста, войдите в систему.');
            navigate('/login');
            return;
        }

        try {
            const response = await createOrder(deliveryMethod, paymentMethod, selectedItems);
            setOrder(response.data);
            const deadline = new Date(response.data.paymentDeadline).getTime();
            const now = new Date().getTime();
            setTimeLeft(Math.floor((deadline - now) / 1000));
        } catch (error: any) {
            if (error.response?.status === 403) {
                alert('Ошибка: у вас нет доступа. Пожалуйста, войдите в систему.');
                navigate('/login');
            } else {
                console.error('Ошибка создания заказа:', error);
                alert('Не удалось создать заказ. Попробуйте позже.');
            }
        }
    };

    const handlePaymentComplete = async () => {
        if (order) {
            await updatePaymentStatus(order.id, 'PAID');
            alert('Заказ оформлен');
            navigate('/cart');
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && order) {
            updatePaymentStatus(order.id, 'FAILED');
            alert('Время оплаты истекло');
            navigate('/cart');
        }
    }, [timeLeft, order]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="order-form-wrapper">
            {!order ? (
                <>
                    <h1>Оформление</h1>

                    <div className="main-content">
                        <div className="left-column">
                            <section className="delivery-section">
                                <h2>Способ доставки</h2>
                                <div className="delivery-options">
                                    <div className={`delivery-card ${deliveryMethod === 'pickup' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="pickup"
                                            name="delivery"
                                            value="pickup"
                                            checked={deliveryMethod === 'pickup'}
                                            onChange={() => setDeliveryMethod('pickup')}
                                        />
                                        <label htmlFor="pickup">Пункт выдачи <small>от 0 ₽</small></label>
                                        <span className="delivery-check">✔</span>
                                    </div>
                                    <div className={`delivery-card ${deliveryMethod === 'courier' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="courier"
                                            name="delivery"
                                            value="courier"
                                            checked={deliveryMethod === 'courier'}
                                            onChange={() => setDeliveryMethod('courier')}
                                        />
                                        <label htmlFor="courier">Курьер</label>
                                        <span className="delivery-check">✔</span>
                                    </div>
                                </div>
                                <div className="delivery-settings">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={leaveAtDoor}
                                            onChange={() => setLeaveAtDoor(!leaveAtDoor)}
                                        /> Оставить у двери
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={doNotCall}
                                            onChange={() => setDoNotCall(!doNotCall)}
                                        /> Не звонить
                                    </label>
                                </div>
                                <div className="address-block">
                                    <small>Укажите адрес</small>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Введите адрес доставки"
                                    />
                                    <p>{user?.fullName}, {user?.phone} <span className="arrow">➡️</span></p>
                                </div>
                            </section>

                            <section className="order-details">
                                <h2>Детали заказа</h2>
                                {cartItems.length === 0 ? (
                                    <p>Выберите товары в корзине для оформления заказа.</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-quantity">{item.quantity}</div>
                                            <div className="item-info">
                                                <img src={item.product.imageUrls[0]} alt={item.product.name} />
                                                <p>{item.product.name}</p>
                                                <strong>{item.product.price} ₽</strong>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </section>
                        </div>

                        <div className="right-column">
                            <section className="order-summary">
                                <h2>Детали заказа</h2>
                                <p>Товары: {totalPrice} ₽</p>
                                <p>Доставка: 20 ₽</p>
                                <div className="promo-code">
                                    <input type="text" placeholder="Промокод" />
                                </div>
                                <p>Оплата онлайн: {paymentMethod === 'sbp' ? 'СБП' : 'Карта'}</p>
                                <strong>Итого: {totalPrice + 20} ₽</strong>
                            </section>
                            <section className="payment-section">
                                <h2>Способ оплаты</h2>
                                <div className="payment-options">
                                    <button
                                        className={paymentMethod === 'sbp' ? 'active' : ''}
                                        onClick={() => setPaymentMethod('sbp')}
                                    >
                                        СБП
                                    </button>
                                    <button
                                        className={paymentMethod === 'card' ? 'active' : ''}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        Карта
                                    </button>
                                </div>
                            </section>
                            <button className="order-button" onClick={handleSubmit} disabled={cartItems.length === 0}>
                                Оформить заказ
                            </button>
                        </div>
                    </div>

                    <footer className="order-footer">
                        <p>Нажимая «Оформить заказ», вы соглашаетесь с условиями использования сервиса.</p>
                        <a href="#">Условия доставки и возврата</a> | <a href="#">О товаре и продавце</a>
                    </footer>
                </>
            ) : (
                <div className="payment-window">
                    <h2>Оплата заказа</h2>
                    <img src={order.qrCodeUrl} alt="QR-код для оплаты" />
                    <p>
                        Осталось времени: {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                    <button onClick={handlePaymentComplete}>Готово (тест)</button>
                </div>
            )}
        </div>
    );
};

export default OrderForm;