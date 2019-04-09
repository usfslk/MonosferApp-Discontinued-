// Youssef Selkani
// 2019


import {
    Divider,
    Message, Button
} from 'semantic-ui-react';

import React, { Component } from "react";
import fire from "../config/Fire";
import "../App.css";
import moment from "moment";

class OTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OTP: "",
            verified: ""
        };
    }

    // Auth Change Listener
    componentDidMount = () => {
        this.setState({ loading: true, error: null });
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                fire.database().ref(`/master/${user.displayName}/setup/`)
                    .once('value', snapshot => {
                        var obj = snapshot.val();
                        this.setState({
                            OTP: obj.OTP,
                            verified: obj.verified,
                            loading: false,
                        })
                        var event = moment().format('MMMM Do YYYY, h:mm:ss a');
                        fire.database()
                            .ref(`OTP/${user.displayName}/`)
                            .push({
                                user: user.displayName,
                                email: user.email,
                                accessTime: event,
                            })
                    });

            } else {
                this.setState({ loading: false, error: true, loggedIn: false });
            }
        });
    };


    render() {
        return (
            <div className="homeContainer">
                <Divider hidden />

                {this.state.error && !this.state.loading ? (
                    <div>
                        <Message negative>
                            <Message.Header>Error 403</Message.Header>
                            <p>Remote Access Not Allowed</p>
                        </Message>
                        <Divider hidden />
                    </div>
                ) : null}

                {!this.state.error && this.state.verified ? (
                    <div>
                        <Message >
                            <Message.Header>
                                This is your one-time password:
                            </Message.Header>
                            {this.state.loading ?
                                <h2>Loading ... </h2>
                                : null}
                            <h2>{this.state.OTP}</h2>
                            <p>If nothing appears there's a problem with your account.
                                <br />
                                Please send us an email at hello@monosfer.com</p>
                        </Message>
                        <Divider hidden />
                        <Button color="black" inverted
                            href="/dashboard"
                        >
                            Dashboard
                    </Button>
                    </div>
                ) : null}

            {!this.state.error && !this.state.verified && !this.state.loading ? ( 
                <div>
                    <Message >
                        <Message.Header>
                            Account non verified
                        </Message.Header>
                        <p>
                            Please allow us a moment to clear your payment.
                            This is a manual process, it should take less than 24h.
                            You'll receive an email when it's done.
                            </p>
                        <h5>
                            Contact us at hello@monosfer.com if you have any question.
                            </h5>
                    </Message>
                    <Divider hidden />
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
