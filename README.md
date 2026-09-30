# FitTrack

A professional, student-friendly full-stack fitness and wellness web application.

## Features
- Workout plans with detailed exercise instructions
- Sets, reps and rest guidance
- Complete & Log Workout flow
- Progress dashboard
- BMI calculator
- Rule-based Smart Coach
- REST-style JSON API
- Persistent local data storage

## Technology
- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express
- JSON file database (`fittrack-data.json`)

### Why JSON storage?
This student version avoids native database build tools so it can run easily on Windows without Python/node-gyp configuration. The JSON file acts as the application's local persistent data store. In a production deployment, this layer can be replaced by SQLite, PostgreSQL, or MySQL without changing the frontend API design.

## Run
1. Open this folder in VS Code.
2. Open Terminal → New Terminal.
3. Run:
   `npm install`
4. Run:
   `npm start`
5. Open:
   `http://localhost:3000`

The first successful server start creates `fittrack-data.json` automatically.

## API
- GET `/api/health`
- GET `/api/workouts`
- POST `/api/workouts`
- GET `/api/stats`
- POST `/api/coach`

## Presentation note
Smart Coach is a small rule-based assistant. It is not an LLM or autonomous agent.
