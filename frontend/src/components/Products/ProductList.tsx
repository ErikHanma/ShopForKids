import React, { useEffect, useState } from 'react';
import { getProducts, Page } from '../../services/api';
import ProductItem from './ProductItem';
import { Product } from '../../types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './ProductList.css';
import ReactPaginate from 'react-paginate';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async (page: number) => {
        try {
            const filters = {
                category: selectedCategory || undefined,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                page: page,
                size: 8,
            };
            const response = await getProducts(filters);
            const data: Page<Product> = response.data;
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [selectedCategory, priceRange, currentPage]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getProducts({ page: 0, size: 1000 });
                const data: Page<Product> = response.data;
                const allProducts: Product[] = data.content;
                if (allProducts && allProducts.length > 0) {
                    const uniqueCategories = Array.from(
                        new Set(
                            allProducts
                                .map(product => product.category)
                                .filter(category => category != null)
                        )
                    ) as string[];
                    setCategories(uniqueCategories);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handlePriceChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            setPriceRange([value[0], value[1]]);
            setCurrentPage(0);
        }
    };

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    return (
        <div className="product-list-page">
            <div className="filters">
                <h3>Фильтры</h3>
                <div className="filter-section">
                    <h4>Цена</h4>
                    <Slider
                        range
                        min={0}
                        max={10000}
                        value={priceRange}
                        onChange={handlePriceChange}
                    />
                    <p>От {priceRange[0]} до {priceRange[1]} руб.</p>
                </div>
                <div className="filter-section">
                    <h4>Категория</h4>
                    <select
                        value={selectedCategory || ''}
                        onChange={e => {
                            setSelectedCategory(e.target.value || null);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="">Все категории</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="products">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))
                ) : (
                    <p>Нет товаров</p>
                )}
            </div>
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default ProductList;