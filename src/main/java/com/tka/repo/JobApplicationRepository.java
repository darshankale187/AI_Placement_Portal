package com.tka.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tka.model.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
	List<JobApplication> findByStudentUsername(String studentUsername);

	List<JobApplication> findByJobId(int jobId);

	boolean existsByJobIdAndStudentUsername(int jobId, String studentUsername);
}