// Youssef Selkani
// 2019

import {
  Button, Form, Divider,
  Dimmer, Loader, TextArea,
  Message, Modal, Header,
  Input, Label
} from 'semantic-ui-react';
import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";
import { CompactPicker } from 'react-color';
import moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updateSuccess: false,
      data: [],
      title: '',
      link: '',
    };
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        const { currentUser } = fire.auth();
        this.setState({
          name: currentUser.displayName,
          bio: currentUser.bio,
          image: currentUser.photoURL,
        })
        fire.database().ref(`/master/${currentUser.displayName}/setup/`)
          .once('value', snapshot => {
            var obj = snapshot.val()
            this.setState({
              bio: obj.bio,
              fullName: obj.fullName,
              username: obj.displayName,
              accent: obj.accent,
              free: obj.free,
              OTP: obj.OTP,
            })
          })
        fire.database().ref(`/master/${currentUser.displayName}/links/`)
          .on('value', snapshot => {
            var obj = snapshot.val()
            var data = []
            var keys = []
            for (let a in obj) {
              data.push(obj[a])
              keys.push(a)
            }
            this.setState({
              data: data, keys: keys,
              loading: false,
            })
          });
      }
      else {
        this.setState({
          loading: false,
          error: true,
        })
      }
    });
  }

  newURL = e => {
    this.setState({ loading: true, updateSuccess: false });
    e.preventDefault();
    const { currentUser } = fire.auth();
    let title = this.state.title;
    let link = this.state.link;
    fire
      .database()
      .ref(`master/${currentUser.displayName}/links/`)
      .push({
        title,
        link,
      })
      .then(() => {
        this.setState({ loading: false, updateSuccess: true });
      });
  };

  editProfile = e => {
    this.setState({ loading: true, updateSuccess: false, dimmed: true });
    e.preventDefault();
    const { currentUser } = fire.auth();
    fire
      .database()
      .ref(`master/${currentUser.displayName}/setup/`)
      .update({
        bio: this.state.bio,
        fullName: this.state.fullName,
        photoURL: this.state.image,
        accent: this.state.accent,
      })
      .then(() => {
        currentUser.updateProfile({
          photoURL: this.state.image,
        })
        this.setState({ loading: false, updateSuccess: true, dimmed: false })
      });
  };

  validateOTP = e => {
    this.setState({ loading: true });
    const self = this;
    setInterval(function () {
      if (self.state.OTP === self.state.userOTP) {
        const { currentUser } = fire.auth();
        var event = moment().format('MMMM Do YYYY, h:mm:ss a');
        fire.database()
          .ref(`master/${currentUser.displayName}/setup/`)
          .update({
            free: false,
            validateOTP: event,
            email: currentUser.email,
          })
        fire.database()
          .ref(`/OTP/`)
          .push({
            id: self.state.userOTP,
            time: event,
            email: currentUser.email,
          })
          .then(() => {
            window.location.reload();
          });
      } else {
        self.setState({ OTPError: true, loading: false });
      }
    }, 2000);
  };

  // Handlers

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChangeComplete = (color) => {
    this.setState({ accent: color.hex });
  };
  logout(context) {
    fire.auth().signOut();
  };
  delete = (index) => {
    const { currentUser } = fire.auth();
    fire.database().ref(`master/${currentUser.displayName}/links/${this.state.keys[index]}`)
      .remove()
  };
  handleClose = () => this.setState({ updateSuccess: false });

  render() {
    const listItems = this.state.data.map((item, index) =>
      <div key={index}>
        <Message color='black'>
          <Button onClick={() => this.delete(index)}
            compact circular icon='delete'
            color='grey' />
          {item.title}
        </Message>
        <Divider hidden />
      </div>
    );
    return (
      <div className="dashboard">
        <Divider hidden />

        {this.state.loading ?
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          : null}

        {this.state.error ? (
          <div>
            <Message negative>
              <Message.Header>Error 403</Message.Header>
              <p>Remote Access Not Allowed</p>
            </Message>
            <Divider hidden />
          </div>
        ) : null}

        {!this.state.loading && !this.state.error ?
          <div>
            <h1>{this.state.name}</h1>
            <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.bio}</p>

            <img src={this.state.image}
              alt='profilePicture' width='120px' />

            <Divider hidden />

            {this.state.free ?
            <Label color='white' horizontal>
              Free
            </Label>
            :
            <Label color='white' horizontal>
              Premium
            </Label>
            }

            <Divider hidden />

            <Button href={'https://monosfer.com/' + this.state.name}
              target='_blank' fluid color='grey' inverted compact>
              View Profile
              </Button>

            <h3>Edit Profile</h3>
            <Divider hidden />

            <Form inverted>
              <Form.Input
                type="text" onChange={this.handleChange}
                placeholder="Full Name" name="fullName" />
              <Form.Input
                type="text" onChange={this.handleChange}
                placeholder="Profile Image URL" name="image" />
              <TextArea placeholder="Bio" name="bio"
                onChange={this.handleChange} style={{ minHeight: 100 }} />
              <h5>Accent color:</h5>
              <p style={{ color: this.state.accent }}>{this.state.accent}</p>
              <div style={{
                backgroundColor: this.state.accent,
                height: '2vh', width: '2vh'
              }} />
              <Divider hidden />
              <CompactPicker id='picker'
                color={this.state.accent}
                onChangeComplete={this.handleChangeComplete}
              />
              <Divider hidden />
              <Button inverted
                onClick={this.editProfile}>
                Save
                </Button>
              <Divider hidden />
            </Form>

            {this.state.free ?
              <div>
                <p>This is a free account please upgrade so you can add links.</p>
                <h5>Premium Account Lifetime Subscription</h5>

                <h2>$25</h2>
                <Button
                  href='https://bmc.xyz/l/Bkp9Ifb0P'
                  target='_blank' color='black' inverted compact>
                  Pay Now
                </Button>
                <Divider hidden />
                <h3>Confirm your account</h3>
                <p>Please enter your one-time password</p>
                {this.state.OTPError && !this.state.loading ? (
                  <div>
                    <Message negative>
                      <Message.Header>Please double-check and try again</Message.Header>
                    </Message>
                  </div>
                ) : null}
                <Divider hidden />
                <Form inverted>
                  <Input type="text" name="userOTP"
                    onChange={this.handleChange}
                    placeholder="OTP" />
                  <Divider hidden />
                  <Button
                    onClick={this.validateOTP}
                    color='black'>
                    Submit
                  </Button>
                </Form>
                <Divider hidden />
              </div>
              : null}

            {!this.state.free ? <div>
              <h3>Add Link</h3>
              <Divider hidden />
              <Form>
                <Form.Input
                  type="text" onChange={this.handleChange}
                  placeholder="Title" name="title" />
                <Form.Input
                  type="text" onChange={this.handleChange}
                  placeholder="Link" name="link" />
                <Divider hidden />
                <Button onClick={this.newURL} inverted>
                  Submit
                    </Button>
              </Form>
              <Divider hidden />
              {listItems}
            </div>
              : null}
            <Button
              onClick={this.logout}
              href="/" color='red'>
              Log Out
            </Button>
          </div>
          : null}


        <Modal onClose={this.handleClose}
          dimmer='blurring' size='mini'
          open={this.state.updateSuccess}
          centered={false}>
          <Header icon='checkmark' color='green' content='Updated successfully!' />
          <Modal.Content>
            <Modal.Description>
              <p>Data has been saved.</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>

        <Divider hidden />
      </div>
    );
  }
}

export default Dashboard;
