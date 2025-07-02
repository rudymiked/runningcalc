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