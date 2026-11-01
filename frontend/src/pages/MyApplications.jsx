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
                <p className="muted">Track the status of every job you applied to</p>
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
                                    <th>Company</th>
                                    <th>Skill match</th>
                                    <th>Status</th>
                                    <th>Applied on</th>
                                </tr>
                            </thead>
                            <tbody>
                                {my.map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.jobTitle}</td>
                                        <td>{a.company}</td>
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