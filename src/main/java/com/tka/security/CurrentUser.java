package com.tka.security;

import org.springframework.security.core.Authentication;

public final class CurrentUser {

	private CurrentUser() {
	}

	public static boolean isAdmin(Authentication auth) {
		return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
	}
}