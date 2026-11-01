import { createSlice } from "@reduxjs/toolkit";
import { getJson, postJson, putJson } from "../api";
import { makeThunk } from "./makeThunk";

export const fetchMyApplications = makeThunk("applications/my", () => getJson("applications/my"));
export const applyToJob = makeThunk("applications/apply", (body) => postJson("applications", body));
export const fetchApplicants = makeThunk("applications/applicants", (jobId) =>
    getJson(`jobs/${jobId}/applications`)
);
export const setStatus = makeThunk("applications/status", ({ id, status }) =>
    putJson(`applications/${id}/status`, { status })
);

const applicationsSlice = createSlice({
    name: "applications",
    initialState: { my: [], applicants: [], loading: false, error: "" },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyApplications.pending, (s) => {
                s.loading = true;
                s.error = "";
            })
            .addCase(fetchMyApplications.fulfilled, (s, a) => {
                s.loading = false;
                s.my = Array.isArray(a.payload) ? a.payload : [];
            })
            .addCase(fetchMyApplications.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.message || "Could not load applications";
            })
            .addCase(applyToJob.fulfilled, (s, a) => {
                const { id, jobId, status, matchScore } = a.payload;
                s.my.push({ id, jobId, status, matchScore });
            })
            .addCase(fetchApplicants.pending, (s) => {
                s.loading = true;
                s.applicants = [];
                s.error = "";
            })
            .addCase(fetchApplicants.fulfilled, (s, a) => {
                s.loading = false;
                s.applicants = Array.isArray(a.payload) ? a.payload : [];
            })
            .addCase(fetchApplicants.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.message || "Could not load applicants";
            })
            .addCase(setStatus.fulfilled, (s, a) => {
                s.applicants = s.applicants.map((x) => (x.id === a.payload.id ? { ...x, status: a.payload.status } : x));
            })
            .addCase(setStatus.rejected, (s, a) => {
                s.error = a.payload?.message || "Could not update status";
            });
    },
});

export default applicationsSlice.reducer;