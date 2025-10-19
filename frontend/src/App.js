// src/App.js
import React, { useState } from 'react';
import './styles.css';
import TrialCheckForm from './components/TrialCheckForm';
import InteractionForm from './components/InteractionForm';
import ResultCard from './components/ResultCard';
import BottleChatbot from './components/BottleChatbot';
import './components/ResultCard.css'; 

function App() {
  const [activeTab, setActiveTab] = useState('trial'); // 'trial' or 'interaction' 
  const [trialResult, setTrialResult] = useState(null);
  const [interactResult, setInteractResult] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>
          MedCheck
          <span className="logo-icon">
            <i className="fas fa-prescription-bottle-medical"></i>
          </span>
        </h1>
        <p className="subtitle">
          verify clinical trial representation and medication–supplement interactions.
        </p>
      </header>

      {/* tab buttons */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'trial' ? 'active' : ''}`}
          onClick={() => setActiveTab('trial')}
        >
          Clinical Trial Representation
        </button>
        <button
          className={`tab-btn ${activeTab === 'interaction' ? 'active' : ''}`}
          onClick={() => setActiveTab('interaction')}
        >
          Drug-Supplement Interactions
        </button>
        <button
          className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          Drug-Supplement Tracking
        </button>
      </div>

      {/* tab content */}
      <main>
        {activeTab === 'trial' && (
          <section className="card">
            <h2>Clinical Trial Representation</h2>
            <TrialCheckForm setResult={setTrialResult} />
            {trialResult && <ResultCard data={trialResult} />}
          </section>
        )}

        {activeTab === 'interaction' && (
          <section className="card">
            <h2>Drug–Supplement Interactions</h2>
            <InteractionForm setResult={setInteractResult} />
            {interactResult && <ResultCard data={interactResult} />}
          </section>
        )}

        {activeTab === 'tracker' && (
          <section className="card">
            <h2>Drug-Supplement Tracking</h2>
          </section>
        )}
      </main>

      <BottleChatbot />

      <footer>
        <small>
          Not a professional medical service. Consult your clinician for personalized advice.
        </small>
      </footer>
    </div>
  );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
