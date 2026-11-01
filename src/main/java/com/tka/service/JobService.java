package com.tka.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Job;
import com.tka.repo.JobApplicationRepository;
import com.tka.repo.JobRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobService {

	private final JobRepository repo;
	private final JobApplicationRepository appRepo;

	public List<Job> getActive() {
		return repo.findByActiveTrue();
	}

	public List<Job> getAll() {
		return repo.findAll();
	}

	public List<Job> getMine(String username) {
		return repo.findByPostedBy(username);
	}

	public Job getById(int id) {
		return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
	}

	public Job create(Job job, String username) {
		job.setId(0);
		job.setPostedBy(username);
		job.setCreatedAt(LocalDateTime.now());
		return repo.save(job);
	}

	public Job update(int id, Job job, String username, boolean admin) {
		Job existing = owned(id, username, admin);
		job.setId(id);
		job.setPostedBy(existing.getPostedBy());
		job.setCreatedAt(existing.getCreatedAt());
		return repo.save(job);
	}

	@Transactional
	public void delete(int id, String username, boolean admin) {
		owned(id, username, admin);
		appRepo.deleteAll(appRepo.findByJobId(id));
		repo.deleteById(id);
	}

	// Job mile aur wo is user ki ho (ya user ADMIN ho), warna 403
	public Job owned(int id, String username, boolean admin) {
		Job job = getById(id);
		if (!admin && !username.equals(job.getPostedBy())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs");
		}
		return job;
	}
}