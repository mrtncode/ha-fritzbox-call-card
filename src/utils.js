export function formatDuration(durationMs) {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return 'unknown';
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }

  return `${seconds}s`;
}

export function isRingingAnswered(sorted, index) {
  for (let j = index + 1; j < sorted.length; j += 1) {
    if (sorted[j].state === 'talking') {
      return true;
    }
    if (sorted[j].state === 'ringing' || sorted[j].state === 'dialing') {
      return false;
    }
  }
  return false;
}
