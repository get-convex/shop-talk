import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "daily reset",
  { hourUTC: 0, minuteUTC: 0 },
  internal.janitor.dailyReset
);

export default crons;
