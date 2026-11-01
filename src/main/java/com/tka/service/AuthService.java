package com.tka.service;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.User;
import com.tka.repo.UserRepository;
import com.tka.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository repo;
	private final PasswordEncoder encoder;
	private final JwtService jwt;

	public Map<String, String> register(String username, String password, String fullName, String role) {
		if (username == null || username.trim().length() < 3 || password == null || password.length() < 6
				|| fullName == null || fullName.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Username (min 3), password (min 6) and full name are required");
		}
		// ADMIN register se nahi banta, sirf seeder se
		if (!"STUDENT".equals(role) && !"RECRUITER".equals(role)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be STUDENT or RECRUITER");
		}
		if (repo.existsByUsername(username.trim())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
		}

		User u = new User();
		u.setUsername(username.trim());
		u.setPassword(encoder.encode(password));
		u.setFullName(fullName.trim());
		u.setRole(role);
		repo.save(u);

		return response(u);
	}

	public Map<String, String> login(String username, String password) {
		if (username == null || password == null) {
			throw invalid();
		}
		User u = repo.findByUsername(username.trim()).orElseThrow(this::invalid);

		if (!encoder.matches(password, u.getPassword())) {
			throw invalid();
		}
		return response(u);
	}

	private ResponseStatusException invalid() {
		return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
	}

	private Map<String, String> response(User u) {
		return Map.of("token", jwt.generate(u.getUsername(), u.getRole()), "username", u.getUsername(), "fullName",
				u.getFullName(), "role", u.getRole());
	}
}