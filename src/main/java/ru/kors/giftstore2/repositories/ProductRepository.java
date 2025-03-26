package ru.kors.giftstore2.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory(String category, Pageable pageable);
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
    Page<Product> findByCategoryAndPriceBetween(String category, Double minPrice, Double maxPrice, Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name);
}