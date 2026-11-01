import { createSlice } from "@reduxjs/toolkit";
import { deleteJson, getJson, postJson, putJson } from "../api";
import { makeThunk } from "./makeThunk";

export const fetchJobs = makeThunk("jobs/fetch", () => getJson("jobs"));
export const fetchMyJobs = makeThunk("jobs/mine", () => getJson("jobs/mine"));
export const createJob = makeThunk("jobs/create", (job) => postJson("jobs", job));
export const updateJob = makeThunk("jobs/update", (job) => putJson(`jobs/${job.id}`, job));
export const deleteJob = makeThunk("jobs/delete", async (id) => {
    await deleteJson(`jobs/${id}`);
    return id;
});

const saveRejected = (s, a) => {
    s.fieldErrors = a.payload?.errors || {};
    s.error = a.payload?.errors ? "" : a.payload?.message || "Request failed";
};

const jobsSlice = createSlice({
    name: "jobs",
    initialState: { list: [], mine: [], loading: false, error: "", fieldErrors: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (s) => {
                s.loading = true;
                s.error = "";
            })
            .addCase(fetchJobs.fulfilled, (s, a) => {
                s.loading = false;
                s.list = Array.isArray(a.payload) ? a.payload : [];
            })
            .addCase(fetchJobs.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.message || "Could not load jobs";
            })
            .addCase(fetchMyJobs.pending, (s) => {
                s.loading = true;
                s.error = "";
            })
            .addCase(fetchMyJobs.fulfilled, (s, a) => {
                s.loading = false;
                s.mine = Array.isArray(a.payload) ? a.payload : [];
            })
            .addCase(fetchMyJobs.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.message || "Could not load jobs";
            })
            .addCase(createJob.pending, (s) => {
                s.fieldErrors = {};
                s.error = "";
            })
            .addCase(createJob.fulfilled, (s, a) => {
                s.mine.push(a.payload);
            })
            .addCase(createJob.rejected, saveRejected)
            .addCase(updateJob.pending, (s) => {
                s.fieldErrors = {};
                s.error = "";
            })
            .addCase(updateJob.fulfilled, (s, a) => {
                s.mine = s.mine.map((j) => (j.id === a.payload.id ? a.payload : j));
            })
            .addCase(updateJob.rejected, saveRejected)
            .addCase(deleteJob.fulfilled, (s, a) => {
                s.mine = s.mine.filter((j) => j.id !== a.payload);
            })
            .addCase(deleteJob.rejected, (s, a) => {
                s.error = a.payload?.message || "Could not delete job";
            });
    },
});

export default jobsSlice.reducer;