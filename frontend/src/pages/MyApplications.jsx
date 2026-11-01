import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../store/applicationsSlice";
import { Alert, Badge, ScoreBar } from "../components/ui";
import { formatDate, statusType } from "../constants";

export default function MyApplications() {
    const dispatch = useDispatch();
    const { my, loading, error } = useSelector((s) => s.applications);

    useEffect(() => {
        dispatch(fetchMyApplications());
    }, [dispatch]);

    return (
        <>
            <div className="page-header">
                <h2>My applications</h2>
                <p className="muted">Track your status and read the AI feedback on your resume</p>
            </div>

            {error && <Alert>{error}</Alert>}

            <div className="card">
                {loading && <p className="loading">Loading...</p>}
                {!loading && my.length === 0 && <p className="empty">You have not applied to any job yet</p>}

                {my.length > 0 && (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Match score</th>
                                    <th>Status</th>
                                    <th>Applied on</th>
                                </tr>
                            </thead>
                            <tbody>
                                {my.map((a) => (
                                    <tr key={a.id}>
                                        <td>
                                            {a.jobTitle}
                                            <div className="job-meta">{a.company}</div>
                                            {a.aiSummary && (
                                                <details>
                                                    <summary>AI feedback</summary>
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
                                        </td>
                                        <td><ScoreBar value={a.matchScore} /></td>
                                        <td><Badge text={a.status} type={statusType(a.status)} /></td>
                                        <td>{formatDate(a.appliedAt)}</td>
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