const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "fittrack-data.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function defaultData() {
  return {
    users: [
      { id: 1, name: "Demo User", email: "demo@fittrack.app", goal: "Build Strength" }
    ],
    workouts: []
  };
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const data = defaultData();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      return data;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (err) {
    console.error("Database read error:", err);
    return defaultData();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FitTrack API" });
});

app.get("/api/workouts", (req, res) => {
  const data = readDB();
  res.json([...data.workouts].reverse());
});

app.post("/api/workouts", (req, res) => {
  const { exercise, duration, calories } = req.body;
  if (!exercise) return res.status(400).json({ error: "Exercise is required" });

  const data = readDB();
  const workout = {
    id: Date.now(),
    userId: 1,
    exercise: String(exercise),
    duration: Number(duration) || 0,
    calories: Number(calories) || 0,
    completedAt: new Date().toISOString()
  };

  data.workouts.push(workout);
  writeDB(data);
  res.status(201).json(workout);
});

app.get("/api/stats", (req, res) => {
  const data = readDB();
  const workouts = data.workouts;
  res.json({
    workouts: workouts.length,
    minutes: workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: workouts.reduce((sum, w) => sum + (Number(w.calories) || 0), 0)
  });
});

app.post("/api/coach", (req, res) => {
  const goal = req.body.goal || "General Fitness";
  const level = req.body.level || "Beginner";

  let plan;
  if (goal === "Build Strength") {
    plan = level === "Beginner"
      ? ["3 strength sessions per week", "Start with bodyweight movements", "Use 1–2 rest days between hard sessions"]
      : ["3–4 strength sessions per week", "Progress reps or resistance gradually", "Keep at least 1 recovery day each week"];
  } else if (goal === "Lose Weight") {
    plan = ["Aim for regular movement most days", "Combine strength training with moderate cardio", "Prioritize balanced meals and adequate protein"];
  } else if (goal === "Improve Flexibility") {
    plan = ["10–15 minutes of mobility most days", "Use gentle controlled stretches", "Avoid bouncing or forcing a painful range"];
  } else {
    plan = ["Aim for 3 workouts per week", "Mix strength, cardio and mobility", "Increase activity gradually"];
  }

  res.json({
    title: `${goal} plan • ${level}`,
    plan,
    note: "This is rule-based educational guidance, not medical advice."
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FitTrack running at http://localhost:${PORT}`);
});
