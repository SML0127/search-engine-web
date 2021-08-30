// @flow

import ReactTable from "react-table"
import 'react-table/react-table.css'
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import ConfigCategoryTree from '../TreeView/components/config-category-tree';
import TargetConfigCategoryTree from '../TreeView/components/vm-config-category-tree';
import productIcon from './product.png';
import {
  Form,
  Page,
  Card,
  Button
} from "tabler-react";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Image from 'react-bootstrap/Image'
import ProgressBar from 'react-bootstrap/ProgressBar'
import setting_server from '../setting_server';
import { Tabs } from 'react-simple-tabs-component'
import CrawledProductDetailPage from './CrawledProductDetailPage.react.js'
import CrawledDetailPage from './CrawledDetailPage.react.js'
import CrawledSummaryPage from './CrawledSummaryPage.react.js'
import MysiteProductDetailPage from './MysiteProductDetailPage.react.js'
import TargetsiteProductDetailPage from './TargetsiteProductDetailPage.react.js'
import refreshIcon from './refresh.png';
import CrawledModal from "./CrawledModal.react";

class JobSubTabPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }
    
    componentDidMount(){
        console.log(this.state)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return false
    }
    initState() {
      return {
      }
    }

    render() {
        const TabSummary = () => {
            return (
                <div>
                  <CrawledSummaryPage
                     JobId = {this.props.JobId}
                  />
              </div>
            );
        }

        const TabDetail = () => {
          return (
              <div>
                <CrawledDetailPage
                  JobId = {this.props.JobId}
                />
              </div>
            );
        }
        
        const TabMy = () => {
          return (
              <div>
                <MysiteProductDetailPage
                   JobId = {this.props.JobId}
                />
              </div>
            );
        }
 
        const TabTarget = () => {
          return (
              <div>
                <TargetsiteProductDetailPage
                   JobId = {this.props.JobId}
                />
              </div>
            );
        }
  

        const tabs = [
          {
            label: '(Crawling) Product 페이지 수행', 
            Component: TabDetail
          },
          {
            label: '(Crawling) Summary 페이지 수행',
            Component: TabSummary
          },
          {
            label: 'My site upload / update 수행', 
            Component: TabMy
          },
          {
            label: 'Target site upload / update 수행', 
            Component: TabTarget
          }
        ]

        return (
          <>
            <Tabs tabs={tabs} /* Props */ />
            <CrawledModal
                show={this.state.crawledModalShow}
                JobId = {this.props.jobId}
                execId= {this.state.execId}
                setModalShow={(s) => this.setState({crawledModalShow: s})}
            />
          </>
        )
    }
}
export default JobSubTabPage;
