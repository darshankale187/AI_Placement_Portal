package com.tka.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tka.model.Job;
import com.tka.security.CurrentUser;
import com.tka.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

	private final JobService service;

	@GetMapping
	public List<Job> active() {
		return service.getActive();
	}

	@GetMapping("/mine")
	public List<Job> mine(Authentication auth) {
		return CurrentUser.isAdmin(auth) ? service.getAll() : service.getMine(auth.getName());
	}

	@GetMapping("/{id}")
	public Job one(@PathVariable int id) {
		return service.getById(id);
	}

	@PostMapping
	public Job create(@Valid @RequestBody Job job, Authentication auth) {
		return service.create(job, auth.getName());
	}

	@PutMapping("/{id}")
	public Job update(@PathVariable int id, @Valid @RequestBody Job job, Authentication auth) {
		return service.update(id, job, auth.getName(), CurrentUser.isAdmin(auth));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable int id, Authentication auth) {
		service.delete(id, auth.getName(), CurrentUser.isAdmin(auth));
	}
}