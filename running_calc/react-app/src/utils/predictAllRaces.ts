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

  type DistanceKeys = keyof IRacePredictions;
  const distances: { [K in DistanceKeys]: number } = {
    marathon: 26.2188,
    half: 13.1094,
    tenK: 6.21371,
    fiveK: 3.10686,
  };

  const predictions: { [K in DistanceKeys]?: number }[] = [];

  if (fiveK) {
    const sec = timeToSeconds(fiveK);
    predictions.push({
      marathon: sec * Math.pow(42.195 / 5, 1.06),
      half: sec * Math.pow(21.0975 / 5, 1.06),
      tenK: sec * Math.pow(10 / 5, 1.06),
      fiveK: sec,
    });
  }

  if (half) {
    const sec = timeToSeconds(half);
    predictions.push({
      marathon: sec * Math.pow(42.195 / 21.0975, 1.06),
      half: sec,
      tenK: sec * Math.pow(10 / 21.0975, 1.06),
      fiveK: sec * Math.pow(5 / 21.0975, 1.05),
    });
  }

  if (tenK) {
    const sec = timeToSeconds(tenK);
    predictions.push({
      marathon: sec * Math.pow(42.195 / 10, 1.06),
      half: sec * Math.pow(21.0975 / 10, 1.06),
      tenK: sec,
      fiveK: sec * Math.pow(5 / 10, 1.06),
    });
  }

  const summed: Record<DistanceKeys, number> = {
    marathon: 0,
    half: 0,
    tenK: 0,
    fiveK: 0,
  };

  const count: Record<DistanceKeys, number> = {
    marathon: 0,
    half: 0,
    tenK: 0,
    fiveK: 0,
  };

  predictions.forEach(pred => {
    for (const key of Object.keys(pred) as DistanceKeys[]) {
      summed[key] += pred[key]!;
      count[key]++;
    }
  });

  const averaged: IRacePredictions = {
    marathon: {
      time: count.marathon ? secondsToTime(summed.marathon / count.marathon) : "",
      pace: count.marathon ? paceFromSeconds(summed.marathon / count.marathon, distances.marathon) : "",
    },
    half: {
      time: count.half ? secondsToTime(summed.half / count.half) : "",
      pace: count.half ? paceFromSeconds(summed.half / count.half, distances.half) : "",
    },
    tenK: {
      time: count.tenK ? secondsToTime(summed.tenK / count.tenK) : "",
      pace: count.tenK ? paceFromSeconds(summed.tenK / count.tenK, distances.tenK) : "",
    },
    fiveK: {
      time: count.fiveK ? secondsToTime(summed.fiveK / count.fiveK) : "",
      pace: count.fiveK ? paceFromSeconds(summed.fiveK / count.fiveK, distances.fiveK) : "",
    },
  };

  return averaged;
};