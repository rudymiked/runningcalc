export interface IStaticData {
  marathon_times: string[];
  days_per_week: number[];
  average_mileage: number[];
  maximum_mileage: number[];
  weeks: number[];
}

export const staticData = (): IStaticData => {
  // Generate example data
  const marathon_times = [];
  for (let hour = 2; hour < 6; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      marathon_times.push(`${hour}:${minute.toString().padStart(2, "0")}`);
    }
  }

  const days_per_week = Array.from({ length: 5 }, (_, i) => i + 3); // [3, 4, 5, 6, 7]
  const average_mileage = Array.from({ length: 16 }, (_, i) => 25 + i * 5); // [25, 30, ..., 100]
  const maximum_mileage = Array.from({ length: 20 }, (_, i) => 25 + i * 5); // [25, 30, ..., 120]
  const weeks = Array.from({ length: 5 }, (_, i) => 16 + i); // [16, 17, 18, 19, 20]

  return {
    marathon_times,
    days_per_week,
    average_mileage,
    maximum_mileage,
    weeks,
  };
};