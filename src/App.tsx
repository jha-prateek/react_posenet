import React from 'react';
import './App.css';
import Pose from './components/Pose'

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
          <Pose />
        </div>
      </div>
    )
  }
}
