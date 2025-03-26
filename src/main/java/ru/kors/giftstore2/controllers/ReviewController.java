package ru.kors.giftstore2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.kors.giftstore2.dto.ReviewDTO;
import ru.kors.giftstore2.models.Review;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.UserRepository;
import ru.kors.giftstore2.services.ReviewService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        Review savedReview = reviewService.addReview(review, user);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    public Page<ReviewDTO> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        Page<Review> reviews = reviewService.getReviewsByProduct(productId, page, size);
        Long currentUserId = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).getId() : null;
        List<ReviewDTO> reviewDTOs = reviews.getContent().stream()
                .map(review -> convertToDTO(review, currentUserId))
                .collect(Collectors.toList());
        return new PageImpl<>(reviewDTOs, PageRequest.of(page, size), reviews.getTotalElements());
    }

    private ReviewDTO convertToDTO(Review review, Long currentUserId) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        if (review.getUser() != null) {
            ReviewDTO.UserDTO userDTO = new ReviewDTO.UserDTO();
            userDTO.setId(review.getUser().getId());
            userDTO.setFullName(review.getUser().getFullName());
            userDTO.setAvatarUrl(review.getUser().getAvatarUrl());
            dto.setUser(userDTO);
        }
        dto.setLikesCount(review.getLikes().size());
        dto.setDislikesCount(review.getDislikes().size());
        dto.setLikedByCurrentUser(currentUserId != null && review.getLikes().contains(currentUserId));
        dto.setDislikedByCurrentUser(currentUserId != null && review.getDislikes().contains(currentUserId));
        if (review.getParentReview() != null) {
            dto.setParentReviewId(review.getParentReview().getId());
        }
        dto.setReplies(review.getReplies().stream()
                .map(reply -> convertToDTO(reply, currentUserId))
                .collect(Collectors.toList()));
        dto.setHidden(review.isHidden());
        dto.setAdminResponse(review.getUser() != null && "ADMIN".equals(review.getUser().getRole()));
        return dto;
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id, @AuthenticationPrincipal User user) {
        reviewService.deleteReview(id, user);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> adminDeleteReview(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByUsername(userDetails.getUsername());
        reviewService.adminDeleteReview(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/average/{productId}")
    public double getAverageRating(@PathVariable Long productId) {
        Page<Review> reviews = reviewService.getReviewsByProduct(productId, 0, Integer.MAX_VALUE);
        if (reviews.isEmpty()) return 0.0;
        return reviews.getContent().stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Review> toggleLike(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        User user = userRepository.findByUsername(userDetails.getUsername());
        Review updatedReview = reviewService.toggleLike(id, user);
        return ResponseEntity.ok(updatedReview);
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<Review> toggleDislike(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        User user = userRepository.findByUsername(userDetails.getUsername());
        Review updatedReview = reviewService.toggleDislike(id, user);
        return ResponseEntity.ok(updatedReview);
    }

    @PostMapping("/{id}/hide")
    public ResponseEntity<Review> toggleHide(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        User user = userRepository.findByUsername(userDetails.getUsername());
        Review updatedReview = reviewService.toggleHide(id, user);
        return ResponseEntity.ok(updatedReview);
    }
}