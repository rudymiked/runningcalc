// Function to predict marathon time based on input times
export const predictMarathonTime = (halfMarathonTime: string, fiveKTime: string, tenKTime: string) => {
    let marathonMinutes = 0;
    let halfMarathonPredictionInMinutes = 0;
    let fiveKPredictionInMinutes = 0;
    let tenKPredictionInMinutes = 0;

    // Convert time string (e.g., "1:30:45") to seconds
    const timeToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    };

    // Predict marathon time based on half marathon time
    if (halfMarathonTime) {
        const halfSeconds = timeToSeconds(halfMarathonTime);
        halfMarathonPredictionInMinutes = (halfSeconds / 60) * 2 + 10; // Approximation factor
    }

    // Predict marathon time based on 5K time
    if (fiveKTime) {
        const fiveKSeconds = timeToSeconds(fiveKTime);
        //fiveKPredictionInMinutes = (fiveKSeconds / 60) * 8.87; // Approximation from Riegel formula

        const vdot = estimateVDOT(fiveKSeconds);
        const marathonSeconds = predictMarathonTimeBy5k(vdot);

        fiveKPredictionInMinutes = marathonSeconds / 60; // Convert seconds to minutes

    }

    // Predict marathon time based on 10K time
    if (tenKTime) {
        const tenKSeconds = timeToSeconds(tenKTime);
        tenKPredictionInMinutes = (tenKSeconds / 60) * 4.5; // Approximation factor
    }

    // Calculate the average of the predictions
    if (halfMarathonPredictionInMinutes === 0 && fiveKPredictionInMinutes === 0 && tenKPredictionInMinutes === 0) {
        return "Please enter at least one time.";
    } else {
        marathonMinutes = (halfMarathonPredictionInMinutes + fiveKPredictionInMinutes + tenKPredictionInMinutes) /
            (Number(halfMarathonPredictionInMinutes > 0) + Number(fiveKPredictionInMinutes > 0) + Number(tenKPredictionInMinutes > 0));
    }

    // Convert minutes back to "hours:minutes" format
    const hours = Math.floor(marathonMinutes / 60);
    const minutes = Math.round(marathonMinutes % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const estimateVDOT = (seconds5K: number): number => {
    if (seconds5K <= 900) return 62;     // sub-15:00
    if (seconds5K <= 905) return 61.5;
    if (seconds5K <= 910) return 61;
    if (seconds5K <= 915) return 60.5;
    if (seconds5K <= 920) return 60;     // 16:00
    if (seconds5K <= 925) return 59.5;
    if (seconds5K <= 930) return 59;
    if (seconds5K <= 935) return 58.5;
    if (seconds5K <= 940) return 58;     // 17:00
    if (seconds5K <= 945) return 57.5;
    if (seconds5K <= 950) return 57;
    if (seconds5K <= 955) return 56.5;
    if (seconds5K <= 960) return 56;     // 18:00
    if (seconds5K <= 965) return 55.5;
    if (seconds5K <= 970) return 55;
    if (seconds5K <= 975) return 54.5;
    if (seconds5K <= 980) return 54;
    if (seconds5K <= 985) return 53.5;
    if (seconds5K <= 990) return 53;     // 19:00
    if (seconds5K <= 995) return 52.5;
    if (seconds5K <= 1000) return 52;
    if (seconds5K <= 1005) return 51.5;
    if (seconds5K <= 1010) return 51;
    if (seconds5K <= 1015) return 50.5;
    if (seconds5K <= 1020) return 50;    // 20:00
    if (seconds5K <= 1025) return 49.5;
    if (seconds5K <= 1030) return 49;
    if (seconds5K <= 1035) return 48.5;
    if (seconds5K <= 1040) return 48;    // 21:00
    if (seconds5K <= 1045) return 47.5;
    if (seconds5K <= 1050) return 47;
    if (seconds5K <= 1055) return 46.5;
    if (seconds5K <= 1060) return 46;    // 22:00
    if (seconds5K <= 1065) return 45.5;
    if (seconds5K <= 1070) return 45;
    if (seconds5K <= 1075) return 44.5;
    if (seconds5K <= 1080) return 44;    // 23:00
    if (seconds5K <= 1085) return 43.5;
    if (seconds5K <= 1090) return 43;
    if (seconds5K <= 1095) return 42.5;
    if (seconds5K <= 1100) return 42;    // 24:00
    if (seconds5K <= 1105) return 41.5;
    if (seconds5K <= 1110) return 41;
    if (seconds5K <= 1115) return 40.5;
    if (seconds5K <= 1120) return 40;    // 25:00
    if (seconds5K <= 1125) return 39.5;
    if (seconds5K <= 1130) return 39;
    if (seconds5K <= 1135) return 38.5;
    if (seconds5K <= 1140) return 38;    // 26:00
    if (seconds5K <= 1145) return 37.5;
    if (seconds5K <= 1150) return 37;
    if (seconds5K <= 1155) return 36.5;
    if (seconds5K <= 1160) return 36;    // 27:00
    if (seconds5K <= 1165) return 35.5;
    if (seconds5K <= 1170) return 35;
    if (seconds5K <= 1175) return 34.5;
    if (seconds5K <= 1180) return 34;    // 28:00
    if (seconds5K <= 1185) return 33.5;
    if (seconds5K <= 1190) return 33;
    if (seconds5K <= 1195) return 32.5;
    if (seconds5K <= 1200) return 32;    // 29:00
    if (seconds5K <= 1205) return 31.5;
    if (seconds5K <= 1210) return 31;
    if (seconds5K <= 1215) return 30.5;
    if (seconds5K <= 1220) return 30;    // 30:00
    if (seconds5K <= 1225) return 29.5;
    if (seconds5K <= 1230) return 29;
    if (seconds5K <= 1235) return 28.5;
    if (seconds5K <= 1240) return 28;    // 31:00
    if (seconds5K <= 1245) return 27.5;
    if (seconds5K <= 1250) return 27;
    if (seconds5K <= 1255) return 26.5;
    if (seconds5K <= 1260) return 26;    // 32:00
    return 24;                            // 32:01 and above
};

// Map VDOT to estimated marathon time (in seconds)
const predictMarathonTimeBy5k = (vdot: number): number => {
    const vdotToMarathonSeconds: Record<number, number> = {
        62: 9120,   // 2:32:00
        61.5: 9180,
        61: 9240,
        60.5: 9300,
        60: 9360,   // 2:36:00
        59.5: 9420,
        59: 9480,
        58.5: 9540,
        58: 9600,   // 2:40:00
        57.5: 9660,
        57: 9720,
        56.5: 9780,
        56: 9840,   // 2:44:00
        55.5: 9900,
        55: 9960,
        54.5: 10020,
        54: 10080,  // 2:48:00
        53.5: 10140,
        53: 10200,
        52.5: 10260,
        52: 10320,  // 2:52:00
        51.5: 10380,
        51: 10440,
        50.5: 10500,
        50: 10560,  // 2:56:00
        49.5: 10620,
        49: 10680,
        48.5: 10740,
        48: 10800,  // 3:00:00
        47.5: 10860,
        47: 10920,
        46.5: 10980,
        46: 11040,  // 3:04:00
        45.5: 11100,
        45: 11160,
        44.5: 11220,
        44: 11280,  // 3:08:00
        43.5: 11340,
        43: 11400,
        42.5: 11460,
        42: 11520,  // 3:12:00
        41.5: 11580,
        41: 11640,
        40.5: 11700,
        40: 11760,  // 3:16:00
        39.5: 11820,
        39: 11880,
        38.5: 11940,
        38: 12000,  // 3:20:00
        37.5: 12060,
        37: 12120,
        36.5: 12180,
        36: 12240,  // 3:24:00
        35.5: 12300,
        35: 12360,
        34.5: 12420,
        34: 12480,  // 3:28:00
        33.5: 12540,
        33: 12600,
        32.5: 12660,
        32: 12720,  // 3:32:00
        31.5: 12780,
        31: 12840,
        30.5: 12900,
        30: 12960,  // 3:36:00
        29.5: 13020,
        29: 13080,
        28.5: 13140,
        28: 13200,  // 3:40:00
        27.5: 13260,
        27: 13320,
        26.5: 13380,
        26: 13440   // 3:44:00
    };
    return vdotToMarathonSeconds[vdot] || 0;
};