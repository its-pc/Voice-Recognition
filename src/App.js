import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import './App.css'
import Voicecomponent from './component/Voicecomponent';
const App = () => {
  return (
    <>
    
    <Voicecomponent/> 
    <br>
    </br>
    <button className='btn btn-success'>processing</button>
    
    </>
  )
}
export default App