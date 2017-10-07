import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from './components/TextField';
import TextBlock from './components/TextBlock';

class App extends Component {
  render() {
    return (
      <div>
       <div className="App-intro">
       Welcome to the Money Maker
       </div>
       <TextField/>
       <TextBlock/>
      </div>
    );
  }
}

export default App;
