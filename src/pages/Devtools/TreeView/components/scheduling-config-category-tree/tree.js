import React, { Component } from "react";
import Calendar from "react-calendar"
import TreeNode from "../config-category-tree-node";
import AddButton from "../add-button";
import ControlPanel from "../control-panel";
import TextView from "../text-view";
import "./tree.css";
import {Button} from "tabler-react"
import axios from 'axios'
import SelectTPModal from "../vm-config-category-tree/SelectTransformationProgramModal";
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';


import { 
  Modal,
  ModalHeader,
  ModalBody,
}  from 'reactstrap';


const formatStr = 'YYYY-MM-DD HH:mm:ss';
moment.locale('en-gb');
const now = moment();
now.utcOffset(8);

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');
const timePickerElement = (
  <TimePickerPanel
    defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
  />
);

class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = this.initState();
        this.changeDateFormat = this.changeDateFormat.bind(this);
        this.disabledDate = this.disabledDate.bind(this)
        this.onStandaloneChange = this.onStandaloneChange.bind(this) 
        this.onStandaloneSelect = this.onStandaloneSelect.bind(this)
    }
    
    disabledDate(current) {
      const date = moment();
      date.hour(0);
      date.minute(0);
      date.second(0);
      return current.isBefore(date);  // can not select days before today
    }
    
    disabledTime(time, type) {
      //console.log('disabledTime', time, type);
      if (type == 'start') {
        return {
          disabledHours() {
            const res = [];
            for (let i = 0; i < 60; i++) {
              res.push(i);
            }
            const hours = res
            hours.splice(20, 4);
            return [];
          },
          disabledMinutes(h) {
            if (h == 20) {
              const res = [];
              for (let i = 0; i < 31; i++) {
                res.push(i);
              }
              return [];
            } else if (h === 23) {
              const res = [];
              for (let i = 30; i < 60; i++) {
                res.push(i);
              }
              return [];
            }
            return [];
          },
          disabledSeconds() {
            return [];
          },
        };
      }
      return {
        disabledHours() {
          const res = [];
          for (let i = 0; i < 60; i++) {
            res.push(i);
          }
          const hours = res;
          hours.splice(2, 6);
          return [];
        },
        disabledMinutes(h) {
          if (h == 20) {
            const res = [];
            for (let i = 0; i < 31; i++) {
              res.push(i);
            }
            return [];
          } else if (h == 23) {
            const res = [];
            for (let i = 30; i < 60; i++) {
              res.push(i);
            }
            return [];
          }
          return [];
        },
        disabledSeconds() {
          return [];
        },
      };
    }
    
    format(v) {
      return v ? v.format(formatStr) : '';
    }
    
    isValidRange(v) {
      return v && v[0] && v[1];
    }
    
    onStandaloneChange(value) {
      //console.log('onChange');
      //console.log(value[0] && this.format(value[0]), value[1] && this.format(value[1]));
    }
    
    onStandaloneSelect(value) {
      //console.log('onSelect');
      //console.log(this.format(value[0]), this.format(value[1]));
      this.setState({ start_date_psql:this.format(value[0]), end_date_psql:this.format(value[1]) })
    }


    onChange = date => this.setState({ date_psql: this.changeDateFormat(date) })


    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    changeDateFormat(date){
    
      var year = date.getFullYear();            
      var month = (1 + date.getMonth());        
      month = month >= 10 ? month : '0' + month;
      var day = date.getDate();                 
      day = day >= 10 ? day : '0' + day;        
      var hour = date.getHours().toString().padStart(2,'0');
      var minute = date.getMinutes().toString().padStart(2,'0');
      var sec = date.getSeconds().toString().padStart(2,'0');
      //console.log(year + '-' + month + '-' + day +' ' + hour + ':' + minute + ':' +sec)
      return  year + '-' + month + '-' + day;
    }

    initState(){
      let curUrl = window.location.href;
      return {
        id: "",
        date: new Date(),
        date_psql: "2020-01-01",
        start_date_psql: new Date().toISOString().slice(0, 10) + " 00:00:00",
        end_date_psql: new Date().toISOString().slice(0, 10) + " 23:59:59",
        period: '7',
      }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.refresh != nextProps.refresh){
         this.props.saveScheduleProperty(this.state.start_date_psql, this.state.end_date_psql,this.state.period)
      }
    }


    componentDidMount(){
      let curUrl = window.location.href;
      this.setState({
        start_date_psql: this.props.startDate,
        end_date_psql: this.props.endDate,
        period: this.props.period
      })
    }


    onChange = (value) => {
      //console.log('onChange', value);
      this.setState({ value });
    }

    render() {
        return (
            <div className="Tree">
              <div class="container">
                 <div class="row" style={{width:'100%'}}  >
                   <div style = {{minWidth:'30%', maxWidth:'60%'}}>
                     <RangeCalendar
                       style = {{width:'100%'}}
                       showToday={false}
                       showWeekNumber
                       dateInputPlaceholder={['start', 'end']}
                       locale={enUS}
                       showOk={false}
                       showClear
                       format={formatStr}
                       onChange={this.onStandaloneChange}
                       onSelect={this.onStandaloneSelect}
                       disabledDate={this.disabledDate}
                       timePicker={timePickerElement}
                       disabledTime={this.disabledTime}
                     />
                   </div>
                   <div style = {{marginLeft:'3%', width:'40%'}}>
                     <div class = 'row' style={{width:"100%", fontWeight:'600'}}>
                       <div style={{width:"70%"}}>
                         Start Date
                         <input name="start_date"  class="form-control" style={{width:"100%",marginTop:'2%'}} value= {this.state.start_date_psql}  onChange={e => this.onTodoChange('start_date_psql',e.target.value)} />
                       </div>
                       <div style={{width:"30%"}}>
                         Period (day)
                         <input type="integer" name="period" class="form-control"style={{width:"100%",marginTop:'4%'}} value= {this.state.period } onChange={e => this.onTodoChange('period',e.target.value)}/>
                       </div>
                     </div>
                     <div class = 'row' style={{marginTop:'12%',width:"100%", fontWeight:'600'}}>
                       <div style={{width:"100%"}}>
                         <OverlayTrigger
                           placement="right"
                           delay={{ show: 100, hide: 400 }}
                           style = {{width:'800px'}}
                           overlay={
                             <Tooltip
                               style = {{width:'800px'}}
                             >
                               After the end date,<br/> the job is not executed <br/>even if the period has passed
                             </Tooltip>
                           }
                         >
                           <span>
                             End Date 
                           </span>
                         </OverlayTrigger>
                         <input name="end_date"  class="form-control" style={{width:"100%",marginTop:'2%'}} value= {this.state.end_date_psql}/>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
        );
    }
}

export default Tree;
