package ru.kors.giftstore2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kors.giftstore2.models.Order;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.services.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(
            @AuthenticationPrincipal User user,
            @RequestParam String deliveryMethod,
            @RequestParam String paymentMethod,
            @RequestParam List<Long> selectedItems
    ) {
        return orderService.createOrder(user, deliveryMethod, paymentMethod, selectedItems);
    }

    @PostMapping("/{id}/payment")
    public void updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updatePaymentStatus(id, status);
    }
}