from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    # Generate marathon time options (5-minute increments from 2:00 to 6:00)
    marathon_times = [f"{hour}:{minute:02d}" for hour in range(2, 7) for minute in range(0, 60, 5)]
    
    # Options for days per week
    days_per_week = [i for i in range(3, 8)]
    
    # Options for average mileage
    average_mileage = [i for i in range(25, 105, 5)]
    
    # Options for maximum mileage
    maximum_mileage = [i for i in range(25, 125, 5)]
    
    # Options for number of weeks
    weeks = [i for i in range(16, 21)]
    
    # Initialize table data
    table_data = None

    if request.method == "POST":
        # Get the selected number of weeks from the form
        selected_weeks = int(request.form.get("weeks", 0))
        
        # Generate table data based on the number of weeks
        table_data = [
            {
                "week": f"Week {i + 1}",
                "monday": "Rest",
                "tuesday": "Run",
                "wednesday": "Cross-train",
                "thursday": "Run",
                "friday": "Rest",
                "saturday": "Long Run",
                "sunday": "Recovery Run"
            }
            for i in range(selected_weeks)
        ]
    
    return render_template(
        "home.html",
        marathon_times=marathon_times,
        days_per_week=days_per_week,
        average_mileage=average_mileage,
        maximum_mileage=maximum_mileage,
        weeks=weeks,
        table_data=table_data
    )

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/calculators")
def calculators():
    return render_template("calculators.html")

if __name__ == "__main__":
    app.run(debug=True)