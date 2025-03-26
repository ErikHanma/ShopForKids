package ru.kors.giftstore2.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductId(Long productId, Pageable pageable);
    List<Review> findByUserId(Long userId);
    Page<Review> findByProductIdAndParentReviewIsNull(Long productId, Pageable pageable); // Только корневые отзывы
}