import React from 'react';
import './App.css';
import Pose from './components/Pose';
import Face from './components/Face';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'

interface Props {

}

interface State {

}

export default class App extends React.Component<Props, State>{
  render() {
    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <NavLink to="/"><h5>Pose-Net</h5></NavLink>
            <NavLink to="/face"><h5>Face-Api</h5></NavLink>
          </header>
          <div className="app-body">
            <Switch>
              <Route path="/" exact component={Pose} />
              <Route path="/face" exact component={Pose} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
