package ru.kors.giftstore2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}