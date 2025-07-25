export interface IRaceTime {
  time: string;
  pace: string;
}

export interface IRacePredictions {
  marathon: IRaceTime;
  half: IRaceTime;
  tenK: IRaceTime;
  fiveK: IRaceTime;
}

export const predictAllRaces = (
  half: string,
  fiveK: string,
  tenK: string
): IRacePredictions => {
  const timeToSeconds = (t: string) => {
    if (!t) return 0;
    const [h, m, s] = t.split(":").map(Number);
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  };

  const secondsToTime = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.round(sec % 60);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const paceFromSeconds = (totalSec: number, miles: number): string => {
    const secondsPerMile = totalSec / miles;
    const paceMinutes = Math.floor(secondsPerMile / 60);
    const paceSeconds = Math.round(secondsPerMile % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}/mi`;
  };

  // --- Prediction using 5K ---
  if (fiveK) {
    const fiveKSec = timeToSeconds(fiveK);
    const tenKSec = fiveKSec * Math.pow(10 / 5, 1.06);
    const halfSec = fiveKSec * Math.pow(21.0975 / 5, 1.06);
    const marathonSec = fiveKSec * Math.pow(42.195 / 5, 1.06);

    return {
      marathon: {
        time: secondsToTime(marathonSec),
        pace: paceFromSeconds(marathonSec, 26.2188),
      },
      half: {
        time: secondsToTime(halfSec),
        pace: paceFromSeconds(halfSec, 13.1094),
      },
      tenK: {
        time: secondsToTime(tenKSec),
        pace: paceFromSeconds(tenKSec, 6.21371),
      },
      fiveK: {
        time: fiveK,
        pace: paceFromSeconds(fiveKSec, 3.10686),
      },
    };
  }

  // --- Prediction using Half Marathon ---
  if (half) {
    const halfSec = timeToSeconds(half);
    const fiveKSec = halfSec * Math.pow(5 / 21.0975, 1.05);
    const tenKSec = halfSec * Math.pow(10 / 21.0975, 1.06);
    const marathonSec = halfSec * Math.pow(42.195 / 21.0975, 1.06);

    return {
      marathon: {
        time: secondsToTime(marathonSec),
        pace: paceFromSeconds(marathonSec, 26.2188),
      },
      half: {
        time: half,
        pace: paceFromSeconds(halfSec, 13.1094),
      },
      tenK: {
        time: secondsToTime(tenKSec),
        pace: paceFromSeconds(tenKSec, 6.21371),
      },
      fiveK: {
        time: secondsToTime(fiveKSec),
        pace: paceFromSeconds(fiveKSec, 3.10686),
      },
    };
  }

  // --- Prediction using 10K ---
  if (tenK) {
    const tenKSec = timeToSeconds(tenK);
    const fiveKSec = tenKSec * Math.pow(5 / 10, 1.06);
    const halfSec = tenKSec * Math.pow(21.0975 / 10, 1.06);
    const marathonSec = tenKSec * Math.pow(42.195 / 10, 1.06);

    return {
      marathon: {
        time: secondsToTime(marathonSec),
        pace: paceFromSeconds(marathonSec, 26.2188),
      },
      half: {
        time: secondsToTime(halfSec),
        pace: paceFromSeconds(halfSec, 13.1094),
      },
      tenK: {
        time: tenK,
        pace: paceFromSeconds(tenKSec, 6.21371),
      },
      fiveK: {
        time: secondsToTime(fiveKSec),
        pace: paceFromSeconds(fiveKSec, 3.10686),
      },
    };
  }

  // --- Default fallback ---
  return {
    marathon: { time: "", pace: "" },
    half: { time: "", pace: "" },
    tenK: { time: "", pace: "" },
    fiveK: { time: "", pace: "" },
  };
};