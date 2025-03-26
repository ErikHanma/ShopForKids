package ru.kors.giftstore2.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.Cart;
import ru.kors.giftstore2.models.User;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId); // Для получения корзины конкретного пользователя

    List<Cart> findByUser(User user);
    Optional<Cart> findByIdAndUser(Long id, User user);
}
