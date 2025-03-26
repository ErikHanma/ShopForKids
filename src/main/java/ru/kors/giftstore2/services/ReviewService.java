package ru.kors.giftstore2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.kors.giftstore2.models.Review;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.ReviewRepository;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review, User user) {
        review.setUser(user);
        if (review.getParentReview() != null) {
            Review parent = reviewRepository.findById(review.getParentReview().getId())
                    .orElseThrow(() -> new RuntimeException("Parent review not found"));
            review.setParentReview(parent);
            review.setProduct(parent.getProduct());
        }
        return reviewRepository.save(review);
    }

    public Page<Review> getReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findByProductIdAndParentReviewIsNull(productId, pageable);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public void deleteReview(Long id, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new RuntimeException("You can only delete your own reviews or be an admin");
        }
        reviewRepository.deleteById(id);
    }

    public void adminDeleteReview(Long id, User user) {
        if (!user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Only admins can delete any review");
        }
        reviewRepository.deleteById(id);
    }

    public Review toggleLike(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (review.getLikes().contains(user.getId())) {
            review.getLikes().remove(user.getId()); // Убираем лайк
        } else {
            review.getLikes().add(user.getId()); // Добавляем лайк
            review.getDislikes().remove(user.getId()); // Убираем дизлайк, если был
        }
        return reviewRepository.save(review);
    }

    public Review toggleDislike(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (review.getDislikes().contains(user.getId())) {
            review.getDislikes().remove(user.getId()); // Убираем дизлайк
        } else {
            review.getDislikes().add(user.getId()); // Добавляем дизлайк
            review.getLikes().remove(user.getId()); // Убираем лайк, если был
        }
        return reviewRepository.save(review);
    }

    public Review toggleHide(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Only admins can hide reviews");
        }
        review.setHidden(!review.isHidden());
        return reviewRepository.save(review);
    }
}