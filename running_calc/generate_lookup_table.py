import json
from collections import OrderedDict  # Import OrderedDict

# Original data points (reference marathon times and corresponding paces)
original_times = ["2:45", "2:50", "2:56", "3:03", "3:10"]
original_paces = OrderedDict({  # Use OrderedDict to preserve order
    "Recovery": [7.50, 8.00, 8.50, 8.75, 9.00],
    "Easy": [7.25, 7.50, 8.00, 8.33, 8.70],
    "Medium": [6.50, 7.00, 7.50, 8.00, 8.33],
    "Mile": [5.13, 5.33, 5.42, 5.50, 5.70],
    "5k": [5.50, 5.70, 5.90, 6.13, 6.38],
    "10k": [5.83, 5.95, 6.15, 6.40, 6.65],
    "Half": [5.92, 6.22, 6.43, 6.70, 6.95],
    "Marathon": [6.28, 6.50, 6.75, 7.00, 7.25],
})

# Convert time string to minutes
def time_to_minutes(time):
    hour, minute = map(int, time.split(":"))
    return hour * 60 + minute

# Calculate paces for any marathon time
def calculate_paces(original_times, original_paces, marathon_time):
    marathon_minutes = time_to_minutes(marathon_time)
    original_minutes = [time_to_minutes(t) for t in original_times]

    calculated_paces = OrderedDict()  # Use OrderedDict to preserve order
    for pace_type, row in original_paces.items():
        # Find the two closest reference times for interpolation
        for i in range(len(original_minutes) - 1):
            if original_minutes[i] <= marathon_minutes <= original_minutes[i + 1]:
                # Perform linear interpolation
                t1, t2 = original_minutes[i], original_minutes[i + 1]
                p1, p2 = row[i], row[i + 1]
                adjustment_factor = (marathon_minutes - t1) / (t2 - t1)
                interpolated_value = p1 + (p2 - p1) * adjustment_factor
                calculated_paces[pace_type] = round(interpolated_value, 2)
                break
        else:
            # Extrapolate if outside the range
            if marathon_minutes < original_minutes[0]:
                calculated_paces[pace_type] = round(row[0] * (marathon_minutes / original_minutes[0]), 2)
            elif marathon_minutes > original_minutes[-1]:
                calculated_paces[pace_type] = round(row[-1] * (marathon_minutes / original_minutes[-1]), 2)

    return calculated_paces

# Generate lookup table dynamically
def generate_lookup_table(marathon_time):
    # Ensure marathon_time is valid and calculate paces
    calculated_paces = calculate_paces(original_times, original_paces, marathon_time)

    lookup_table = OrderedDict({  # Use OrderedDict to preserve order
        "marathon_time": marathon_time,
        "paces": calculated_paces,
    })

    return lookup_table