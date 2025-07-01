export interface ITrainingPlan {
  week: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  total_miles?: number;
}

export interface IPaceData {
  Recovery: number;
  Easy: number;
  Medium: number;
  Mile: number;
  "5k": number;
  "10k": number;
  Half: number;
  Marathon: number;
};

type Paces = Record<string, number[]>;

const originalTimes: string[] = ["2:45", "2:50", "2:56", "3:03", "3:10"];
const originalPaces: Paces = {
  Recovery: [7.5, 8.0, 8.5, 8.75, 9.0],
  Easy: [7.25, 7.5, 8.0, 8.33, 8.7],
  Medium: [6.5, 7.0, 7.5, 8.0, 8.33],
  Mile: [5.13, 5.33, 5.42, 5.5, 5.7],
  "5k": [5.5, 5.7, 5.9, 6.13, 6.38],
  "10k": [5.83, 5.95, 6.15, 6.4, 6.65],
  Half: [5.92, 6.22, 6.43, 6.7, 6.95],
  Marathon: [6.28, 6.5, 6.75, 7.0, 7.25],
};

// Convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

// Calculate paces for any marathon time
const calculatePaces = (
  originalTimes: string[],
  originalPaces: Paces,
  marathonTime: string
): IPaceData => {
  const marathonMinutes = timeToMinutes(marathonTime);
  const originalMinutes = originalTimes.map(timeToMinutes);

  const calculatedPaces: IPaceData = {
    Recovery: 0,
    Easy: 0,
    Medium: 0,
    Mile: 0,
    "5k": 0,
    "10k": 0,
    Half: 0,
    Marathon: 0,
  };

  for (const [paceType, row] of Object.entries(originalPaces)) {
    let interpolatedValue = 0;
    for (let i = 0; i < originalMinutes.length - 1; i++) {
      if (
        originalMinutes[i] <= marathonMinutes &&
        marathonMinutes <= originalMinutes[i + 1]
      ) {
        const t1 = originalMinutes[i];
        const t2 = originalMinutes[i + 1];
        const p1 = row[i];
        const p2 = row[i + 1];
        const adjustmentFactor = (marathonMinutes - t1) / (t2 - t1);
        interpolatedValue = p1 + (p2 - p1) * adjustmentFactor;
        calculatedPaces[paceType as keyof IPaceData] = parseFloat(interpolatedValue.toFixed(2));
        break;
      }
    }

    if (marathonMinutes < originalMinutes[0]) {
      calculatedPaces[paceType as keyof IPaceData] = parseFloat(
        (row[0] * (marathonMinutes / originalMinutes[0])).toFixed(2)
      );
    } else if (marathonMinutes > originalMinutes[originalMinutes.length - 1]) {
      calculatedPaces[paceType as keyof IPaceData] = parseFloat(
        (row[row.length - 1] *
          (marathonMinutes / originalMinutes[originalMinutes.length - 1])).toFixed(2)
      );
    }
  }

  return calculatedPaces;
};

export const generatePaces = (
  marathonTime: string
): IPaceData => {
  return calculatePaces(originalTimes, originalPaces, marathonTime);

};

export const generateTableData = (
  averageMileage: number,
  maximumMileage: number,
  weeks: number,
  daysPerWeek: number
): ITrainingPlan[] => {
  const restDaysOrder = ["friday", "monday", "wednesday", "saturday"];
  const taperStartWeek = weeks - 3; // Start tapering 3 weeks before the end

  const tableData = Array.from({ length: weeks }, (_, weekIndex) => {
    // Calculate weekly mileage
    let weeklyMileage: number;
    if (weekIndex === 0) {
      // First week: Half the maximum mileage
      weeklyMileage = Math.floor(maximumMileage / 2);
    } else if (weekIndex < taperStartWeek) {
      // Build-up phase: Start from week 1 mileage and increase progressively
      const week1Mileage = Math.floor(maximumMileage / 2);
      const increment = (maximumMileage - week1Mileage) / (taperStartWeek - 1);
      weeklyMileage = Math.min(
        maximumMileage,
        Math.floor(week1Mileage + increment * weekIndex)
      );
    } else {
      // Taper phase: Gradually reduce mileage
      if (weekIndex === weeks - 1) {
        // Final week: 1/3 of the maximum mileage
        weeklyMileage = Math.floor(maximumMileage / 3);
      } else if (weekIndex === weeks - 2) {
        // Second-to-last week: 2/3 of the maximum mileage
        weeklyMileage = Math.floor((maximumMileage * 2) / 3);
      } else {
        // Third-to-last week: 3/4 of the maximum mileage
        weeklyMileage = Math.floor(maximumMileage * 0.75);
      }
    }

    // Ensure weekly mileage doesn't exceed the maximum mileage
    weeklyMileage = Math.min(weeklyMileage, maximumMileage);

    const restDays = restDaysOrder.slice(0, 7 - daysPerWeek);
    const weekPlan: Record<string, string> = {
      monday: "Run",
      tuesday: "Run",
      wednesday: "Run",
      thursday: "Run",
      friday: "Run",
      saturday: "Run",
      sunday: "Run",
    };

    // Assign rest days
    restDays.forEach((day) => {
      weekPlan[day] = "Rest";
    });

    // Special case for the final week: No running on Saturday or Sunday
    if (weekIndex === weeks - 1) {
      weekPlan.saturday = "Shakeout";
      weekPlan.sunday = "RACE";
    }

    // Distribute mileage across the week
    let remainingMileage = weeklyMileage;

    // Assign long run to Sunday (if not the final week)
    if (weekIndex !== weeks - 1) {
      const longRunMileage = Math.ceil(weeklyMileage * 0.4); // 40% of weekly mileage
      weekPlan.sunday = `${longRunMileage}`;
      remainingMileage -= longRunMileage;
    }

    // Assign short run to Monday
    const shortRunMileage = Math.ceil(weeklyMileage * 0.2); // 20% of weekly mileage
    if (weekPlan.monday === "Run") {
      weekPlan.monday = `${shortRunMileage}`;
      remainingMileage -= shortRunMileage;
    }

    // Distribute remaining mileage across other running days
    const otherRunningDays = Object.keys(weekPlan).filter(
      (day) => weekPlan[day] === "Run"
    );
    const remainingDailyMileage = Math.floor(remainingMileage / otherRunningDays.length);

    otherRunningDays.forEach((day, index) => {
      if (index === otherRunningDays.length - 1) {
        // Assign all remaining mileage to the last day
        weekPlan[day] = `${remainingMileage}`;
      } else {
        weekPlan[day] = `${remainingDailyMileage}`;
        remainingMileage -= remainingDailyMileage;
      }
    });

    return {
      week: `Week ${weekIndex + 1}`,
      monday: weekPlan.monday,
      tuesday: weekPlan.tuesday,
      wednesday: weekPlan.wednesday,
      thursday: weekPlan.thursday,
      friday: weekPlan.friday,
      saturday: weekPlan.saturday,
      sunday: weekPlan.sunday,
      total_miles: weeklyMileage,
    };
  });

  return tableData;
};