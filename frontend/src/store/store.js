import { configureStore } from "@reduxjs/toolkit";
import jobs from "./jobsSlice";
import applications from "./applicationsSlice";

export const store = configureStore({
  reducer: { jobs, applications },
});