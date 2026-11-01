import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants, setStatus } from "../store/applicationsSlice";
import { fetchMyJobs } from "../store/jobsSlice";
import { Alert, Badge, ScoreBar } from "../components/ui";
import { formatDate, statusType } from "../constants";

export default function Applicants() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const job = useSelector((s) => s.jobs.mine.find((j) => j.id === Number(id)));
    const { applicants, loading, error } = useSelector((s) => s.applications);

    useEffect(() => {
        dispatch(fetchMyJobs());
        dispatch(fetchApplicants(id));
    }, [dispatch, id]);

    return (
        <>
            <Link className="back-link" to="/dashboard">
                &larr; Back to dashboard
            </Link>

            <div className="page-header">
                <h2>Applicants{job ? `: ${job.title}` : ""}</h2>
                <p className="muted">Sorted by match score, highest first</p>
            </div>

            {error && <Alert>{error}</Alert>}

            <div className="card">
                {loading && <p className="loading">Loading...</p>}
                {!loading && !error && applicants.length === 0 && <p className="empty">No applications yet</p>}

                {applicants.length > 0 && (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Match score</th>
                                    <th>Status</th>
                                    <th>Applied on</th>
                                    <th>Decision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((a) => (
                                    <tr key={a.id}>
                                        <td>
                                            {a.studentName}
                                            {a.aiSummary && (
                                                <details>
                                                    <summary>AI analysis</summary>
                                                    <div className="ai-note">
                                                        {a.aiSummary}
                                                        {a.missingSkills && a.missingSkills !== "None" && (
                                                            <div>
                                                                <b>Missing skills:</b> {a.missingSkills}
                                                            </div>
                                                        )}
                                                    </div>
                                                </details>
                                            )}
                                            <details>
                                                <summary>Resume</summary>
                                                <div className="resume">{a.resumeText}</div>
                                            </details>
                                        </td>
                                        <td><ScoreBar value={a.matchScore} /></td>
                                        <td><Badge text={a.status} type={statusType(a.status)} /></td>
                                        <td>{formatDate(a.appliedAt)}</td>
                                        <td>
                                            <div className="actions">
                                                {["SHORTLISTED", "REJECTED", "SELECTED"].map((s) => (
                                                    <button
                                                        key={s}
                                                        className="btn btn-secondary btn-sm"
                                                        disabled={a.status === s}
                                                        onClick={() => dispatch(setStatus({ id: a.id, status: s }))}
                                                    >
                                                        {s.charAt(0) + s.slice(1).toLowerCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}