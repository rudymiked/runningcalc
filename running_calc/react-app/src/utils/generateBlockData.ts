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