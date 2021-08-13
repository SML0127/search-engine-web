import React from "react";
import "tabler-react/dist/Tabler.css";
import jQuery from "jquery";
import { Button } from "tabler-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "tabler-react/dist/Tabler.css";

import LoginForm from './Login/LoginForm';
import AuthRoute from './Login/AuthRoute';

window.$ = window.jQuery = jQuery;

type Props = {||};


class PSEMainPage extends React.Component {

  constructor(props) {
    super(props);
    let curUrl = window.location.href;
    this.state = {
      //auth: true, // auto login?
      //userId: 'psetest' // set userId when auth is true
      userId: 'dblabtest', // set userId when auth is true
      is_dev: false 
    }
  }

  setAuth(auth) {
    this.setState({auth: auth});
  }
  setUserId(id) {
    this.setState({userId: id});
  }
  setIsDev(bool) {
    this.setState({is_dev: bool});
  }
  render() {
    const obj = this;
    return (
      <React.StrictMode>
        <Router>
          <Switch>
            <Route
              path="/login"
              render={() => (
                <LoginForm
                  authenticated={this.state.auth}
                  setAuth={this.setAuth.bind(this)}
                  setUserId={this.setUserId.bind(this)}
                  setIsDev={this.setIsDev.bind(this)}
                />
              )}
            />
            <AuthRoute authenticated={this.state.auth} userId={this.state.userId} is_dev = {this.state.is_dev}/>
          </Switch>
        </Router>
      </React.StrictMode>
    );
  }

}

export default PSEMainPage;
