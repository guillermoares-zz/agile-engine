import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import React from 'react';
import TransactionAccordion from "./components/transaction-accordion";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Transaction History
      </header>
      <TransactionAccordion />
    </div>
  );
}

export default App;