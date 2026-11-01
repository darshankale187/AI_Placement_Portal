package com.tka.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService service;

	@PostMapping("/register")
	public Map<String, String> register(@RequestBody Map<String, String> req) {
		return service.register(req.get("username"), req.get("password"), req.get("fullName"), req.get("role"));
	}

	@PostMapping("/login")
	public Map<String, String> login(@RequestBody Map<String, String> req) {
		return service.login(req.get("username"), req.get("password"));
	}
}