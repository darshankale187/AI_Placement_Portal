import { createAsyncThunk } from "@reduxjs/toolkit";

// API call ko thunk me lapet deta hai, error aaye to rejectWithValue se payload me jata hai
export const makeThunk = (name, fn) =>
    createAsyncThunk(name, async (arg, { rejectWithValue }) => {
        try {
            return await fn(arg);
        } catch (e) {
            return rejectWithValue(e);
        }
    });