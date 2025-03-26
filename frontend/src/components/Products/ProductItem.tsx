import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addToCart } from '../../services/api';
import { Product } from '../../types';
import './ProductItem.css';

const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please log in to add items to your cart');
            return;
        }
        try {
            await addToCart(product.id, 1);
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Не удалось добавить товар в корзину');
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.imageUrls.length > 0 ? product.imageUrls[0] : product.imageUrl}
                alt={product.name}
                className="product-image"
            />
            <h3 className="product-name">
                <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price} руб.</p>
            <button className="buy-button" onClick={handleAddToCart}>Добавить в корзину</button>
            {showModal && (
                <div className="modal">
                    Товар добавлен в корзину
                </div>
            )}
        </div>
    );
};

export default ProductItem;