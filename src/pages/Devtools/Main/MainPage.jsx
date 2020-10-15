// @flow

import * as React from "react";
import Main from "./Main";
// import ExecutionsInfo from "../LogAndRerunPage_/ExecutionsInfo.react";
import LoginForm from '../Login/LoginForm';
import SiteWrapper from "../SiteWrapper.react";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    let curUrl = window.location.href;
    //this.setUserId = this.setUserId.bind(this);
  }

  // setAuth(auth){
  //   this.setState({auth: auth});
  // }
  // setUserId(userId){
  //   this.setState({userId: userId});
  // }

    render() {
      return (
          <div>
              <Main userId={this.props.userId}/>
          </div>
      );
    }
}

export default MainPage;
