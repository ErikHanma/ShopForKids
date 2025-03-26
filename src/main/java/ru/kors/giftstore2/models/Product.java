package ru.kors.giftstore2.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<>(); // Список изображений

    // Поле для совместимости с существующим кодом
    @Transient
    private String imageUrl;

    public List<String> getImageUrls() {
        return imageUrls;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    // Геттер и сеттер для imageUrl (работает с первым элементом imageUrls)
    public String getImageUrl() {
        return imageUrls.isEmpty() ? null : imageUrls.get(0);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setImageUrl(String imageUrl) {
        if (imageUrls.isEmpty()) {
            imageUrls.add(imageUrl);
        } else {
            imageUrls.set(0, imageUrl);
        }
    }
}