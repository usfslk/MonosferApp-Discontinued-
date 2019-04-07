// Youssef Selkani
// 2019


import {
  Button, Form, Dimmer, Divider,
  Message, Loader, Input, Image,
  Label, Icon,
} from 'semantic-ui-react';

import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";
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
      init: true
    };
  }

  // Auth Change Listener
  componentDidMount = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        fire.database().ref(`/master/${user.displayName}/setup/`)
          .once('value', snapshot => {
            var obj = snapshot.val()
            this.setState({
              free: obj.free,
              loading: false,
              loggedIn: true,
            })
          })
      } else {
        this.setState({ loading: false, loggedIn: false });
      }
    });
  };

  login = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      this.props.history.push('/dashboard');
    }).catch((error) => {
      console.log(error);
      this.setState({ loginError: true, signupError: false, loading: false, });
    });
  }

  signup = (e) => {
    this.setState({ loading: true, loginError: false, signupError: false });
    e.preventDefault();
    const self = this;
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 16; i++) { OTP += digits[Math.floor(Math.random() * 10)]; }
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
              .ref(`master/${userCredentials.user.displayName}/links`)
              .push({
                link: 'https://bmc.xyz/l/Bkp9Ifb0P',
                title: 'Buy Now',
              })
            fire.database()
              .ref(`master/${userCredentials.user.displayName}/setup/`)
              .update({
                bio: 'Be original',
                accent: '#0062b1',
                OTP: OTP,
                free: true,
                fullName: userCredentials.user.displayName,
                displayName: userCredentials.user.displayName,
                photoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVmHPt9SajdsWlAZWzqRXkd-SzmmO9bBUV45fLnw5giijsty3OA',
              })
          })
        }
        else {
          self.setState({ loading: false, });
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
            <Image src={sat} width='75' alt="logo" />
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

        {!this.state.loading && !this.state.loggedIn ? <div>
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
                icon='user' iconPosition="right"
                type='url' pattern='[A-Za-z\\s]*'
                label='monosfer.com/'
                onChange={this.handleChange}
                name="username"
                placeholder='Username' />
              <p>
                Your username must not contain spaces, special characters like "." , "#" , "$" or emojis.
                </p>
              <h6>
                By continuing you agree to our terms of services.
                </h6>
              <Button inverted onClick={this.signup}>
                Sign up
              </Button>
            </Form>
          }
        </div>
          :
          <div>
            <p>
              You have successfully logged in.
            </p>
            <Button color="black"
              href="/dashboard" inverted
              onClick="function hi(){ window.location.reload()};hi()"
            >
              Dashboard
            </Button>
            {this.state.free ?
              <div>
                <Divider hidden />
                <Label size='tiny'
                  color='black'
                  horizontal>
                  <Icon name='info circle' /> Ad
                </Label>
                <Divider hidden />
                <a href="https://chrysntm.com/" target="_blank" title="Chrysntm Ad">
                  <img style={{ width: '100%' }} src="https://i.imgur.com/P5DTq98.jpg" alt="ad" />
                </a>
              </div>
              :
              <div>
                <Divider hidden />
                <Label color='white' horizontal>
                  Premium Account
                 </Label>
              </div>
            }
          </div>
        }

        <Divider hidden />
      </div>
    );
  }
}

export default Home;
