import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/jobsSlice";
import { fetchMyApplications } from "../store/applicationsSlice";
import JobCard from "../components/JobCard";
import { Alert } from "../components/ui";

export default function Jobs() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.jobs);
    const my = useSelector((s) => s.applications.my);
    const [q, setQ] = useState("");

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchMyApplications());
    }, [dispatch]);

    const appliedIds = new Set(my.map((a) => a.jobId));
    const text = q.trim().toLowerCase();
    const shown = list.filter((j) =>
        `${j.title} ${j.company} ${j.location} ${j.requiredSkills}`.toLowerCase().includes(text)
    );

    return (
        <>
            <div className="page-header">
                <h2>Open jobs</h2>
                <p className="muted">Search by title, company, location or skill, then apply with your resume</p>
            </div>

            {error && <Alert>{error}</Alert>}

            <div className="field">
                <input placeholder="Search jobs..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {loading && <p className="loading">Loading...</p>}
            {!loading && shown.length === 0 && <p className="empty">No jobs found</p>}

            <div className="job-grid">
                {shown.map((j) => (
                    <JobCard key={j.id} job={j} applied={appliedIds.has(j.id)} />
                ))}
            </div>
        </>
    );
}