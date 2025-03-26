package ru.kors.giftstore2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kors.giftstore2.repositories.CartItemRepository;
import ru.kors.giftstore2.repositories.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public void deleteProduct(Long productId) {
        cartItemRepository.deleteByProductId(productId); // Удаляем из корзины
        productRepository.deleteById(productId); // Удаляем товар (отзывы удалятся каскадно)
    }
}