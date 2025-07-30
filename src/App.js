// App.js
import React from 'react';
import './App.css';
import Firstcomponent from './component/Firstcomponent';
import Voicecomponent from './component/Voicecomponent';
import {HistoryProvider} from './context/HistoryContext';

const App = () => {
  return (
    <HistoryProvider>
      <div className="App">
        <Firstcomponent />
        <Voicecomponent />
      </div>
    </HistoryProvider>
  );
};

export default App;