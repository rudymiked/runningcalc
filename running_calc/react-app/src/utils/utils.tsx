export const decimalPaceToString = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const removeLeadingZerosAndColons = (time: string): string => {
  // Remove leading zeros and colons, but keep at least one digit before the first colon
  return time.replace(/^0*:0?/, '').replace(/^0+/, '');
}