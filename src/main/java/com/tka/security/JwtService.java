package com.tka.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey key;
	private final long expiryMs;

	public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiry-minutes}") long minutes) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expiryMs = minutes * 60_000;
	}

	public String generate(String username, String role) {
		Date now = new Date();
		return Jwts.builder().subject(username).claim("role", role).issuedAt(now)
				.expiration(new Date(now.getTime() + expiryMs)).signWith(key).compact();
	}

	public Claims parse(String token) {
		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
	}
}
