import React from "react";
//import HomeTab from "./MainTab/HomeTab.react";
//import Executions from "./MainTab/ExecutionTab.react";
//import ProgramRun from "./MainTab/ProgramRun.react";
//import ExecutionsPage from "./LogAndRerunPage/ExecutionsPage.react";
//import RunPage from "./RunPage/ProgramInfo.react";
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
      userId: 'dblabtest' // set userId when auth is true
    }
  }

  setAuth(auth) {
    this.setState({auth: auth});
  }
  setUserId(id) {
    this.setState({userId: id});
  }




  //render(){
  //  return (
  //    <div class='pse'>
  //      <div id="edit-selector" class="col-lg-10">
	//	    	<div class="input-group">
	//	    		  <span class="input-group-btn">
	//	    			<Button class="btn btn-default" action='select-selector' type="button">Select1</Button>
	//	    		  </span>
	//	    	</div>
	//	    </div>
  //      <RunPage /> 
  //      <ExecutionsPage  />
  //    </div>
  //  );
  //}

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
                />
              )}
            />
            <AuthRoute authenticated={this.state.auth} userId={this.state.userId}/>
          </Switch>
        </Router>
      </React.StrictMode>
    );
  }

}

export default PSEMainPage;
