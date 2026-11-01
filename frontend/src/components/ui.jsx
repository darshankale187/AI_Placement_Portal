import { scoreType } from "../constants";

export function Badge({ text, type = "" }) {
    return <span className={`badge ${type}`}>{text}</span>;
}

export function Alert({ type = "error", children }) {
    return <div className={`alert alert-${type}`}>{children}</div>;
}

export function ScoreBar({ value }) {
    return (
        <div className="score">
            <div className="score-bar">
                <div className={`score-fill ${scoreType(value)}`} style={{ width: `${value}%` }} />
            </div>
            <span>{value}%</span>
        </div>
    );
}