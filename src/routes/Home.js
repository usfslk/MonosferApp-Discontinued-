// Youssef Selkani
// 2019


import {
  Button, Form, Dimmer, Divider,
  Message, Loader, Input, Image,
} from 'semantic-ui-react';

import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";
import logo from './logo.png';
import robot from './robot.png';
import sat from './sat.png';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: '',
      password: "",
      loading: true,
      error: false,
      loggedIn: true,
      remember: false,
      init: true
    };
  }

  // Auth Change Listener
  componentDidMount = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ loading: false, loggedIn: true });
      } else {
        this.setState({ loading: false, loggedIn: false });
      }
    });
  };


  login = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      window.scrollTo(0, 0);
    }).catch((error) => {
      console.log(error);
      this.setState({ loginError: true, signupError: false, loading: false, });
    });
  }

  signup = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const self = this;
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        if (userCredentials.user) {
          userCredentials.user.updateProfile({
            displayName: this.state.username,
            photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVmHPt9SajdsWlAZWzqRXkd-SzmmO9bBUV45fLnw5giijsty3OA',
          }).then((s) => {
            fire.database()
              .ref(`usersDB/${userCredentials.user.displayName}/`)
              .update({
                uid: userCredentials.user.uid,
                email: userCredentials.user.email,
              })
            fire.database()
              .ref(`master/${userCredentials.user.displayName}/setup/`)
              .update({
                bio: 'Be original',
                accent: '#0062b1',
                fullName: userCredentials.user.displayName,
                displayName: userCredentials.user.displayName,
                photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVmHPt9SajdsWlAZWzqRXkd-SzmmO9bBUV45fLnw5giijsty3OA',
              })
              .then(() => {
                window.location.reload();
              });
          })
        }
      })
      .catch(function (error) {
        console.log(error);
        self.setState({ signupError: true, loginError: false, loading: false, });
      });
  }

  // Form Handler
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  init = e => {
    this.setState({ init: false });
  };

  render() {
    return (
      <div className="homeContainer">
        <Divider hidden />

        {this.state.loading ?
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          : null}

        {!this.state.loading ? (
          <div>
            <Image src={sat} size='tiny' alt="logo" />
            <h1>Monosfer</h1>
            <Divider hidden />
          </div>
        ) : null}

        {this.state.loginError && !this.state.loading ? (
          <div>
            <Message negative>
              <Message.Header>Please double-check and try again</Message.Header>
              <p>The password you entered did not match our records.</p>
            </Message>
            <Divider hidden />
          </div>
        ) : null}

        {this.state.signupError && !this.state.loading ? (
          <div>
            <Message negative>
              <Message.Header>The email you entered is already in use.</Message.Header>
              <p>Please choose another one or login to your account.</p>
            </Message>
            <Divider hidden />
          </div>
        ) : null}

        {!this.state.loading ? <div>
          {this.state.init ?
            <Form>
              <Form.Input icon='at' iconPosition='left'
                type="text" onChange={this.handleChange}
                placeholder="Email" name="email" autoComplete="username" >
              </Form.Input>

              <Form.Input icon='lock' iconPosition='left'
                type="password" onChange={this.handleChange}
                placeholder="Password" name="password" autoComplete="current-password" />
              <Divider hidden />
              <Button inverted onClick={this.login} >
                Log in
              </Button>
              <Button inverted style={{ marginLeft: '2%' }} onClick={this.init} >
                Create Account
              </Button>
            </Form>
            :
            <Form>
              <Form.Input icon='at' iconPosition='left'
                type="text" onChange={this.handleChange}
                placeholder="Email" name="email" autoComplete="username" />
              <Form.Input icon='lock' iconPosition='left'
                type="password" onChange={this.handleChange}
                placeholder="Password" name="password" autoComplete="current-password" />
              <Input fluid
                icon='user' iconPosition='right'
                type='url'
                label='https://monosfer.com/'
                onChange={this.handleChange}
                name="username"
                placeholder='Username' />
              <Divider hidden />
              <Button inverted onClick={this.signup}>
                Sign up
              </Button>
            </Form>
          } </div> : null}

        <Divider hidden />
      </div>
    );
  }
}

export default Home;
