import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createJob, deleteJob, fetchMyJobs, updateJob } from "../store/jobsSlice";
import { useAuth } from "../context/AuthContext";
import FormCard from "../components/FormCard";
import { Alert, Badge } from "../components/ui";

const empty = { title: "", company: "", location: "", requiredSkills: "", description: "" };

const fields = [
    { name: "title", label: "Job title" },
    { name: "company", label: "Company" },
    { name: "location", label: "Location" },
    { name: "requiredSkills", label: "Required skills (comma separated)" },
    { name: "description", label: "Description", type: "textarea" },
];

export default function Dashboard() {
    const dispatch = useDispatch();
    const { role } = useAuth();
    const { mine, loading, error, fieldErrors } = useSelector((s) => s.jobs);
    const [values, setValues] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(fetchMyJobs());
    }, [dispatch]);

    const reset = () => {
        setValues(empty);
        setEditingId(null);
    };

    const flash = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 2500);
    };

    const submit = async () => {
        const res = await dispatch(editingId ? updateJob(values) : createJob(values));
        if (res.meta.requestStatus === "fulfilled") {
            flash(editingId ? "Job updated" : "Job posted");
            reset();
        }
    };

    const startEdit = (job) => {
        setEditingId(job.id);
        setValues({ ...job });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remove = (job) => {
        if (window.confirm(`Delete "${job.title}" and all its applications?`)) {
            dispatch(deleteJob(job.id));
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>{role === "ADMIN" ? "All jobs" : "My jobs"}</h2>
                <p className="muted">Post jobs and review applicants</p>
            </div>

            {error && <Alert>{error}</Alert>}
            {message && <Alert type="success">{message}</Alert>}

            <div className="split">
                <FormCard
                    title={editingId ? "Edit job" : "Post a job"}
                    fields={fields}
                    values={values}
                    setValues={setValues}
                    onSubmit={submit}
                    errors={fieldErrors}
                    submitLabel={editingId ? "Update" : "Post job"}
                    onCancel={editingId ? reset : undefined}
                />

                <div className="card">
                    <h3>Jobs ({mine.length})</h3>
                    {loading && <p className="loading">Loading...</p>}
                    {!loading && mine.length === 0 && <p className="empty">No jobs posted yet</p>}

                    {mine.length > 0 && (
                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Posted by</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mine.map((j) => (
                                        <tr key={j.id}>
                                            <td>{j.title}</td>
                                            <td>{j.company}</td>
                                            <td>{j.postedBy}</td>
                                            <td><Badge text={j.active ? "Open" : "Closed"} type={j.active ? "low" : ""} /></td>
                                            <td>
                                                <div className="actions">
                                                    <Link className="btn btn-sm" to={`/jobs/${j.id}/applicants`}>
                                                        Applicants
                                                    </Link>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(j)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => dispatch(updateJob({ ...j, active: !j.active }))}
                                                    >
                                                        {j.active ? "Close" : "Reopen"}
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => remove(j)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}