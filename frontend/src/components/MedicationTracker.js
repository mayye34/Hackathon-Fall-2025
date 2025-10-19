import React, { useState, useEffect } from "react";
import "./MedicationTracker.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MedicationTracker() {
  const [medications, setMedications] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const [inputValue, setInputValue] = useState("");
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [time, setTime] = useState("");      // ✅ added
  const [email, setEmail] = useState("");    // ✅ added

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("medTracker");
    if (saved) setMedications(JSON.parse(saved));
  }, []);

  // ✅ Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("medTracker", JSON.stringify(medications));
  }, [medications]);

  const addMedication = async () => {
    if (!inputValue.trim() || !email || !time) return;

    // 1️⃣ Update UI immediately
    setMedications(prev => ({
      ...prev,
      [selectedDay]: [
        ...prev[selectedDay],
        { name: inputValue.trim(), taken: false, time },
      ],
    }));

    // Save current med name before clearing input
    const medName = inputValue.trim();
    setInputValue("");

    // 2️⃣ Call backend to schedule reminder
    try {
      const resp = await fetch("http://localhost:5002/setReminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          medName,
          time,
          days: [selectedDay.substring(0, 3).toUpperCase()],
        }),
      });
      const data = await resp.json();
      console.log("Reminder response:", data);
      if (data.message) alert(`Remind created: ${data.message}`);
    } catch (err) {
      console.error("Failed to set reminder:", err);
    }
  };

  const toggleTaken = (day, index) => {
    setMedications(prev => ({
      ...prev,
      [day]: prev[day].map((med, i) =>
        i === index
          ? {
              ...med,
              taken: !med.taken,
              timestamp: !med.taken
                ? new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
            }
          : med
      ),
    }));
  };

  const removeMedication = (day, index) => {
    setMedications(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="tracker">
      <h3>Weekly Medication Tracker</h3>

      {/* Add new medication */}
      <div className="tracker-add">
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {days.map(day => (
            <option key={day}>{day}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Medication name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={addMedication}>Add</button>
      </div>

      {/* Day-by-day list */}
      <div className="tracker-table">
        {days.map(day => (
          <div key={day} className="tracker-day">
            <h4>{day}</h4>
            {medications[day].length === 0 ? (
              <p className="empty">No meds added</p>
            ) : (
              <ul>
                {medications[day].map((med, i) => (
                  <li key={i} className={med.taken ? "taken" : ""}>
                    <label className="med-item">
                      <input
                        type="checkbox"
                        checked={med.taken}
                        onChange={() => toggleTaken(day, i)}
                      />
                      <span>{med.name}</span>
                    </label>

                    <div className="med-actions">
                      {med.timestamp && (
                        <span className="timestamp">Taken at {med.timestamp}</span>
                      )}
                      <button
                        className="remove"
                        onClick={() => removeMedication(day, i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
