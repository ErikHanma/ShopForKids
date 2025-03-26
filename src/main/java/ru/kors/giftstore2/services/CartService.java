package ru.kors.giftstore2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kors.giftstore2.models.Cart;
import ru.kors.giftstore2.models.Product;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.CartRepository;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public Cart addToCart(User user, Product product, int quantity) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public List<Cart> getCart(User user) {
        return cartRepository.findByUser(user);
    }

    public Cart updateQuantity(Long id, int quantity, User user) {
        Cart cart = cartRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Элемент корзины не найден"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void removeFromCart(Long id, User user) {
        Cart cart = cartRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Элемент корзины не найден"));
        cartRepository.delete(cart);
    }
}