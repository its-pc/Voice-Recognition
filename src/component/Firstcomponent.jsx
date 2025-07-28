import React from 'react'

export default function Firstcomponent() {
    function test() {
        alert("Voice recognition app is ready! Click the 'Start Listening' button to begin.");
    }
  
    return (
        <div className="container first-component">
            <h2>Welcome to our React Voice Recognition App</h2>
            <button className="btn btn-primary" onClick={test}>
                Click Me
            </button>
        </div>
    )
}