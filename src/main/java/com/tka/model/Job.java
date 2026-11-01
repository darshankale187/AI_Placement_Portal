package com.tka.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Job {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Company is required")
	private String company;

	@NotBlank(message = "Location is required")
	private String location;

	@NotBlank(message = "Description is required")
	@Column(length = 4000)
	private String description;

	// comma se alag skills, jaise "Java, Spring Boot, MySQL"
	@NotBlank(message = "Required skills are required")
	private String requiredSkills;

	private boolean active = true;

	// recruiter ka username, server set karega
	private String postedBy;

	private LocalDateTime createdAt = LocalDateTime.now();
}