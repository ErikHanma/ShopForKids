package ru.kors.giftstore2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private String secret = "63f4945d921d599f27ae4fdf5bada3f163f4945d921d599f27ae4fdf5bada3f1"; // Длинный ключ для безопасности
    private long expiration = 86400000; // 24 часа

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        System.out.println("Generated token: " + token);
        return token;
    }

    public String extractUsername(String token) {
        Claims claims = extractClaims(token);
        String username = claims.getSubject();
        System.out.println("Extracted username from token: " + username);
        return username;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            Date expirationDate = claims.getExpiration();
            Date now = new Date();
            System.out.println("Token validated, subject: " + claims.getSubject() + ", issued at: " + claims.getIssuedAt() + ", expires at: " + expirationDate);
            if (expirationDate.before(now)) {
                System.out.println("Token expired: " + expirationDate + " is before " + now);
                return false;
            }
            return true;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}