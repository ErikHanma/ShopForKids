package ru.kors.giftstore2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.kors.giftstore2.models.User;
import ru.kors.giftstore2.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // Получение данных профиля
    @GetMapping
    public ResponseEntity<User> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(user);
    }

    // Обновление данных профиля
    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Загрузка аватарки
    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("Пользователь не найден");
        }
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads/avatars/" + fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());
            user.setAvatarUrl("/avatars/" + fileName);
            userRepository.save(user);
            return ResponseEntity.ok(user.getAvatarUrl());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Ошибка загрузки файла");
        }
    }
}

class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private LocalDate birthDate;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
}