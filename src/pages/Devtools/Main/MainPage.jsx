// @flow

import * as React from "react";
import Main from "./Main";
import LoginForm from '../Login/LoginForm';
import SiteWrapper from "../SiteWrapper.react";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    let curUrl = window.location.href;
  }
  render() {
    return (
        <div>
            <Main userId={this.props.userId} is_dev = {this.props.is_dev}/>
        </div>
    );
  }
}

export default MainPage;
