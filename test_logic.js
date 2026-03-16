const { getHistory } = require('./lib/storage');

// Mock localStorage for node environment if needed
global.localStorage = {
  getItem: () => JSON.stringify({
    history: [
      { id: '1', startTime: '2026-03-01T00:00:00Z', weight: 80, completed: true },
      { id: '2', startTime: '2026-03-02T00:00:00Z', weight: 79, completed: true }
    ]
  }),
  setItem: () => {},
  removeItem: () => {},
};

function getLatestWeight() {
  const history = JSON.parse(global.localStorage.getItem('fasting-tracker-data')).history;
  const sorted = [...history].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  return sorted.find(r => r.weight !== undefined)?.weight;
}

console.log('Latest weight:', getLatestWeight());
