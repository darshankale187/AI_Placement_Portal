package com.tka.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tka.model.User;
import com.tka.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

	private final UserRepository repo;
	private final PasswordEncoder encoder;

	@Value("${admin.password}")
	private String adminPassword;

	@Override
	public void run(String... args) {
		User u = repo.findByUsername("admin").orElseGet(User::new);
		u.setUsername("admin");
		u.setFullName("Administrator");
		u.setRole("ADMIN");

		if (u.getId() == 0 || !encoder.matches(adminPassword, u.getPassword())) {
			u.setPassword(encoder.encode(adminPassword));
		}
		repo.save(u);
	}
}