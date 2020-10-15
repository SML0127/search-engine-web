// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import ReactTable from "react-table";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../../../setting_server';

class SelectDeliveryCompanyModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          deliveryCompanies: [],
          selectedDeliveryCompanyIndex: '-1',
          selectedDeliveryCompanyId: '-1',
          selectedDeliveryCompanyLabel: null,
          tvRates: [],
          rendered: false
        };

    }


    getRate(userId) {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "get_rate",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          let tvRates = response['data']['result'];
          tvRates = tvRates.map(function(row, index){
            const id = row[0];
            const category = row[1];
            const trate = row[2];
            const vrate = row[3];
            return {num: index+1, id: id, category:category, tariff_rate: trate, vat_rate: vrate};
          });
          obj.setState({tvRates: tvRates});
        } else {
          console.log('Failed getRate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    getDeliveryCompanies(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "get_delivery_companies",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let deliveryCompanies = response['data']['result'];
          deliveryCompanies = deliveryCompanies.map(function(row, index){
            const id = row[0];
            const label = row[1];
            return {num: index+1, id: id, label: label};
          });
          obj.setState({deliveryCompanies: deliveryCompanies});
        } else {
          console.log('getDeliveryCompanies Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
        this.props.setModalShow(false)
    }

   
    componentDidMount(){
      console.log(this.props)
      this.getRate(this.props.userId);
      this.setState({rendered: true})
    }

    render() {
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
                  Tariff / VAT rate 
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ReactTable
                data = {this.state.tvRates}
                getTdProps={(state, rowInfo, column, instance) => {
                  if (rowInfo) {
                    if(this.state.selectedDeliveryCompanyIndex !== null){
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedRateIndex: rowInfo.index,
                            selectedCategory: rowInfo.original['category'],
                            selectedTariffRate: rowInfo.original['tariff_rate'],
                            selectedVatRate: rowInfo.original['vat_rate'],
                          }, () => {console.log('Click'); console.log(this.state.selectedDeliveryCompanyId)});
                        },
                        style: {
                          background: rowInfo.index === this.state.selectedRateIndex ? '#00ACFF' : null
                        }
                      }
                    }
                    else { 
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedRateIndex: rowInfo.index,
                            selectedCategory: rowInfo.original['category'],
                            selectedTariffRate: rowInfo.original['tariff_rate'],
                            selectedVatRate: rowInfo.original['vat_rate'],
                          }, () => {console.log('Click'); console.log(this.state.selectedDeliveryCompanyId)});
                        }
                      }
                    }
                  }
                  return {}
                }}
                columns={[
                  {
                    Header: "Category",
                    resizable: false,
                    accessor: "category",
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
                  },{
                    Header: "Tariff rate",
                    resizable: false,
                    accessor: "tariff_rate",
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
                  },{
                    Header: "VAT rate",
                    resizable: false,
                    accessor: "vat_rate",
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
                minRows={5}
                defaultPageSize={1000}
                showPagination ={false}
                bordered = {false} 
                style={{
                  height: "250px"
                }}
                className="-striped -highlight"
              />
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                      this.props.selectRate(this.state.selectedTariffRate, this.state.selectedVatRate)
                      this.closeModal();
                  }}
                >
                  OK
                </Button>
                <Button color="secondary" 
                  onClick={(obj) => {
                    this.closeModal()
                  }}
                >
                  Close
                </Button>
            </Modal.Footer>
            <NotificationContainer />
            </Modal>
        );
    }
}
export default SelectDeliveryCompanyModal;
