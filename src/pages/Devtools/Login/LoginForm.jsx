import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import LoginFormCss from './LoginForm.css'
import { Button } from "tabler-react";
import setting_server from '../setting_server';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      password: '',
      newUserId: '',
      newPassword: '',
      showLoginScreen: true
    };
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleCreateAndLoginClick = this.handleCreateAndLoginClick.bind(this);
    this.handleCreateAccountClick = this.handleCreateAccountClick.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
  }

  handleLoginClick() {
    axios.post(setting_server.DB_SERVER+'/api/db/account', {
      req_type: 'get_auth',
      user_id: this.state.userId,
      password: this.state.password
    })
    .then((resultData) => {
      console.log(resultData['data'])
      if(resultData['data']['success'] === true) {
        const auth = resultData['data']['auth'];
     
        if (auth === true) {
          if ( resultData['data']['is_dev'] == true){
            this.state.userId = resultData['data']['normal_user_id']
          }
          this.props.setUserId(this.state.userId);
          this.props.setAuth(auth);
          this.props.setIsDev(resultData['data']['is_dev']);
        } else {
          alert('Failed to login');
          this.setState({userId: '', password: ''});
        }
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }

  handleCreateAndLoginClick() {
    axios.post(setting_server.DB_SERVER+'/api/db/account', {
      req_type: 'sign_up',
      new_user_id: this.state.newUserId,
      new_password: this.state.newPassword
    })
    .then((resultData) => {
      const success = resultData['data']['success'];
      console.log(success);
      if (success === true) {
        this.props.setUserId(this.state.newUserId);
        this.props.setAuth(true);
      } else {
        alert('Failed to Register: Duplicate ID');
        this.setState({newUserId: '', newPassword: ''});
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }

  handleCreateAccountClick(){
    this.setState({showLoginScreen: false});
  }

  handlePrevPageClick(){
    this.setState({showLoginScreen: true});
  }

  render() {
    const { from } = { from: { pathname: '/'}};
    if (this.props.authenticated) return <Redirect to={from} />;

    if (this.state.showLoginScreen === true) {
      return (
        <div style={{backgroundColor:'#FFFFFF', height:'100%' }}>
        <div style = {{marginLeft:'37%', marginTop:'10%', display:'inline-block', width : '25%'}}>
          <h1 class="text-center" style={{color:'#00ACFF'}}> PSE Log In</h1>
          <span>
          <div class = 'form-group' >
            <label for='username' style={{color:'#00ACFF'}}>User ID :</label>
            <input
              class='form-control'
              value={this.state.userId}
              onChange={({ target: { value } }) => this.setState({userId: value})}
              type="text"
              placeholder="user id"
            />
          </div>
          <div class = 'form-group'>
            <label  for='password' style={{color:'#00ACFF'}}>Password :</label>
            <input
              class='form-control'
              value={this.state.password}
              onChange={({ target: { value } }) => this.setState({password: value})}
              type="password"
              placeholder="password"
            />
          </div>
          </span>
          <Button class="btn btn-info btn-md" style={{width:'100%', backgroundColor:'#00ACFF'}} onClick={this.handleLoginClick}>Login</Button>
          <div class="card-content">
              <div class="text-info" style={{float:'right', marginTop:'2%'}}>
                  New user? <a onClick={this.handleCreateAccountClick} style = {{textDecoration: 'underline'}}>Create an account</a>
              </div>
          </div>
        </div>
        </div>
      );
    } else {
      return (
        <div style = {{marginLeft:'37%', marginTop:'10%', display:'inline-block', width : '25%'}}>
          <h1 class="text-center" style={{color:'#00ACFF'}}>PSE User Registration</h1>
          <span>
          <div class = 'form-group' >
            <label for='username' style={{color:'#00ACFF'}}>User ID : </label>
            <input
              class='form-control'
              value={this.state.newUserId}
              onChange={({ target: { value } }) => this.setState({newUserId: value})}
              type="text"
              placeholder="user id"
            />
          </div>
          <div class = 'form-group' >
            <label for='username' style={{color:'#00ACFF'}}>Password : </label>
            <input
              class='form-control'
              value={this.state.newPassword}
              onChange={({ target: { value } }) => this.setState({newPassword: value})}
              type="password"
              placeholder="password"
            />
          </div>
          </span>
          <Button class="btn btn-info btn-md" style={{width:'100%', backgroundColor:'#00ACFF'}}  onClick={this.handleCreateAndLoginClick}>Create & Login</Button>
          <div class="card-content">
              <div class="text-info" style={{float:'right', marginTop:'2%'}}>
                <a onClick={this.handlePrevPageClick}>Go To Previous Page</a>
              </div>
          </div>
        </div>
      );
    }
    
  }
}

export default LoginForm;
