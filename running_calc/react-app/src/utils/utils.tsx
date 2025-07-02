export const decimalPaceToString = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const removeLeadingZerosAndColons = (time: string): string => {
  // Remove leading zeros and colons, but keep at least one digit before the first colon
  return time.replace(/^0*:0?/, '').replace(/^0+/, '');
}

    // Convert time string (e.g., "1:30:45") to seconds
export const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};