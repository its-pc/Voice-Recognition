import React, { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Voicecomponent = () => {
  const [isListening, setIsListening] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [bgColor, setBgColor] = useState('#ffffff')
  
  const commands = [
    {
      command: 'reset',
      callback: ({ resetTranscript }) => resetTranscript()
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    },
    {
      command: 'open *',
      callback: (site) => window.open(`https://${site}`, '_blank')
    },
    {
      command: 'increase text size',
      callback: () => setFontSize(prev => Math.min(prev + 4, 32))
    },
    {
      command: 'decrease text size',
      callback: () => setFontSize(prev => Math.max(prev - 4, 12))
    },
    {
      command: 'change background to *',
      callback: (color) => {
        const validColors = ['red', 'blue', 'green', 'white', 'yellow', 'orange', 'pink']
        if (validColors.includes(color.toLowerCase())) {
          setBgColor(color)
        }
      }
    },
    {
      command: 'start listening',
      callback: () => {
        SpeechRecognition.startListening({ continuous: true })
        setIsListening(true)
      }
    },
    {
      command: 'stop listening',
      callback: () => {
        SpeechRecognition.stopListening()
        setIsListening(false)
      }
    },
    {
      command: 'hello',
      callback: () => alert('Hello there! How can I help you?')
    },
    {
      command: 'thank you',
      callback: () => alert("You're welcome!")
    }
  ]

  const {
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
    listening
  } = useSpeechRecognition({ commands })

  useEffect(() => {
    setIsListening(listening)
  }, [listening])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container error">
        <h2>Browser Not Supported</h2>
        <p>Your browser does not support speech recognition. Please try Chrome or Edge.</p>
      </div>
    )
  }

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening()
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
    }
    setIsListening(!isListening)
  }

  return (
    <div className="container voice-component" style={{ backgroundColor: bgColor }}>
      <div className="voice-controls">
        <h2>Voice Recognition Application</h2>
        <div className="status">
          Status: {isListening ? 
            <span className="listening">Listening... 🎤</span> : 
            <span className="not-listening">Not Listening</span>}
        </div>
        <div className="buttons">
          <button 
            className={isListening ? "btn btn-danger" : "btn btn-success"}
            onClick={toggleListening}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button 
            className="btn btn-warning"
            onClick={resetTranscript}
          >
            Clear Text
          </button>
        </div>
      </div>
      
      <div 
        id="content"
        style={{ fontSize: `${fontSize}px` }}
        className="transcript"
      >
        {transcript || <p className="hint">Try saying: "Start listening", "Open google", or "Increase text size"</p>}
      </div>

      <div className="voice-commands">
        <h3>Available Voice Commands:</h3>
        <ul>
          <li>"Start listening" / "Stop listening"</li>
          <li>"Open [website]" (e.g., "Open google")</li>
          <li>"Increase text size" / "Decrease text size"</li>
          <li>"Change background to [color]"</li>
          <li>"Clear" / "Reset"</li>
        </ul>
      </div>
    </div>
  )
}

export default Voicecomponent