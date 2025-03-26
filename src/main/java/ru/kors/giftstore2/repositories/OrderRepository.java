package ru.kors.giftstore2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId); // Для получения заказов конкретного пользователя
}
