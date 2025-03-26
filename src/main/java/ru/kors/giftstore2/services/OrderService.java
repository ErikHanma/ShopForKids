package ru.kors.giftstore2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kors.giftstore2.models.Cart;
import ru.kors.giftstore2.models.Order;
import ru.kors.giftstore2.models.OrderItem;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.OrderRepository;
import ru.kors.giftstore2.repositories.CartRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private CartRepository cartRepository;

    public Order createOrder(User user, String deliveryMethod, String paymentMethod, List<Long> selectedItems) {
        // Получаем товары из корзины, которые выбрал пользователь
        List<Cart> cartItems = cartService.getCart(user).stream()
                .filter(cart -> selectedItems.contains(cart.getId()))
                .toList();

        // Создаем заказ
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setDeliveryMethod(deliveryMethod);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setPaymentDeadline(LocalDateTime.now().plusMinutes(20)); // Таймер на 20 минут

        // Условный QR-код (в реальности — от платежной системы)
        order.setQrCodeUrl("https://example.com/qr-code/" + order.getId());

        // Считаем стоимость и добавляем товары в заказ
        double totalPrice = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (Cart cart : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cart.getProduct());
            item.setQuantity(cart.getQuantity());
            item.setPrice(cart.getProduct().getPrice());
            orderItems.add(item);
            totalPrice += cart.getProduct().getPrice() * cart.getQuantity();
        }
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        // Сохраняем заказ
        Order savedOrder = orderRepository.save(order);

        // Удаляем выбранные товары из корзины
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public void updatePaymentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentStatus(status);
        orderRepository.save(order);
    }
}