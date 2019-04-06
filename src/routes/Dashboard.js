// Youssef Selkani
// 2019

import {
  Button, Form, Divider,
  Dimmer, Loader, TextArea,
  Message, Modal, Header,
} from 'semantic-ui-react';
import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";
import { CompactPicker } from 'react-color';

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
    const { currentUser } = fire.auth();
    this.setState({
      name: currentUser.displayName,
      bio: currentUser.bio,
      image: currentUser.photoURL,
    })
    fire.database().ref(`/master/${currentUser.displayName}/setup/`)
      .on('value', snapshot => {
        var obj = snapshot.val()
        this.setState({
          bio: obj.bio,
          fullName: obj.fullName,
          name: obj.fullName,
          accent: obj.accent,
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

  // Handlers

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChangeComplete = (color) => {
    this.setState({ accent: color.hex });
  };
  logout() {
    window.location.reload()
    fire.auth().signOut();
  };
  delete = (index) => {
    const { currentUser } = fire.auth();
    fire.database().ref(`master/${currentUser.displayName}/links/${this.state.keys[index]}`)
      .remove()
  };
  handleClose = () => this.setState({ updateSuccess: false });

  render() {
    const { dimmed } = this.state
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

        {!this.state.loading ?
          <div>
            <h1>Hello {this.state.name}</h1>
            <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.bio}</p>
            <img onerror="this.style.display='none'" src={this.state.image}
              style={{ paddingBottom: '2%' }} alt='profilePicture' width='120px' />

            <Button href='https://onepageclient-etgjrsxwmb.now.sh' fluid color='grey' inverted compact>
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
              <div style={{ backgroundColor: this.state.accent, height: '2vh', width: '2vh' }} />
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

            <Button onClick={this.logout} color='red'>
              Log Out
              </Button>
          </div>
          : null}

        <Modal onClose={this.handleClose} dimmer={dimmed} size='mini' open={this.state.updateSuccess} centered={false}>
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
