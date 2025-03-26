package ru.kors.giftstore2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kors.giftstore2.models.Cart;
import ru.kors.giftstore2.models.Product;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.ProductRepository;
import ru.kors.giftstore2.repositories.UserRepository;
import ru.kors.giftstore2.services.CartService;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Пользователь не найден");
        }
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Продукт не найден"));
        Cart cart = cartService.addToCart(user, product, request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getCart(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Пользователь не найден");
        }
        List<Cart> cartItems = cartService.getCart(user);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Cart> updateCartItemQuantity(@PathVariable Long id, @RequestBody UpdateQuantityRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Пользователь не найден");
        }
        Cart cart = cartService.updateQuantity(id, request.getQuantity(), user);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Пользователь не найден");
        }
        cartService.removeFromCart(id, user);
        return ResponseEntity.ok().build();
    }
}

class CartRequest {
    private Long productId;
    private int quantity;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}

class UpdateQuantityRequest {
    private int quantity;

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}