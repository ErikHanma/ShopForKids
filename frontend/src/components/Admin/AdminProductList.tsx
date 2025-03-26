import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/api';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import './AdminProductList.css';

const AdminProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getProducts({ page: 0, size: 1000 });
            setProducts(response.data.content);
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="admin-product-list">
            <Link to="/admin/products/new">Добавить товар</Link>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id ?? Math.random()}>
                        <td>{product.id ?? 'N/A'}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                            <Link to={`/admin/products/edit/${product.id}`}>Редактировать</Link>
                            <button
                                onClick={() => product.id !== undefined && handleDelete(product.id)}
                                disabled={product.id === undefined}
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductList;