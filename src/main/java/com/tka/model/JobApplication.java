package com.tka.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Data
@Entity
@Table(name = "job_applications", uniqueConstraints = @UniqueConstraint(columnNames = { "job_id", "student_username" }))
public class JobApplication {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "job_id")
	private int jobId;

	@Column(name = "student_username")
	private String studentUsername;

	@Column(length = 8000)
	private String resumeText;

	// APPLIED, SHORTLISTED, REJECTED, SELECTED
	private String status = "APPLIED";

	private int matchScore;

	@Column(length = 1000)
	private String aiSummary;

	@Column(length = 500)
	private String missingSkills;

	private LocalDateTime appliedAt = LocalDateTime.now();
}