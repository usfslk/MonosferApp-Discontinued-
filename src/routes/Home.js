// Youssef Selkani
// 2019


import {
  Button, Form, Dimmer, Divider,
  Message, Loader, Input
} from 'semantic-ui-react';

import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";

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
      this.setState({ loginError: true, loading: false, });
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
              .ref(`master/${userCredentials.user.displayName}/setup/`)
              .update({
                bio: 'Be original',
                accent: '#0062b1',
              })
              .then(() => {
                window.location.reload();
              });
          })
        }
      })
      .catch(function (error) {
        console.log(error);
        self.setState({ signupError: true, loading: false, });
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
        <h1>Make Your Social Bio Link Count</h1>
        <p>You can add only one url to your social profiles so what link do you add?
          Do you add Twitter, Facebook, Instagram, your blog, your online store?
          We have the solution to your problem; with Linkkle you just need one link.</p>

        <h3>How Does It Work?</h3>
        <p>After you signup you can complete a profile then add your important links.
           You can then share your Linkkle profile url in your social media,
           email signatures or wherever else you need people to see your links, it's that easy.
           Never worry about what link to add in your social profiles again!</p>

        <h3>What’s The Catch?</h3>
        <p>No catch at all, Linkkle is a free service that can be used by anybody from bloggers
           to major companies, basically anyone who needs a hub for their important links and want to track
           clicks and save time by offering a single url to share.</p>

        <Divider hidden />
        <Button fluid color='black' inverted compact>
          Demo Account
          </Button>
        <Divider hidden />

        {this.state.loading ?
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          : null}

        {this.state.loginError ? (
          <div>
            <Divider hidden />
            <Message negative>
              <Message.Header>Please double-check and try again</Message.Header>
              <p>The password you entered did not match our records.</p>
            </Message>
            <Divider hidden />
          </div>
        ) : null}

        {this.state.signupError ? (
          <div>
            <Divider hidden />
            <Message negative>
              <Message.Header>The email you entered is already in use.</Message.Header>
              <p>Please choose another one or login to your account.</p>
            </Message>
            <Divider hidden />
          </div>
        ) : null}

        {this.state.init ?
          <Form>
            <Form.Input
              type="text" onChange={this.handleChange}
              placeholder="Email" name="email" autoComplete="username" />
            <Form.Input
              type="password" onChange={this.handleChange}
              placeholder="Password" name="password" autoComplete="current-password" />
            <Divider hidden />
            <Button inverted onClick={this.login} >
              Login
          </Button>
            <Button inverted onClick={this.init} >
              Create Account
          </Button>
          </Form>
          :
          <Form>
            <Form.Input
              type="text" onChange={this.handleChange}
              placeholder="Email" name="email" autoComplete="username" />
            <Form.Input
              type="password" onChange={this.handleChange}
              placeholder="Password" name="password" autoComplete="current-password" />
            <Divider hidden />
            <Input fluid
              required
              type='url'
              label='http://onepage.com/'
              onChange={this.handleChange}
              name="username"
              placeholder='Username' />
            <Divider hidden />
            <Button inverted onClick={this.signup}>
              Signup
          </Button>
            <h2>{this.state.username}</h2>
          </Form>
        }

        <Divider hidden />
      </div>
    );
  }
}

export default Home;
