import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../services/api';
import { Product } from '../../types';
import './AdminProductForm.css';

const AdminProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrls: []
    });

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                const response = await getProductById(Number(id));
                setProduct(response.data);
            };
            fetchProduct();
        }
    }, [id]);

    const handleAddImage = () => {
        setProduct({ ...product, imageUrls: [...product.imageUrls, ''] });
    };

    const handleRemoveImage = (index: number) => {
        const newImageUrls = product.imageUrls.filter((_, i) => i !== index);
        setProduct({ ...product, imageUrls: newImageUrls });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImageUrls = product.imageUrls.map((url, i) => (i === index ? value : url));
        setProduct({ ...product, imageUrls: newImageUrls });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                // Редактирование товара
                await updateProduct(Number(id), product);
            } else {
                // Создание нового товара
                await createProduct(product); // id уже undefined, так что все ок
            }
            navigate('/admin');
        } catch (error) {
            console.error('Ошибка при сохранении товара:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-product-form">
            <h2>{id ? 'Редактировать товар' : 'Добавить товар'}</h2>
            <div>
                <label>Название:</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={e => setProduct({ ...product, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Описание:</label>
                <textarea
                    value={product.description}
                    onChange={e => setProduct({ ...product, description: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Цена:</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                    required
                />
            </div>
            <div>
                <label>Категория:</label>
                <input
                    type="text"
                    value={product.category}
                    onChange={e => setProduct({ ...product, category: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Изображения:</label>
                {product.imageUrls.map((url, index) => (
                    <div key={index} className="image-input">
                        <input
                            type="text"
                            value={url}
                            onChange={e => handleImageChange(index, e.target.value)}
                            placeholder="URL изображения"
                        />
                        <button type="button" onClick={() => handleRemoveImage(index)}>Удалить</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddImage}>Добавить изображение</button>
            </div>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export default AdminProductForm;