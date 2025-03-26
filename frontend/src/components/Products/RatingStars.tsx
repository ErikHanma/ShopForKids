// src/components/Products/RatingStars.tsx
import React from 'react';
import './RatingStars.css';

interface RatingStarsProps {
    rating: number; // Средняя оценка товара
    maxRating?: number; // Максимальная оценка (по умолчанию 5)
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5 }) => {
    const fullStars = Math.floor(rating); // Количество полных звёзд
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Есть ли полузвезда
    const emptyStars = maxRating - fullStars - halfStar; // Количество пустых звёзд

    return (
        <div className="rating-stars">
            {Array(fullStars)
                .fill(0)
                .map((_, index) => (
                    <span key={`full-${index}`} className="star full">
                        ★
                    </span>
                ))}
            {halfStar === 1 && (
                <span className="star half">★</span>
            )}
            {Array(emptyStars)
                .fill(0)
                .map((_, index) => (
                    <span key={`empty-${index}`} className="star empty">
                        ☆
                    </span>
                ))}
        </div>
    );
};

export default RatingStars;