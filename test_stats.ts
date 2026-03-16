const { calculateStreaks } = require("./lib/stats");
const { startOfDay, subDays } = require("date-fns");

const today = startOfDay(new Date());
const yesterday = subDays(today, 1);
const dayBeforeYesterday = subDays(today, 2);

const history = [
  { id: "1", startTime: today.toISOString(), endTime: today.toISOString(), completed: true },
  { id: "2", startTime: yesterday.toISOString(), endTime: yesterday.toISOString(), completed: true },
  { id: "3", startTime: dayBeforeYesterday.toISOString(), endTime: dayBeforeYesterday.toISOString(), completed: true },
];

console.log("Streaks:", calculateStreaks(history));
