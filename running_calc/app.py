import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from generate_lookup_table import generate_lookup_table  # Import the function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/api/data", methods=["GET"])
def get_data():
    # Example data
    marathon_times = [f"{hour}:{minute:02d}" for hour in range(2, 6) for minute in range(0, 60, 5)]
    days_per_week = [i for i in range(3, 8)]
    average_mileage = [i for i in range(25, 105, 5)]
    maximum_mileage = [i for i in range(25, 125, 5)]
    weeks = [i for i in range(16, 21)]

    return jsonify({
        "marathon_times": marathon_times,
        "days_per_week": days_per_week,
        "average_mileage": average_mileage,
        "maximum_mileage": maximum_mileage,
        "weeks": weeks
    })

@app.route("/api/paces", methods=["POST"])
def get_lookup_table():
    # Get the marathon time from the request body
    data = request.get_json()
    marathon_time = data.get("marathon_time")

    if not marathon_time:
        return jsonify({"error": "Marathon time is required"}), 400
    
    print(f"Received marathon_time: {marathon_time}")  # Debugging log

    # Generate the lookup table using the provided marathon time
    lookup_table = generate_lookup_table(marathon_time)

    print(f"Generated lookup table: {lookup_table}")  # Debugging log

    # Serialize the OrderedDict to JSON with sort_keys=False to preserve order
    response = json.loads(json.dumps(lookup_table, sort_keys=False))

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)