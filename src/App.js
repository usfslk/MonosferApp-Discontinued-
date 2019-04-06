// Youssef Selkani
// 2019

import React, { Component } from 'react';
import './App.css';
import fire from './config/Fire';
import { Container, } from 'semantic-ui-react';
import Home from './routes/Home';
import Dashboard from './routes/Dashboard';

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
      <Container className="App">

        {this.state.loggedIn && !this.state.loading ? <Dashboard />
        : <Home /> }
        
        {this.state.loading ?
          <div className="container">
            <div className="alert bg-white text-center shadow-sm rounded border p-3 m-4" role="alert">
              Loading ...
        </div></div>
          : null}
      </Container>
    );
  }
}

export default App;
