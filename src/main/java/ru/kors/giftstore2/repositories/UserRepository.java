package ru.kors.giftstore2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kors.giftstore2.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
