import * as React from "react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { Button } from "tabler-react";
import setting_server from '../setting_server';

class HomeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      countryOptions: '',
      url: '',
      site: '',
      jobLabel: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCountry = this.updateCountry.bind(this)
    this.updateSite = this.updateSite.bind(this)
  }

  componentDidMount() {
    this.getCountryOptions()

  }


  getCountryOptions(){
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/exchangerate', {
      req_type: "get_exchange_rate",
      user_id: this.props.userId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        let countryOptions = Object.keys(response['data']['result'][0][0])
            .map((code) => <option value={code}>{code.slice(0,2)}</option>);
        obj.setState({
          countryOptions: countryOptions,
        });

        //obj.setState({ curExchangeRate:response['data']['result'][0][0], updateTime:response['data']['result'][0][1]});
        
      } else {
        console.log('Failed to update exchange rate');
      }
    })
    .catch(function (error){
      console.log(error);
    });
  }




  getCountryOptionsOLD() {
    let userId = this.props.userId;
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
      req_type: "get_delivery_countries",
      user_id: userId
    })
    .then(function (response) {
      if (response['data']['success'] === true) {
        let countryOptions = response['data']['result']
            .map((code) => <option value={code}>{code}</option>);
        obj.setState({
          countryOptions: countryOptions
        });
      } else {
        console.log('getCountryOptions Failed');
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }


      
  updateSite(event) {
    console.log(event.target.value)
    this.setState({site: event.target.value});
  }



      
  updateCountry(event) {
    console.log(event.target.value)
    this.setState({country: event.target.value});
  }

  createNotification = (type) => {
      switch (type) {
        case 'warning':
            NotificationManager.warning('Job name or web page is blank','WARNING',  3000);
            break;
        case 'warning_country':
            NotificationManager.warning('Select country of \n e-commerce site','WARNING',  3000);
            break;
        case 'warning_country':
            NotificationManager.warning('Select e-commerce site','WARNING',  3000);
            break;
        case 'error':
            NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
            });
            break;
        default:
            console.log("Not defined notification")
            break;
      }
    };


  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleLChange(event) {
    this.setState({jobLabel: event.target.value});
  }



  handleSubmit(event) {
    event.preventDefault();
    if(String(this.state.url).trim() == '' || String(this.state.jobLabel).trim() == ''){
      this.createNotification('warning')
    }
    else if(String(this.state.country).trim() == ''){
      this.createNotification('warning_country')
    }
    else if(String(this.state.site).trim() == ''){
      this.createNotification('warning_site')
    }
    else{

      if (!this.state.url.match(/^https?:\/\//i)) {
        this.props.makeNewJob(this.props.userId, this.props.parentId, 'http://'+this.state.url, this.state.jobLabel, this.state.country, this.state.site);
        chrome.tabs.update({url: 'http://'+this.state.url});
      }
      else{
        this.props.makeNewJob(this.props.userId, this.props.parentId, this.state.url, this.state.jobLabel, this.state.country, this.state.site);
        chrome.tabs.update({url: this.state.url});
      }
    }
  }

  render() {
    const obj = this;
    return (
      <div
        style={{backgroundColor: "white", height: "calc(100vh - 30pt)", padding: "40pt"}}
      >
        <h1 class="text-center" style={{color:'#00ACFF', marginBottom: "10pt", fontSize: "30pt"}}> Product Search Engine</h1>

        <form onSubmit={obj.handleSubmit} style={{marginTop:'3%', textAlign: "center", height:'10%',minHeight:'20px'}}>
          <div class = 'row' style={{marginLeft:'5%',height:'100%'}}>
            <div class = 'form-group' style = {{width:'15%', height:'100%'}} >
              <input
                class='form-control'
                onChange={obj.handleLChange}
                style={{height:'50px'}}
                type="text"
                placeholder="Enter a job name"
              />
            </div>
            <div class = 'form-group' style = {{width:'40%', height:'100%'}}>
              <input
                class='form-control'
                style={{height:'50px'}}
                onChange={obj.handleChange}
                placeholder="Enter a web page to scrape"
              />
            </div>

            <select
              class="form-control"
              style={{width:"15%", float: 'right',height:'50px'}}
              value={this.state.site}
              onChange={this.updateSite}
            >
              <option value="" disabled selected>Select Site</option>
              <option value="1000">Blank</option>);
              <option value="0">Amazon US</option>);
              <option value="1">Jomashop</option>);
              <option value="2">Zalando</option>);
              <option value="3">Rakuten</option>);
              <option value="4">Ebay</option>);
            </select>
            <select
              class="form-control"
              style={{width:"15%", float: 'right', marginRight:'3%',height:'50px'}}
              value={this.state.country}
              onChange={this.updateCountry}
              ref={ref => this.country = ref}
            >
              <option value="" disabled selected>Select Country</option>
              {this.state.countryOptions}
            </select>

            <Button type='submit' class="btn btn-info btn-md" style={{width:'10%', backgroundColor:'#00ACFF', height:'50px'}}>Get Started!</Button>
          </div>
        </form>
        <NotificationContainer/>
      </div>
    );
  }
}

export default HomeTab;
