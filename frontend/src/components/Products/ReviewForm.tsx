import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createReview } from '../../services/api';

interface ReviewFormProps {
    productId: number;
    parentReviewId?: number;
    onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, parentReviewId, onReviewAdded }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(parentReviewId ? 0 : 5); // Для ответов рейтинг необязателен
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            await createReview(productId, rating, comment, parentReviewId);
            onReviewAdded();
            setRating(parentReviewId ? 0 : 5);
            setComment('');
        } catch (error) {
            console.error('Ошибка при добавлении отзыва:', error);
            alert('Не удалось добавить отзыв');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {!parentReviewId && (
                <div>
                    <label>Оценка:</label>
                    <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <label>Комментарий:</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <button type="submit" disabled={submitting}>
                {submitting ? 'Отправка...' : parentReviewId ? 'Отправить ответ' : 'Оставить отзыв'}
            </button>
        </form>
    );
};

export default ReviewForm;