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
  average_miles?: number;
}

export interface IPaceAndTime {
  pace: number;
  time: string;
}

export interface IPaceData {
  Recovery: IPaceAndTime;
  Easy: IPaceAndTime;
  Medium: IPaceAndTime;
  Mile: IPaceAndTime;
  fiveK: IPaceAndTime;
  tenK: IPaceAndTime;
  Half: IPaceAndTime;
  Marathon: IPaceAndTime;
};

type Paces = Record<string, number[]>;

const originalTimes: string[] = ["2:45", "2:50", "2:56", "3:03", "3:10"];
const originalPaces: Paces = {
  Recovery: [7.5, 8.0, 8.5, 8.75, 9.0],
  Easy: [7.25, 7.5, 8.0, 8.33, 8.7],
  Medium: [6.5, 7.0, 7.5, 8.0, 8.33],
  Mile: [5.13, 5.33, 5.42, 5.5, 5.7],
  fiveK: [5.5, 5.7, 5.9, 6.13, 6.38],
  tenK: [5.83, 5.95, 6.15, 6.4, 6.65],
  Half: [5.92, 6.22, 6.43, 6.7, 6.95],
  Marathon: [6.28, 6.5, 6.75, 7.0, 7.25],
};

const totalTimeForDistance = (pace: number, miles: number): string => {
  if (!pace || isNaN(pace)) return "0:00:00";
  const totalMinutes = pace * miles;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.round((totalMinutes - Math.floor(totalMinutes)) * 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
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

  // Helper to interpolate pace
  const interpolatePace = (row: number[]): number => {
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
        return parseFloat(interpolatedValue.toFixed(2));
      }
    }
    if (marathonMinutes < originalMinutes[0]) {
      return parseFloat((row[0] * (marathonMinutes / originalMinutes[0])).toFixed(2));
    } else if (marathonMinutes > originalMinutes[originalMinutes.length - 1]) {
      return parseFloat(
        (row[row.length - 1] *
          (marathonMinutes / originalMinutes[originalMinutes.length - 1])).toFixed(2)
      );
    }
    return 0;
  };

  // Calculate paces and times for each type
  const RecoveryPace = interpolatePace(originalPaces.Recovery);
  const EasyPace = interpolatePace(originalPaces.Easy);
  const MediumPace = interpolatePace(originalPaces.Medium);
  const MilePace = interpolatePace(originalPaces.Mile);
  const fiveKPace = interpolatePace(originalPaces.fiveK);
  const tenKPace = interpolatePace(originalPaces.tenK);
  const HalfPace = interpolatePace(originalPaces.Half);
  const MarathonPace = interpolatePace(originalPaces.Marathon);

  return {
    Recovery: {
      pace: RecoveryPace,
      time: totalTimeForDistance(RecoveryPace, 1),
    },
    Easy: {
      pace: EasyPace,
      time: totalTimeForDistance(EasyPace, 1),
    },
    Medium: {
      pace: MediumPace,
      time: totalTimeForDistance(MediumPace, 1),
    },
    Mile: {
      pace: MilePace,
      time: totalTimeForDistance(MilePace, 1),
    },
    fiveK: {
      pace: fiveKPace,
      time: totalTimeForDistance(fiveKPace, 3.10686),
    },
    tenK: {
      pace: tenKPace,
      time: totalTimeForDistance(tenKPace, 6.21371),
    },
    Half: {
      pace: HalfPace,
      time: totalTimeForDistance(HalfPace, 13.1094),
    },
    Marathon: {
      pace: MarathonPace,
      time: totalTimeForDistance(MarathonPace, 26.2188),
    },
  };
};

export const generatePaces = (
  marathonTime: string
): IPaceData => {
  return calculatePaces(originalTimes, originalPaces, marathonTime);

};

// Speed work dictionary
const speedWorkouts = [
  { desc: "10x400m @ mile pace (~4 miles w/ jogs)", mileage: 4 },
  { desc: "10x600m @ 5K pace (~5 miles w/ jogs)", mileage: 5 },
  { desc: "8x800m @ 5K pace (~6 miles w/ jogs)", mileage: 6 },
  { desc: "5x1 mile @ 10K pace (~7 miles w/ jogs)", mileage: 6 },
  { desc: "Fartlek 8 x 2 minutes @ 5K w/ 1 min jogs", mileage: 5 },
  { desc: "8 x 60 seconds uphill w/ jogs", mileage: 5 },
  //{ desc: "4x2 miles @ HM pace (~9 miles w/ jogs)", mileage: 9 },
];

export const generateTableData = (
  averageMileage: number,
  maximumMileage: number,
  weeks: number,
  daysPerWeek: number
): { tableData: ITrainingPlan[]; calculatedAverage: number } => {
  const restDaysOrder = ["friday", "monday", "wednesday", "saturday"];
  const taperStartWeek = weeks - 3;
  const totalTargetMileage = averageMileage * weeks;
  let totalPlannedMileage = 0;

  // Precompute which weeks will be max mileage (last 2 before taper)
  const maxWeeks = [taperStartWeek - 2, taperStartWeek - 1];

  const tableData = Array.from({ length: weeks }, (_, weekIndex) => {
    let weeklyMileage: number;
    if (maxWeeks.includes(weekIndex)) {
      weeklyMileage = maximumMileage;
    } else if (weekIndex === 0) {
      weeklyMileage = Math.floor(maximumMileage / 2);
    } else if (weekIndex < taperStartWeek) {
      const week1Mileage = Math.floor(maximumMileage / 2);
      const increment = (maximumMileage - week1Mileage) / (taperStartWeek - 3);
      weeklyMileage = Math.min(
        maximumMileage,
        Math.floor(week1Mileage + increment * (weekIndex - 1))
      );
    } else {
      if (weekIndex === weeks - 1) {
        weeklyMileage = Math.floor(maximumMileage / 3);
      } else if (weekIndex === weeks - 2) {
        weeklyMileage = Math.floor((maximumMileage * 2) / 3);
      } else {
        weeklyMileage = Math.floor(maximumMileage * 0.75);
      }
    }

    // Adjust weekly mileage to ensure total mileage matches the target
    const remainingWeeks = weeks - weekIndex;
    const remainingTargetMileage = totalTargetMileage - totalPlannedMileage;
    if (!maxWeeks.includes(weekIndex) && weekIndex < taperStartWeek) {
      weeklyMileage = Math.min(
        weeklyMileage,
        Math.floor(remainingTargetMileage / remainingWeeks)
      );
    }
    totalPlannedMileage += weeklyMileage;

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

    restDays.forEach((day) => {
      weekPlan[day] = "Rest";
    });

    // --- Assign days ---
    let longRunMiles = 0;
    let speedWork = null;
    let speedWorkMileage = 0;

    // Determine special race weeks
    const tenKWeek = Math.round(weeks / 3) - 1; // 0-based index
    const halfMarathonWeek = Math.round((2 * weeks) / 3) - 1; // 0-based index

    // Assign Sunday: 10K race, Half Marathon race, or long run
    if (weekPlan.sunday === "Run") {
      if (weekIndex === tenKWeek) {
        weekPlan.sunday = "10K (Race)";
        longRunMiles = 6; // 10K ~ 6 miles
      } else if (weekIndex === halfMarathonWeek) {
        weekPlan.sunday = "Half (Race)";
        longRunMiles = 13; // Half marathon ~ 13 miles
      } else {
        longRunMiles = Math.ceil(weeklyMileage * 0.45);
        weekPlan.sunday = `${longRunMiles}`;
      }
    }

    // Assign speed work on Tuesday
    if (weekPlan.tuesday === "Run") {
      const randomIdx = Math.floor(Math.random() * speedWorkouts.length);
      speedWork = speedWorkouts[randomIdx];
      weekPlan.tuesday = speedWork.desc;
      speedWorkMileage = speedWork.mileage;
    }

    // Assign short run to Monday
    let mondayMiles = 0;
    if (weekPlan.monday === "Run") {
      mondayMiles = Math.min(4, weeklyMileage);
      weekPlan.monday = `${mondayMiles}`;
    }

    // Assign short run to Saturday
    let saturdayMiles = 0;
    if (weekPlan.saturday === "Run") {
      saturdayMiles = Math.min(3, weeklyMileage);
      weekPlan.saturday = `${saturdayMiles}`;
    }

    // Calculate remaining mileage after long run, speed work, Monday, Saturday
    let assigned = longRunMiles + speedWorkMileage + mondayMiles + saturdayMiles;
    let remainingMileage = weeklyMileage - assigned;

    // Distribute remaining mileage to other running days (Wed, Thu, Fri)
    const otherRunningDays = ["wednesday", "thursday", "friday"].filter(
      (day) => weekPlan[day] === "Run"
    );

    // Ensure every running day gets at least 3 miles if possible
    let baseMileage = 0;
    let leftover = 0;
    if (otherRunningDays.length > 0) {
      // Give 3 miles to each first, then distribute the rest
      const minMiles = otherRunningDays.length * 3;
      let distributable = Math.max(0, remainingMileage - minMiles);
      baseMileage = Math.floor(distributable / otherRunningDays.length) + 3;
      leftover = distributable - (baseMileage - 3) * otherRunningDays.length;
    }

    otherRunningDays.forEach((day) => {
      let miles = baseMileage;
      if (leftover > 0) {
        miles += 1;
        leftover -= 1;
      }
      weekPlan[day] = `${miles}`;
    });

    // Add any leftover (from rounding) to Sunday (long run)
    if (leftover > 0 && weekPlan.sunday !== "Rest") {
      weekPlan.sunday = `${parseInt(weekPlan.sunday) + leftover}`;
    }

    // If Sunday mileage is over 22, cap at 22 and distribute remainder to other non-rest, non-Tuesday days
    if (
      weekPlan.sunday !== "Rest" &&
      parseInt(weekPlan.sunday) > 22
    ) {
      const cappedSunday = 22;
      const remainder = parseInt(weekPlan.sunday) - cappedSunday;
      weekPlan.sunday = `${cappedSunday}`;

      // Find all non-rest, non-Tuesday days
      const distributeDays = Object.keys(weekPlan).filter(
        (day) =>
          weekPlan[day] !== "Rest" &&
          day !== "tuesday" &&
          day !== "sunday"
      );
      const numDays = distributeDays.length;
      const baseAdd = Math.floor(remainder / numDays);
      let extra = remainder - baseAdd * numDays;

      distributeDays.forEach((day) => {
        let miles = parseInt(weekPlan[day]) || 0;
        miles += baseAdd;
        if (extra > 0) {
          miles += 1;
          extra -= 1;
        }
        weekPlan[day] = `${miles}`;
      });
    }

    // Calculate the true total miles for the week
    const getMiles = (val: string) => {
      if (!val) return 0;
      if (val === "Rest") return 0;
      if (val.startsWith("10K")) return 6;
      if (val.startsWith("Half")) return 13;
      const sw = speedWorkouts.find(sw => val.startsWith(sw.desc));
      if (sw) return sw.mileage;
      return parseInt(val) || 0;
    };

    // --- NEW: For half marathon week, cap all days at 6 miles except Sunday ---
    if (weekIndex === halfMarathonWeek) {
      Object.keys(weekPlan).forEach((day) => {
        if (
          weekPlan[day] !== "Rest" &&
          day !== "sunday" &&
          getMiles(weekPlan[day]) > 6
        ) {
          weekPlan[day] = "6";
        }
      });
    }

    // Special handling for the final week (taper, no Sat/Sun runs, max 5 miles/day)
    if (weekIndex === weeks - 1) {
      weekPlan.saturday = "Rest";
      weekPlan.sunday = "Rest";
      const maxDailyMileage = 5;
      let rem = weeklyMileage - speedWorkMileage;
      if (rem < 0) rem = 0;
      const runningDays = Object.keys(weekPlan).filter(
        (day) => weekPlan[day] === "Run"
      );
      runningDays.forEach((day, idx) => {
        let miles = Math.max(1, Math.min(Math.floor(rem / runningDays.length), maxDailyMileage));
        if (idx === runningDays.length - 1) {
          miles = Math.max(1, Math.min(rem, maxDailyMileage));
        }
        weekPlan[day] = `${miles}`;
        rem -= miles;
      });
    }

    const totalMiles =
      getMiles(weekPlan.monday) +
      getMiles(weekPlan.tuesday) +
      getMiles(weekPlan.wednesday) +
      getMiles(weekPlan.thursday) +
      getMiles(weekPlan.friday) +
      getMiles(weekPlan.saturday) +
      getMiles(weekPlan.sunday);

    return {
      week: `Week ${weekIndex + 1}`,
      monday: weekPlan.monday,
      tuesday: weekPlan.tuesday,
      wednesday: weekPlan.wednesday,
      thursday: weekPlan.thursday,
      friday: weekPlan.friday,
      saturday: weekPlan.saturday,
      sunday: weekPlan.sunday,
      total_miles: totalMiles,
    };
  });

  // Calculate the average mileage (including speed work)
  const calculatedAverage =
    tableData.reduce((sum, week) => sum + (week.total_miles || 0), 0) / weeks;

  return { tableData, calculatedAverage };
};