// @flow

import * as React from "react";
import ReactTable from "react-table"
import Modal from 'react-bootstrap/Modal';
import { Button, Card } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CSVReader from 'react-csv-reader'
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';

class EditDeliveryCompanyModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        country: '',
        deliveryCompanies: [],
        selectedShippingFeeIndex: null,
        selectedShippingFeeId: null,
        selectedShippingFeeMinKg:null,
        selectedShippingFeeMaxKg:null,
        selectedShippingFee:null,
        countryOptions: '',
        country: 'US',
        shippingFees: [],
      };
      this.handleFileLoad = this.handleFileLoad.bind(this)
      this.updateCostTable = this.updateCostTable.bind(this)
      this.updateCountry = this.updateCountry.bind(this)
      this.getShippingFee = this.getShippingFee.bind(this)
    }
    
    updateCountry(event) {
      console.log(event.target.value)
      this.setState({country: event.target.value},()=> {this.getShippingFee()});
    }

    getCountryOptions() {
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
          obj.getShippingFee()
        } else {
          console.log('getCountryOptions Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }



    addShippingFees(data){
      let userId = this.props.userId;
      let cid = this.props.selectedDeliveryCompanyId;
      console.log(this.state.country)
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/shippingfee', {
        req_type: "add_shipping_fees",
        user_id: userId,
        company_id: cid,
        fee_array: JSON.stringify(data),
        country: obj.state.country
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getShippingFee();
        } else {
          console.log(response)
          console.log('Failed to add shipping fee');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    updateCostTable(data, fileInfo){
      let shippingFees = data;
      if (shippingFees){
        shippingFees = shippingFees.map(function(row, index){
          const min_kg = row[0];
          const max_kg = row[1];
          const fee = row[2];
          return {min_kg: min_kg, max_kg: max_kg, fee: fee};
        });
        this.addShippingFees(shippingFees)
        //this.setState({shippingFees: shippingFees});
      }
    }   
    componentWillReceiveProps(nextProps) {
      if(nextProps.show == true){
        this.getCountryOptions();
      }
    }

    handleFileLoad(data) {
      console.log(data)
    }

    componentDidMount() {
    }

    closeModal(){
      this.props.setModalShow(false);
    }
    
    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }
    addShippingFee(){
      let userId = this.props.userId;
      let cid = this.props.selectedDeliveryCompanyId;
      let min_kg = this.state.selectedShippingFeeMinKg;
      let max_kg = this.state.selectedShippingFeeMaxKg;
      let fee = this.state.selectedShippingFee;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/shippingfee', {
        req_type: "add_shipping_fee",
        user_id: userId,
        company_id: cid,
        min_kg: min_kg,
        max_kg: max_kg,
        fee: fee,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getShippingFee();
        } else {
          console.log(response)
          console.log('Failed to add shipping fee');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    deleteShippingFee(){
      let sid = this.state.selectedShippingFeeId;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/shippingfee', {
        req_type: "delete_shipping_fee",
        id: sid,
        country: obj.state.country
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          obj.getShippingFee()
        } else {
          console.log('Failed to get shipping fee');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    updateShippingFee(){
      let id = this.state.selectedShippingFeeId;
      let min_kg = this.state.selectedShippingFeeMinKg;
      let max_kg = this.state.selectedShippingFeeMaxKg;
      let fee = this.state.selectedShippingFee;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/shippingfee', {
        req_type: "update_shipping_fee",
        id: id,
        min_kg: min_kg,
        max_kg: max_kg,
        fee: fee,
        country: obj.state.country
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          obj.getShippingFee()
        } else {
          console.log('Failed to get shipping fee');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    getShippingFee(){
      let userId = this.props.userId;
      let cid = this.props.selectedDeliveryCompanyId;
      if (cid == null){
        return;
      } 
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/shippingfee', {
        req_type: "get_shipping_fee",
        user_id: userId,
        company_id: cid,
        country: obj.state.country
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let shippingFees = response['data']['result'];
          if (shippingFees){
            shippingFees = shippingFees.map(function(row, index){
              const id = row[0];
              const min_kg = row[1];
              const max_kg = row[2];
              const fee = row[3];
              return {num: index+1, id: id, min_kg: min_kg, max_kg: max_kg, fee: fee};
            });
            obj.setState({shippingFees: shippingFees});
          }
        } else {
          console.log(response)
          console.log('Failed to get shipping fee');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    render() {
      const obj = this;
      return (
        <Modal
            {...this.props}
            size="lg"
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={ () => {
                this.props.setModalShow(false);
            }}
        >
          <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                  Edit Delivery Company
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div class='row'>
            <div class='col-sm-12'>
            <ReactTable
                data = {this.state.shippingFees}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedShippingFeeIndex !== null){ // When you click a row not at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedShippingFeeIndex: rowInfo.index,
                            selectedShippingFeeId: rowInfo.original['id'],
                            selectedShippingFeeMinKg: rowInfo.original['min_kg'],
                            selectedShippingFeeMaxKg: rowInfo.original['max_kg'],
                            selectedShippingFee: rowInfo.original['fee'],
                          });
                        },
                        style: {
                          background: rowInfo.index === this.state.selectedShippingFeeIndex ? '#00ACFF' : null
                        }
                      }
                    }
                    else { // When you click a row at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedShippingFeeIndex: rowInfo.index,
                            selectedShippingFeeId: rowInfo.original['id'],
                            selectedShippingFeeMinKg: rowInfo.original['min_kg'],
                            selectedShippingFeeMaxKg: rowInfo.original['max_kg'],
                            selectedShippingFee: rowInfo.original['fee'],
                          }, () => {console.log('update!'); console.log(this.state.selectedShippingFeeId)});
                        }
                      }
                    }
                  }
                  else{
                   if(this.state.selectedShippingFeeIndex !== null){ // When you click a row not at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedShippingFeeIndex: rowInfo.index,
                            selectedShippingFeeId: rowInfo.original['id'],
                            selectedShippingFeeMinKg: rowInfo.original['min_kg'],
                            selectedShippingFeeMaxKg: rowInfo.original['max_kg'],
                            selectedShippingFee: rowInfo.original['fee'],
                          });
                        }
                      }
                    }
                    else { // When you click a row at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedShippingFeeIndex: rowInfo.index,
                            selectedShippingFeeId: rowInfo.original['id'],
                            selectedShippingFeeMinKg: rowInfo.original['min_kg'],
                            selectedShippingFeeMaxKg: rowInfo.original['max_kg'],
                            selectedShippingFee: rowInfo.original['fee'],
                          }, () => {console.log('update!'); console.log(this.state.selectedShippingFeeId)});
                        }
                      }
                    }
                  }		
                }}
                columns={[
                  {
                    Header: "kg (min)",
                    width: 110,
                    resizable: false,
                    accessor: "min_kg",
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px"
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "kg (max)",
                    width: 110,
                    resizable: false,
                    accessor: "max_kg",
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px"
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "Shipping fee",
                    resizable: false,
                    accessor: "fee",
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px"
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                ]}
                sorted={[
                     {
                      id: 'min_kg',
                      asc: true
                     }
                   ]}
                minRows={5}
                defaultPageSize={1000}
                showPagination ={false}
                bordered = {false} 
                style={{
                  height: "250px"
                }}
                className="-striped -highlight"
              />
            </div>
          </div>
          <div>
          
           <div>
              <div class='row' style={{width:'100%'}}>
                <div class = 'col-sm-5'>
                  <Card style={{width:'105%', height: '100%', marginTop:'10px'}}>
                    <div class='row' style={{display: "flex",justifyContent: "center",alignItems: "center", marginTop:'1%'}}>
                      <label style={{fontSize:'20px', color:'#FF1926'}}> WARNING! Will be overwritten </label>
                    </div>
                    <div class = 'row' style={{display: "flex",justifyContent: "center",alignItems: "center", marginTop:'2%',marginLeft:'20%'}}>
                      <CSVReader
                        Class="csv-reader-input"
                        onFileLoaded={(data, fileInfo) => this.updateCostTable(data, fileInfo)} 
                        onError={this.handleDarkSideForce}
                        inputId="ObiWan"
                      >
                      </CSVReader>
                    </div>
                  </Card>
                </div>
                <div class = 'col-sm-7' >
                  <div class='row' style={{width:'100%', marginTop:'10px', float:'right'}}>
                    <input name="kg_min" class="form-control" style={{width:"15%"}} value={this.state.selectedShippingFeeMinKg} onChange={e => this.onTodoChange('selectedShippingFeeMinKg',e.target.value)} />
                    <label style={{marginTop:'8px', width:'51%', marginLeft:'3px'}}> kg (min) <b> ≤ </b>weight (product) <b>&#60;</b> </label>
                    <input name="kg_max" class="form-control" style={{marginLeft:'3px',width:"15%"}} value={this.state.selectedShippingFeeMaxKg} onChange={e => this.onTodoChange('selectedShippingFeeMaxKg',e.target.value)}/>
                    <label style={{marginTop:'8px', marginLeft: '3px', width:'14%', marginRight:'2%'}}> kg (max)</label>
                  </div>
                  <div class='row' style={{width:'100%', marginTop:'5%', float:'right'}}>
                    <label style={{marginTop:'8px', width:'40%'}}> Shipping cost: </label>
                    <input name="kg_min" class="form-control" style={{width:"57.5%", marginRight:'2.5%'}}  value={this.state.selectedShippingFee} onChange={e => this.onTodoChange('selectedShippingFee',e.target.value)}/>
                  </div>
                </div>
              </div>


              <div class='row' style={{marginLeft:'40%', width:'60%', marginTop:'20px', float:"right"}}>
                <label style={{marginTop:'8px', width:'15%'}}> Country :</label>
                <select
                  class="form-control"
                  style={{width:"15%", float: 'right', marginRight:'3%'}}
                  value={this.state.country}
                  onChange={this.updateCountry}
                  ref={ref => this.country = ref}
                >
                  {this.state.countryOptions}
                </select>
                <Button color="primary" style = {{marginLeft: '2%', width:'20%'}}
                  onClick={() => {
                   this.addShippingFee()
                  }}
                >
                Add
                </Button>
                <Button color="secondary" style = {{marginLeft:'2%', width:'20%'}}
                  onClick={() => {
                   this.updateShippingFee()
                  }}
                >
                Update
                </Button>
                <Button color="secondary" style = {{marginLeft:'2%', width:'20%'}}
                  onClick={() => {
                   this.deleteShippingFee()
                  }}
                >
                Delete
                </Button>
              </div>
            </div>

          </div>
          </Modal.Body>
        </Modal>
      );
    }
}
export default EditDeliveryCompanyModal;
