import axios from 'axios';
import { CartItem, Order, Product, User, Review, ReviewDTO } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}

export const getProducts = (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    return api.get<Page<Product>>('/api/products', { params });
};

export const getProductById = (id: number) => api.get<Product>(`/api/products/${id}`);

export const getReviewsByProduct = (productId: number, page: number = 0, size: number = 3) =>
    api.get<Page<ReviewDTO>>(`/api/reviews/product/${productId}?page=${page}&size=${size}`);

export const getReviewsByUser = (userId: number) => api.get<Review[]>(`/api/reviews/user/${userId}`);

export const getAverageRating = (productId: number) => api.get<number>(`/api/reviews/average/${productId}`);

export const addToCart = (productId: number, quantity: number) =>
    api.post('/api/cart/add', { productId, quantity });

export const getCart = () => api.get<CartItem[]>('/api/cart');

export const updateCartItemQuantity = (cartItemId: number, quantity: number) =>
    api.put(`/api/cart/update/${cartItemId}`, { quantity });

export const removeFromCart = (cartItemId: number) =>
    api.delete(`/api/cart/remove/${cartItemId}`);

export const createOrder = (deliveryMethod: string, paymentMethod: string, selectedItems: number[]) =>
    api.post<Order>('/api/orders', null, {
        params: { deliveryMethod, paymentMethod, selectedItems }
    });

export const updatePaymentStatus = (orderId: number, status: string) =>
    api.post(`/api/orders/${orderId}/payment`, null, { params: { status } });

export const getOrders = () => api.get<Order[]>('/api/orders');

export const getProfile = () => api.get<User>('/api/profile');

export const updateProfile = (data: { fullName?: string; phone?: string; birthDate?: string }) =>
    api.put<User>('/api/profile', data);

export const uploadAvatar = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<string>('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const createReview = (productId: number, rating: number, comment: string, parentReviewId?: number) =>
    api.post<Review>('/api/reviews', { product: { id: productId }, rating, comment, parentReview: parentReviewId ? { id: parentReviewId } : null });

export const toggleLikeReview = (reviewId: number) => api.post<Review>(`/api/reviews/${reviewId}/like`);

export const toggleDislikeReview = (reviewId: number) => api.post<Review>(`/api/reviews/${reviewId}/dislike`);

export const toggleHideReview = (reviewId: number) => api.post<Review>(`/api/reviews/${reviewId}/hide`);

export const adminDeleteReview = (reviewId: number) => api.delete(`/api/reviews/admin/${reviewId}`);

export const createProduct = (product: Product) => api.post<Product>('/api/products', product);
export const updateProduct = (id: number, product: Product) => api.put<Product>(`/api/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/api/products/${id}`);