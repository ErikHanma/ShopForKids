package ru.kors.giftstore2.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private UserDTO user;
    private int likesCount;
    private int dislikesCount;
    private boolean likedByCurrentUser;
    private boolean dislikedByCurrentUser;
    private Long parentReviewId;
    private List<ReviewDTO> replies = new ArrayList<>();
    private boolean isHidden;
    private boolean isAdminResponse;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    public int getDislikesCount() { return dislikesCount; }
    public void setDislikesCount(int dislikesCount) { this.dislikesCount = dislikesCount; }
    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
    public boolean isDislikedByCurrentUser() { return dislikedByCurrentUser; }
    public void setDislikedByCurrentUser(boolean dislikedByCurrentUser) { this.dislikedByCurrentUser = dislikedByCurrentUser; }
    public Long getParentReviewId() { return parentReviewId; }
    public void setParentReviewId(Long parentReviewId) { this.parentReviewId = parentReviewId; }
    public List<ReviewDTO> getReplies() { return replies; }
    public void setReplies(List<ReviewDTO> replies) { this.replies = replies; }
    public boolean isHidden() { return isHidden; }
    public void setHidden(boolean hidden) { this.isHidden = hidden; }
    public boolean isAdminResponse() { return isAdminResponse; }
    public void setAdminResponse(boolean adminResponse) { isAdminResponse = adminResponse; }

    @Data
    public static class UserDTO {
        private Long id;
        private String fullName;
        private String avatarUrl;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }
}