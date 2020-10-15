// @flow

import * as React from "react";
import {
  Row
} from 'react-bootstrap';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
//import './style.css';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const obj = this;
    return (
      // <div
      //   className="project"
      //   onClick={() => obj.props.addTab(obj.props.name, obj.props.id)}
      // >
      //   <div
      //   >
      //     <div
      //       className="project-name"
      //     >
      //       {this.props.name}
      //     </div>
      //     <span
      //       className="project-rmbtn"
      //     >
      //       ×
      //     </span>
      //   </div>
      //   <div
      //     className="project-info"
      //   >
      //     Date Created: 2019-11-21 14:46:00
      //   </div>
      //   <div
      //     className="project-info"
      //   >
      //     Date Modified: 2019-11-21 14:46:00
      //   </div>
      // </div>
      <NavItem eventKey={obj.props.id}>
        <NavIcon>
          <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
        </NavIcon>
        <NavText>
          {obj.props.name}
        </NavText>
      </NavItem>
    );
  }
}

export default Project;
