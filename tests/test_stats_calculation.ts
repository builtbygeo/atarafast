
import { calculateStreaks } from '../lib/stats';
import { FastingRecord } from '../lib/storage';
import { startOfDay, subDays } from 'date-fns';

const today = startOfDay(new Date()).getTime();

const mockHistory: FastingRecord[] = [
    { id: '1', startTime: new Date(today).toISOString(), endTime: new Date(today).toISOString(), completed: true, presetId: '1', targetHours: 16 },
    { id: '2', startTime: new Date(subDays(today, 1)).toISOString(), endTime: new Date(subDays(today, 1)).toISOString(), completed: true, presetId: '1', targetHours: 16 },
    { id: '3', startTime: new Date(subDays(today, 2)).toISOString(), endTime: new Date(subDays(today, 2)).toISOString(), completed: true, presetId: '1', targetHours: 16 },
];

const streaks = calculateStreaks(mockHistory);
console.log('Streaks:', streaks);
