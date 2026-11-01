package com.tka.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tka.model.Job;

public interface JobRepository extends JpaRepository<Job, Integer> {
	List<Job> findByActiveTrue();

	List<Job> findByPostedBy(String postedBy);
}