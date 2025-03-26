package ru.kors.giftstore2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.UserRepository;
import ru.kors.giftstore2.security.JwtUtil;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public User register(String username, String password, String email) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole("USER");
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("User not found: " + username);
            throw new RuntimeException("Invalid credentials");
        }
        System.out.println("Provided password: " + password);
        System.out.println("Stored hashed password: " + user.getPassword());
        boolean matches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password matches: " + matches);
        if (matches) {
            return jwtUtil.generateToken(username);
        }
        throw new RuntimeException("Invalid credentials");
    }
}