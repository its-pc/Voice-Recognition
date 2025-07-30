// HistoryContext.js
import React, { createContext, useState, useContext } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [recordings, setRecordings] = useState([]);

  const addToHistory = (command, result) => {
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        command,
        result
      },
      ...prev
    ].slice(0, 50)); // Keep only the last 50 items
  };

  const addRecording = (transcript) => {
    if (transcript.trim()) {
      setRecordings(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          transcript
        },
        ...prev
      ].slice(0, 20)); // Keep only the last 20 items
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setRecordings([]);
  };

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  const deleteCommand = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ 
      history, 
      recordings, 
      addToHistory, 
      addRecording, 
      clearHistory,
      deleteRecording,
      deleteCommand
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);