import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getReviewsByProduct, getAverageRating, addToCart, toggleLikeReview, toggleDislikeReview, toggleHideReview, adminDeleteReview } from '../../services/api';
import { Product, ReviewDTO } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import RatingStars from './RatingStars';
import './ProductDetail.css';
import ReviewForm from './ReviewForm';
import { FaHeart } from 'react-icons/fa';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [allReviews, setAllReviews] = useState<ReviewDTO[]>([]);
    const [displayedReviews, setDisplayedReviews] = useState<ReviewDTO[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const reviewsPerPage = 3;

    const fetchProduct = useCallback(async () => {
        try {
            const response = await getProductById(Number(id));
            setProduct(response.data);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Ошибка при загрузке товара:', error);
        }
    }, [id]);

    const fetchAverageRating = useCallback(async () => {
        try {
            const response = await getAverageRating(Number(id));
            setAverageRating(response.data || 0);
        } catch (error) {
            console.error('Ошибка при загрузке средней оценки:', error);
            setAverageRating(0);
        }
    }, [id]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await getReviewsByProduct(Number(id), currentPage, reviewsPerPage);
            const newReviews = response.data.content;
            setTotalPages(response.data.totalPages);
            if (currentPage === 0) {
                setAllReviews(newReviews);
                setDisplayedReviews(user ? newReviews : newReviews.slice(0, 3));
            } else {
                setAllReviews(prev => [...prev, ...newReviews]);
                setDisplayedReviews(prev => user ? [...prev, ...newReviews] : newReviews.slice(0, 3));
            }
            await fetchAverageRating();
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        }
    }, [id, currentPage, user, fetchAverageRating]);

    useEffect(() => {
        fetchProduct();
        fetchAverageRating();
    }, [fetchProduct, fetchAverageRating]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleLoadMore = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину');
            return;
        }
        if (!product) {
            alert('Товар ещё не загружен');
            return;
        }
        try {
            await addToCart(product.id!, 1);
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000);
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Не удалось добавить товар в корзину');
        }
    };

    const handleReviewAdded = () => {
        setCurrentPage(0);
        setAllReviews([]);
        setDisplayedReviews([]);
        setExpandedReplies(new Set());
        fetchReviews();
    };

    const handleLike = async (reviewId: number) => {
        if (!user) {
            alert('Войдите, чтобы поставить лайк');
            return;
        }
        try {
            await toggleLikeReview(reviewId);
            fetchReviews();
        } catch (error) {
            console.error('Ошибка при постановке лайка:', error);
        }
    };

    const handleDislike = async (reviewId: number) => {
        if (!user) {
            alert('Войдите, чтобы поставить дизлайк');
            return;
        }
        try {
            await toggleDislikeReview(reviewId);
            fetchReviews();
        } catch (error) {
            console.error('Ошибка при постановке дизлайка:', error);
        }
    };

    const handleHide = async (reviewId: number) => {
        if (!user || user.role !== 'ADMIN') {
            alert('Только администратор может скрыть отзыв');
            return;
        }
        try {
            await toggleHideReview(reviewId);
            fetchReviews();
        } catch (error) {
            console.error('Ошибка при скрытии отзыва:', error);
        }
    };

    const handleAdminDelete = async (reviewId: number) => {
        if (!user || user.role !== 'ADMIN') {
            alert('Только администратор может удалить отзыв');
            return;
        }
        setDeleteConfirm(reviewId);
    };

    const confirmDelete = async () => {
        if (deleteConfirm === null) return;
        try {
            await adminDeleteReview(deleteConfirm);
            setDeleteConfirm(null);
            fetchReviews();
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const toggleReplies = (reviewId: number) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(reviewId)) {
            newExpanded.delete(reviewId);
        } else {
            newExpanded.add(reviewId);
        }
        setExpandedReplies(newExpanded);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const renderReview = (review: ReviewDTO, level: number = 0) => (
        <div key={review.id} className={`review-item ${level > 0 ? 'reply' : ''}`} style={{ marginLeft: `${level * 20}px` }}>
            {review.isHidden && user?.role !== 'ADMIN' ? (
                <p>[Переписка скрыта администратором]</p>
            ) : (
                <>
                    {review.user ? (
                        <p>
                            <Link to={`/user/${review.user.id}/reviews`}>
                                <img
                                    src={review.user.avatarUrl || '/default-avatar.png'}
                                    alt={review.user.fullName || 'User'}
                                    className="review-avatar"
                                />
                                <strong>{review.user.fullName || 'Без имени'}</strong>
                            </Link>
                            {review.isAdminResponse && <span className="admin-badge"> (Администратор)</span>}
                            <span> ★ </span> {review.rating}/5
                        </p>
                    ) : (
                        <p><strong>Аноним</strong> <span>★</span> {review.rating}/5</p>
                    )}
                    <p>{review.comment}</p>
                    <div className="review-actions">
                        <button onClick={() => handleLike(review.id)}>
                            👍 {review.likesCount} {review.likedByCurrentUser ? '(Вы)' : ''}
                        </button>
                        <button onClick={() => handleDislike(review.id)}>
                            👎 {review.dislikesCount} {review.dislikedByCurrentUser ? '(Вы)' : ''}
                        </button>
                        {user && (
                            <button onClick={() => setReplyTo(review.id)}>Ответить</button>
                        )}
                        {user?.role === 'ADMIN' && (
                            <>
                                <button onClick={() => handleHide(review.id)}>
                                    {review.isHidden ? 'Показать' : 'Скрыть'}
                                </button>
                                <button onClick={() => handleAdminDelete(review.id)}>Удалить</button>
                            </>
                        )}
                        {review.replies.length > 0 && (
                            <button onClick={() => toggleReplies(review.id)}>
                                {expandedReplies.has(review.id) ? 'Скрыть ответы' : `Показать ответы (${review.replies.length})`}
                            </button>
                        )}
                    </div>
                    {replyTo === review.id && (
                        <ReviewForm productId={product!.id!} parentReviewId={review.id} onReviewAdded={handleReviewAdded} />
                    )}
                    {expandedReplies.has(review.id) && review.replies.map(reply => renderReview(reply, level + 1))}
                </>
            )}
        </div>
    );

    if (!product) {
        return <div className="loading">Загрузка...</div>;
    }

    const hasMoreReviews = user && currentPage < totalPages - 1;
    const currentImage = product.imageUrls.length > 0 ? product.imageUrls[currentImageIndex] : product.imageUrl;

    return (
        <div className="product-detail">
            <div className="left-column">
                <div className="image-section">
                    <div className="thumbnails">
                        {product.imageUrls.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`thumbnail-${index}`}
                                className={index === currentImageIndex ? 'active' : ''}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={currentImage} alt={product.name} />
                    </div>
                </div>
            </div>
            <div className="right-column">
                <h1 className="product-title">{product.name}</h1>
                <div className="rating-reviews">
                    <RatingStars rating={averageRating} />
                    <span>{averageRating.toFixed(1)} ({allReviews.length} отзывов) • 68 вопросов</span>
                </div>
                <div className="original-badge">
                    <span>Оригинальный товар</span>
                </div>
                <div className="product-info">
                    <h3>О товаре</h3>
                    <p>{product.description}</p>
                </div>
                <div className="price-buy">
                    <div className="price">
                        <span className="current-price">{product.price} руб.</span>
                        <span className="old-price">{(product.price * 1.2).toFixed(0)} руб.</span>
                    </div>
                    <div className="buy-actions">
                        <button className="add-to-cart" onClick={handleAddToCart}>Добавить в корзину</button>
                        <FaHeart className="favorite-icon" />
                        <button className="buy-now">Купить в один клик</button>
                    </div>
                    <div className="delivery-info">
                        <p>Доставка: завтра</p>
                    </div>
                </div>
            </div>
            <div className="reviews-section">
                <h2>Отзывы о товаре</h2>
                {displayedReviews.length > 0 ? (
                    displayedReviews.map(review => renderReview(review))
                ) : (
                    <p>Отзывов пока нет.</p>
                )}
                {hasMoreReviews && (
                    <button className="load-more" onClick={handleLoadMore}>Показать еще</button>
                )}
            </div>
            {user && !replyTo && (
                <div className="add-review-section">
                    <h3>Оставить отзыв</h3>
                    <ReviewForm productId={product.id!} onReviewAdded={handleReviewAdded} />
                </div>
            )}
            {showModal && (
                <div className="modal">Товар добавлен в корзину</div>
            )}
            {deleteConfirm !== null && (
                <div className="delete-confirm-modal">
                    <div className="modal-content">
                        <p>Вы уверены, что хотите удалить этот отзыв?</p>
                        <button onClick={confirmDelete}>Да</button>
                        <button onClick={cancelDelete}>Нет</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;