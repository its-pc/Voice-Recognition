import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useHistory } from '../context/HistoryContext';
import { spellCheck } from '../utils/spellCheck';
import { suggestCommands } from '../utils/commandHelper';

const Voicecomponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [bgColor, setBgColor] = useState('#f5f5f5');
  const [textColor, setTextColor] = useState('#333333');
  const [correctedTranscript, setCorrectedTranscript] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState('Ready to start');
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('recordings');
  
  const { 
    history, 
    recordings, 
    addToHistory, 
    addRecording, 
    clearHistory,
    deleteRecording,
    deleteCommand 
  } = useHistory();
  const transcriptEndRef = useRef(null);

  const colorThemes = [
    { name: 'light', bg: '#f5f5f5', text: '#333333' },
    { name: 'dark', bg: '#333333', text: '#ffffff' },
    { name: 'blue', bg: '#e6f2ff', text: '#003366' },
    { name: 'green', bg: '#e6ffe6', text: '#006600' },
    { name: 'red', bg: '#ffebee', text: '#b71c1c' },
    { name: 'purple', bg: '#f3e5f5', text: '#4a148c' }
  ];

  const commands = [
    {
      command: 'reset',
      callback: ({ resetTranscript }) => {
        resetTranscript();
        setCorrectedTranscript('');
        addToHistory('reset', 'Cleared all text');
        setRecordingStatus('Text cleared');
      }
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => {
        resetTranscript();
        setCorrectedTranscript('');
        addToHistory('clear', 'Cleared all text');
        setRecordingStatus('Text cleared');
      }
    },
    {
      command: 'open *',
      callback: (site) => {
        const url = site.includes('.') ? `https://${site}` : `https://${site}.com`;
        window.open(url, '_blank');
        addToHistory(`open ${site}`, `Opened ${url}`);
        setRecordingStatus(`Opened ${site}`);
      }
    },
    {
      command: 'increase text size',
      callback: () => {
        setFontSize(prev => Math.min(prev + 2, 24));
        addToHistory('increase text size', 'Text size increased');
        setRecordingStatus('Text size increased');
      }
    },
    {
      command: 'decrease text size',
      callback: () => {
        setFontSize(prev => Math.max(prev - 2, 12));
        addToHistory('decrease text size', 'Text size decreased');
        setRecordingStatus('Text size decreased');
      }
    },
    {
      command: 'change theme to *',
      callback: (theme) => {
        const selectedColor = colorThemes.find(c => c.name.toLowerCase() === theme.toLowerCase());
        if (selectedColor) {
          setBgColor(selectedColor.bg);
          setTextColor(selectedColor.text);
          addToHistory(`change theme to ${theme}`, `Theme changed to ${theme}`);
          setRecordingStatus(`Changed to ${theme} theme`);
        }
      }
    },
    {
      command: 'start listening',
      callback: () => {
        resetTranscript();
        setCorrectedTranscript('');
        SpeechRecognition.startListening({ continuous: true });
        setIsListening(true);
        addToHistory('start listening', 'Recording started');
        setRecordingStatus('Listening...');
      }
    },
    {
      command: 'stop listening',
      callback: () => {
        SpeechRecognition.stopListening();
        setIsListening(false);
        if (correctedTranscript.trim()) {
          addRecording(correctedTranscript);
        }
        addToHistory('stop listening', 'Recording saved');
        setRecordingStatus('Ready to start');
      }
    },
    {
      command: 'hello',
      callback: () => {
        alert('Hello there! How can I help you?');
        addToHistory('hello', 'Displayed greeting');
        setRecordingStatus('Greeted user');
      }
    },
    {
      command: 'thank you',
      callback: () => {
        alert("You're welcome!");
        addToHistory('thank you', 'Displayed response');
        setRecordingStatus('Thanked user');
      }
    },
    {
      command: 'show history',
      callback: () => {
        setShowHistory(true);
        setActiveTab('recordings');
        addToHistory('show history', 'Viewed recordings');
        setRecordingStatus('Showed recordings');
      }
    },
    {
      command: 'what can I say',
      callback: () => {
        const commandList = commands
          .filter(cmd => typeof cmd.command === 'string')
          .map(cmd => `• ${cmd.command}`)
          .join('\n');
        alert(`Available commands:\n\n${commandList}`);
        addToHistory('what can I say', 'Displayed command list');
        setRecordingStatus('Listed commands');
      }
    }
  ];

  const {
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
    listening
  } = useSpeechRecognition({ commands });

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      if (correctedTranscript.trim()) {
        addRecording(correctedTranscript);
      }
      addToHistory('stop listening', 'Recording saved');
      setRecordingStatus('Ready to start');
    } else {
      resetTranscript();
      setCorrectedTranscript('');
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      addToHistory('start listening', 'Recording started');
      setRecordingStatus('Listening...');
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    setIsListening(listening);
    if (listening) {
      setRecordingStatus('Listening...');
    } else if (transcript) {
      setRecordingStatus('Processing...');
    }
  }, [listening, transcript]);

  useEffect(() => {
    if (transcript) {
      const corrected = spellCheck(transcript);
      setCorrectedTranscript(corrected);
      setSuggestions(suggestCommands(corrected));
      scrollToBottom();
    }
  }, [transcript]);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderHistoryModal = () => (
    <div className="history-modal">
      <div className="modal-backdrop" onClick={() => setShowHistory(false)}></div>
      <div className="modal-content">
        <div className="history-header">
          <h3>Recording History</h3>
          <button className="btn-close" onClick={() => setShowHistory(false)}>
            ×
          </button>
        </div>
        <div className="history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'commands' ? 'active' : ''}`}
            onClick={() => setActiveTab('commands')}
          >
            Commands
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            Recordings
          </button>
        </div>
        <div className="history-content">
          {activeTab === 'commands' ? (
            history.length > 0 ? (
              <ul className="history-list">
                {history.map(item => (
                  <li key={item.id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-time">{item.timestamp}</span>
                      <button 
                        className="btn-delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCommand(item.id);
                        }}
                        aria-label="Delete command"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div className="history-details">
                      <span className="history-command">
                        <strong>Command:</strong> {item.command}
                      </span>
                      <span className="history-result">
                        <strong>Result:</strong> {item.result}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-history">
                <p>No command history yet</p>
              </div>
            )
          ) : (
            recordings.length > 0 ? (
              <ul className="recordings-list">
                {recordings.map(recording => (
                  <li key={recording.id} className="recording-item">
                    <div className="recording-item-header">
                      <span className="recording-time">{recording.timestamp}</span>
                      <button 
                        className="btn-delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecording(recording.id);
                        }}
                        aria-label="Delete recording"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div className="recording-text">
                      {recording.transcript}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-recordings">
                <p>No recordings yet. Start speaking to create recordings!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container error">
        <h2>Browser Not Supported</h2>
        <p>Your browser does not support speech recognition. Please try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="container voice-component" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="voice-controls">
        <h2>Voice Recognition App</h2>
        <div className="status">
          <div className="status-message">
            <span className={`status-indicator ${isListening ? 'listening' : ''}`}></span>
            Status: {recordingStatus}
          </div>
          <div className="sound-wave" style={{ opacity: isListening ? 1 : 0 }}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className="buttons">
          <button 
            className={`btn ${isListening ? 'btn-danger' : 'btn-success'}`}
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <>
                <span className="icon-stop"></span> Stop
              </>
            ) : (
              <>
                <span className="icon-mic"></span> Start
              </>
            )}
          </button>
          
          <button 
            className="btn btn-warning"
            onClick={() => {
              resetTranscript();
              setCorrectedTranscript('');
              addToHistory('clear', 'Cleared all text');
              setRecordingStatus('Text cleared');
            }}
          >
            <span className="icon-clear"></span> Clear
          </button>
          
          <button 
            className="btn btn-info"
            onClick={() => {
              setShowHistory(true);
              setActiveTab('recordings');
              addToHistory('show history', 'Viewed recordings');
              setRecordingStatus('Showed recordings');
            }}
          >
            <span className="icon-history"></span> Recordings
          </button>
        </div>
      </div>
      
      <div 
        id="content"
        style={{ fontSize: `${fontSize}px` }}
        className="transcript"
      >
        {correctedTranscript || (
          <p className="hint">Try saying: "Start listening", "Open wikipedia", or "Change theme to dark"</p>
        )}
        <div ref={transcriptEndRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <h4>Did you mean:</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="voice-commands">
        <h3>Available Voice Commands:</h3>
        <ul>
          <li>"Start listening" / "Stop listening"</li>
          <li>"Open [website]" (e.g., "Open wikipedia")</li>
          <li>"Increase text size" / "Decrease text size"</li>
          <li>"Change theme to [color]" (light, dark, blue, green, red, purple)</li>
          <li>"Clear" / "Reset"</li>
          <li>"Show history"</li>
          <li>"What can I say" - List all commands</li>
          <li>"Hello" / "Thank you"</li>
        </ul>
      </div>

      <div className="theme-selector">
        <h4>Quick Theme Selector:</h4>
        <div className="theme-buttons">
          {colorThemes.map((color) => (
            <button
              key={color.name}
              className="theme-btn"
              style={{ 
                backgroundColor: color.bg, 
                color: color.text,
                border: bgColor === color.bg ? '2px solid #4a6fa5' : 'none'
              }}
              onClick={() => {
                setBgColor(color.bg);
                setTextColor(color.text);
                addToHistory(`change theme to ${color.name}`, `Theme changed to ${color.name}`);
                setRecordingStatus(`Changed to ${color.name} theme`);
              }}
              aria-label={`Change to ${color.name} theme`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {showHistory && renderHistoryModal()}
    </div>
  );
};

export default Voicecomponent;