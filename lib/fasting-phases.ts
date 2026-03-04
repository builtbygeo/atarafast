export function getPhaseData(fastingHours: number, elapsedHours: number = 0) {
    const sugarHours = Math.min(8, fastingHours);
    const transitionHours = Math.max(0, Math.min(12, fastingHours) - 8);
    const ketosisHours = Math.max(0, fastingHours - 12);

    // Avoid division by zero if target is 0 for some reason
    const total = fastingHours || 1;

    const sugarPctRaw = (sugarHours / total) * 100;
    const transitionPctRaw = (transitionHours / total) * 100;
    const ketosisPctRaw = (ketosisHours / total) * 100;

    const progressPctRaw = Math.min(100, (elapsedHours / total) * 100);

    return {
        sugarPct: parseFloat(sugarPctRaw.toFixed(1)),
        transitionPct: parseFloat(transitionPctRaw.toFixed(1)),
        ketosisPct: parseFloat(ketosisPctRaw.toFixed(1)),
        sugarHours,
        transitionHours,
        ketosisHours,
        progressPct: parseFloat(progressPctRaw.toFixed(1))
    };
}
