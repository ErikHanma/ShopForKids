package ru.kors.giftstore2.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    @ManyToOne
    private User user;

    private Integer rating; // 1-5
    private String comment;

    @ElementCollection
    private Set<Long> likes = new HashSet<>(); // IDs пользователей, поставивших лайк

    @ElementCollection
    private Set<Long> dislikes = new HashSet<>(); // IDs пользователей, поставивших дизлайк

    @ManyToOne
    @JoinColumn(name = "parent_review_id")
    private Review parentReview; // Родительский отзыв для ответов

    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> replies = new ArrayList<>(); // Список ответов

    private boolean isHidden = false; // Флаг скрытия переписки

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Set<Long> getLikes() { return likes; }
    public void setLikes(Set<Long> likes) { this.likes = likes; }
    public Set<Long> getDislikes() { return dislikes; }
    public void setDislikes(Set<Long> dislikes) { this.dislikes = dislikes; }
    public Review getParentReview() { return parentReview; }
    public void setParentReview(Review parentReview) { this.parentReview = parentReview; }
    public List<Review> getReplies() { return replies; }
    public void setReplies(List<Review> replies) { this.replies = replies; }
    public boolean isHidden() { return isHidden; }
    public void setHidden(boolean hidden) { isHidden = hidden; }
}