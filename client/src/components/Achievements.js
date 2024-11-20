import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import './Achievements.css';

function Achievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/achievements', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setAchievements(data))
      .catch(error => console.error('Error fetching achievements:', error));
  }, []);

  return (
    <div className="achievements-container">
      <Sidebar />
      <div className="achievements-content">
        <h1>Logros</h1>
        <div className="achievements-list">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <img src={achievement.image} alt={achievement.title} className="achievement-image" />
              <div className="achievement-details">
                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>
                <div className="achievement-progress">
                  <div className="progress-bar" style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}></div>
                  <span>{achievement.progress}/{achievement.target}</span>
                </div>
                <p className="achievement-points">{achievement.points} puntos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Achievements;