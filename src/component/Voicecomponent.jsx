import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const Voicecomponent = () => {
  const commands = [
    {
      command: 'reset',
      callback:({resetTranscript})=>{
        resetTranscript();
      }
    },
    {
      command: 'clear',
      callback:({resetTranscript})=>{
        resetTranscript();
      }
    },
    {
        command:'open *',
        callback:(site)=>{window.open('http://'+ site)}
    },
    {
        command: 'increase text size',
        callback:()=>{document.getElementById('content').fontSize='24px'}
    },
    {
        command: 'decrease text size',
        callback:()=>{document.getElementById('content').fontSize='16px'}
    },
    {
        command: 'change text to *',
        callback:(color)=>{document.getElementById('content').style.Color=color}
    },
        
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ]
  SpeechRecognition.startListening({continuous: true,language:'en-IN'})
  const {transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands })
  if (!browserSupportsSpeechRecognition) {
    alert('Your browser is not supporting voice command')
    return null
  }
  return (
    <div className="container">
      
      <div className="nav">
        <h2>Applicaiton is Ready Please speak something...</h2>
      </div>
      <div id="content">
      {transcript}
      </div>   
    </div>
  )
}
export default Voicecomponent