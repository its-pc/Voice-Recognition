// Firstcomponent.jsx
import React from 'react';
import { useHistory } from '../context/HistoryContext';

export default function FirstComponent() {
  const { history, clearHistory } = useHistory();

  const showWelcome = () => {
    const welcomeMsg = "Voice recognition app is ready! Click the microphone button to begin.";
    alert(welcomeMsg);
  };

  return (
    <div className="container first-component">
      <h2>Welcome to Enhanced Voice Recognition</h2>
      <div className="intro-text">
        <p>Speak naturally and watch your words appear with automatic corrections.</p>
      </div>
      <div className="buttons">
        <button className="btn btn-primary" onClick={showWelcome}>
          Get Started
        </button>
        {history.length > 0 && (
          <button className="btn btn-danger" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>
    </div>
  );
}