import React from 'react';
import './App.css';
import Pose from './components/Pose';
import Face from './components/Face';

interface Props {

}

interface State {

}

export default class App extends React.Component<Props, State>{
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Write some machine learning code!!!
        </header>
        <div className="app-body">
          {/* <Face /> */}
          <Pose />
        </div>
      </div>
    )
  }
}
