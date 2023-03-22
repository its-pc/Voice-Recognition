import React from 'react'

export default function Firstcomponent() {
    function test()
    {
     alert("Hello how are you we all are ready!");
    }
  
    return (
    <div className="container">
    <h2>we have started a react application</h2>
    <button className="btn btn-success" onClick={test}>Processing</button>    </div>
  )
}
