// Youssef Selkani
// 2019

import React, { Component } from 'react';
import './App.css';
import fire from './config/Fire';
import { Container, } from 'semantic-ui-react';
import Home from './routes/Home';
import Dashboard from './routes/Dashboard';
import OTP from './routes/OTP';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      loggedIn: null,
      loggedOut: null,
      loading: true
    }
  }

  componentWillMount = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true, loggedOut: false, loading: false });
      }
      else {
        this.setState({ loggedIn: false, loggedOut: true, loading: false });
      }
    });
  }

  render() {
    return (
      <Router>
        <Container className="App">
          <Route path="/" exact component={Home} />

          <div>
            <Route path="/dashboard/" component={Dashboard} />
            <Route path="/otp/" component={OTP} />
          </div>


        </Container>
      </Router>
    );
  }
}

export default App;
