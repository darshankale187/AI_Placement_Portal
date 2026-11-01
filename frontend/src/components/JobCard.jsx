import { useState } from "react";
import { useDispatch } from "react-redux";
import { applyToJob } from "../store/applicationsSlice";
import { Alert, Badge } from "./ui";

export default function JobCard({ job, applied }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [resume, setResume] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(null);

    const skills = job.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await dispatch(applyToJob({ jobId: job.id, resumeText: resume }));
        setBusy(false);

        if (res.meta.requestStatus === "fulfilled") {
            setMsg({ type: "success", text: `Applied! Skill match: ${res.payload.matchScore}%` });
            setOpen(false);
        } else {
            setMsg({ type: "error", text: res.payload?.message || "Could not apply" });
        }
    };

    return (
        <div className="card job-card">
            <h3>{job.title}</h3>
            <div className="job-meta">
                {job.company} · {job.location}
            </div>
            <div className="badges">
                {skills.map((s) => (
                    <Badge key={s} text={s} type="organ" />
                ))}
            </div>
            <p className="job-desc">{job.description}</p>

            {msg && <Alert type={msg.type}>{msg.text}</Alert>}

            {applied ? (
                <Badge text="Applied" type="low" />
            ) : open ? (
                <form onSubmit={submit}>
                    <div className="field">
                        <label>Paste your resume text</label>
                        <textarea value={resume} onChange={(e) => setResume(e.target.value)} />
                    </div>
                    <div className="actions">
                        <button className="btn btn-sm" type="submit" disabled={busy}>
                            {busy ? "Submitting..." : "Submit application"}
                        </button>
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <button className="btn btn-sm" onClick={() => setOpen(true)}>
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}