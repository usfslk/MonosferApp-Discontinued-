// Youssef Selkani
// 2019


import {
    Dimmer, Divider,
    Message, Loader, Button
} from 'semantic-ui-react';

import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";


class OTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OTP: "",
        };
    }

    // Auth Change Listener
    componentDidMount = () => {
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                fire.database().ref(`/master/${user.displayName}/setup/`)
                    .once('value', snapshot => {
                        var obj = snapshot.val();
                        this.setState({
                            OTP: obj.OTP,
                            loading: false,
                        })
                    });
            } else {
                this.setState({ loading: false, error: true });
            }
        });
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

                {this.state.error && !this.state.loading ? (
                    <div>
                        <Message negative>
                            <Message.Header>You do not have access to this page.</Message.Header>
                        </Message>
                        <Divider hidden />
                    </div>
                ) : null}

                {!this.state.error && !this.state.loading ? (
                    <div> 
                    <Message >
                        <Message.Header>
                            This is your one-time password:
                            </Message.Header>
                        <h2>{this.state.OTP}</h2>
                        <p>If nothing appears there's a problem with your account.
                                <br />
                            Please send us an email at hello@monosfer.com</p>
                     </Message>
                    <Button color="black" inverted
                        href="/dashboard"
                        >
                        Dashboard
                    </Button>
                    </div>
                ) : null}

                <Divider hidden />
            </div>
        );
    }
}

export default OTP;
