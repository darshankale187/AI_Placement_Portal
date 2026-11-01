package com.tka.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.JobApplication;
import com.tka.security.CurrentUser;
import com.tka.service.ApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

	private final ApplicationService service;

	@PostMapping("/applications")
	public JobApplication apply(@RequestBody Map<String, Object> req, Authentication auth) {
		if (!(req.get("jobId") instanceof Number jobId)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "jobId is required");
		}
		String resume = String.valueOf(req.getOrDefault("resumeText", ""));
		return service.apply(jobId.intValue(), resume, auth.getName());
	}

	@GetMapping("/applications/my")
	public List<Map<String, Object>> mine(Authentication auth) {
		return service.mine(auth.getName());
	}

	@GetMapping("/jobs/{id}/applications")
	public List<Map<String, Object>> forJob(@PathVariable int id, Authentication auth) {
		return service.forJob(id, auth.getName(), CurrentUser.isAdmin(auth));
	}

	@PutMapping("/applications/{id}/status")
	public JobApplication updateStatus(@PathVariable int id, @RequestBody Map<String, String> req,
			Authentication auth) {
		return service.updateStatus(id, req.get("status"), auth.getName(), CurrentUser.isAdmin(auth));
	}
}