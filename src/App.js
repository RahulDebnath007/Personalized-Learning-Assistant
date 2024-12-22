import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [time, setTime] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  // List of available subjects
  const subjectsList = [
    "Math",
    "Science",
    "History",
    "English",
    "Computer Science",
    "Economics",
    "Geography",
    "Psychology",
    "Philosophy",
    "Art",
    "Music",
    "Languages",
    "Health & Fitness",
  ];

  // Handle checkbox selection
  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubjects((prevSelectedSubjects) =>
      prevSelectedSubjects.includes(subject)
        ? prevSelectedSubjects.filter((s) => s !== subject)
        : [...prevSelectedSubjects, subject]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecommendations([]);

    if (selectedSubjects.length === 0 || !time || time <= 0) {
      setError("Please select at least one subject and enter valid study time.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/recommend", {
        subjects: selectedSubjects,
        time: parseFloat(time),
      });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError("Error fetching recommendations. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1 className="app-title">Personalized Learning Assistant</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <label className="form-label">Select Subjects:</label>
        <div className="checkbox-container">
          {subjectsList.map((subject) => (
            <div key={subject} className="checkbox-group">
              <input
                type="checkbox"
                id={subject}
                value={subject}
                onChange={handleSubjectChange}
                checked={selectedSubjects.includes(subject)}
                className="checkbox-input"
              />
              <label htmlFor={subject} className="checkbox-label">{subject}</label>
            </div>
          ))}
        </div>

        <label className="form-label">Total Study Time (in hours):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 4"
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">Get Recommendations</button>
      </form>

      {error && <p className="error">{error}</p>}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2 className="recommendations-title">Recommendations:</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
