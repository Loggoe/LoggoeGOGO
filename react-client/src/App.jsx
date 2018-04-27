import {BrowserRouter as Router, Route, Link, Switch, History} from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PrivateRoute from './components/router/PrivateRoute.jsx';
import LandingPage from './components/LandingPageView.jsx';
import RegistrationPage from './components/RegistrationPageView.jsx';
import StudentHomepage from './components/StudentHomepageView.jsx';
import StudentVideo from './components/StudentVideoView.jsx';
import OwnerHomepage from './components/OwnerHomepageView.jsx';
import OwnerVideo from './components/OwnerVideoView.jsx';
import OwnerBuildSeriesView from './components/OwnerBuildSeriesView.jsx';

import Auth from './utils/auth.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfoLoaded: false
    }
  }

  componentDidMount() {
    Auth.getInfo()
      .then(res => {
        this.setState({
          userInfoLoaded: true
        })
      });
  }

  render () {
    if (!this.state.userInfoLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <MuiThemeProvider>
        <Router>
          <Switch>
            <Route
              exact path="/"
              component={LandingPage}/>
            <Route
              exact path="/registration"
              component={RegistrationPage}/>
            <PrivateRoute
              exact path="/student"
              component={StudentHomepage}/>
            <PrivateRoute
              exact path="/student/video"
              component={StudentVideo}/>
            <PrivateRoute
              exact path="/owner"
              component={OwnerHomepage}/>
            <PrivateRoute
              exact path="/owner/video"
              component={OwnerVideo}/>
            <PrivateRoute
              exact path="/owner/build"
              component={OwnerBuildSeriesView}/>
          </Switch>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default DragDropContext(HTML5Backend)(App);