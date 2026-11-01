package com.tka.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Job;
import com.tka.model.JobApplication;
import com.tka.model.User;
import com.tka.repo.JobApplicationRepository;
import com.tka.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

	private final JobApplicationRepository repo;
	private final JobService jobService;
	private final UserRepository userRepo;
	private final AiService aiService;

	public JobApplication apply(int jobId, String resumeText, String username) {
		Job job = jobService.getById(jobId);

		if (!job.isActive()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This job is closed");
		}
		if (resumeText == null || resumeText.trim().length() < 30 || resumeText.length() > 8000) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Paste your resume text (30 to 8000 characters)");
		}
		if (repo.existsByJobIdAndStudentUsername(jobId, username)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied to this job");
		}

		String resume = resumeText.trim();
		int keyword = keywordScore(job.getRequiredSkills(), resume);

		int finalScore = keyword;
		String summary = "AI analysis was not available, so the score is based on skill keywords only.";
		String missing = "";

		try {
			AiService.Analysis ai = aiService.analyze(job, resume);
			// AI ko 60% aur keyword ko 40%, taaki resume me chhupe instructions poora score
			// na badal sakein
			finalScore = (ai.score() * 6 + keyword * 4) / 10;
			summary = ai.summary();
			missing = ai.missing();
		} catch (Exception e) {
			log.warn("AI analysis failed, using keyword score: {}", e.getMessage());
		}

		JobApplication a = new JobApplication();
		a.setJobId(jobId);
		a.setStudentUsername(username);
		a.setResumeText(resume);
		a.setMatchScore(finalScore);
		a.setAiSummary(summary);
		a.setMissingSkills(missing);
		return repo.save(a);
	}

	public List<Map<String, Object>> mine(String username) {
		return repo.findByStudentUsername(username).stream().map(a -> {
			Job job = jobService.getById(a.getJobId());
			return Map.<String, Object>of("id", a.getId(), "jobId", a.getJobId(), "jobTitle", job.getTitle(), "company",
					job.getCompany(), "status", a.getStatus(), "matchScore", a.getMatchScore(), "aiSummary",
					orEmpty(a.getAiSummary()), "missingSkills", orEmpty(a.getMissingSkills()), "appliedAt",
					a.getAppliedAt());
		}).toList();
	}

	public List<Map<String, Object>> forJob(int jobId, String username, boolean admin) {
		jobService.owned(jobId, username, admin);

		return repo.findByJobId(jobId).stream()
				.sorted(Comparator.comparingInt(JobApplication::getMatchScore).reversed())
				.map(a -> Map.<String, Object>of("id", a.getId(), "studentUsername", a.getStudentUsername(),
						"studentName", nameOf(a.getStudentUsername()), "resumeText", a.getResumeText(), "status",
						a.getStatus(), "matchScore", a.getMatchScore(), "aiSummary", orEmpty(a.getAiSummary()),
						"missingSkills", orEmpty(a.getMissingSkills()), "appliedAt", a.getAppliedAt()))
				.toList();
	}

	public JobApplication updateStatus(int id, String status, String username, boolean admin) {
		if (status == null || !List.of("SHORTLISTED", "REJECTED", "SELECTED").contains(status)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Status must be SHORTLISTED, REJECTED or SELECTED");
		}
		JobApplication a = repo.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

		jobService.owned(a.getJobId(), username, admin);
		a.setStatus(status);
		return repo.save(a);
	}

	private String orEmpty(String s) {
		return s == null ? "" : s;
	}

	private String nameOf(String username) {
		return userRepo.findByUsername(username).map(User::getFullName).orElse(username);
	}

	// Job ki required skills me se kitni resume me mili, percent me
	private int keywordScore(String requiredSkills, String resume) {
		String text = resume.toLowerCase();
		int total = 0;
		int found = 0;

		for (String s : requiredSkills.split(",")) {
			String skill = s.trim().toLowerCase();
			if (skill.isEmpty()) {
				continue;
			}
			total++;
			if (text.contains(skill)) {
				found++;
			}
		}
		return total == 0 ? 0 : found * 100 / total;
	}
}