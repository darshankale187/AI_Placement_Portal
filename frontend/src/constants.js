export const statusType = (s) =>
    ({ APPLIED: "", SHORTLISTED: "organ", REJECTED: "high", SELECTED: "low" })[s] || "";

export const scoreType = (n) => (n >= 70 ? "good" : n >= 40 ? "mid" : "bad");

export const formatDate = (d) => {
    const x = new Date(d);
    return isNaN(x) ? "" : x.toLocaleDateString();
};