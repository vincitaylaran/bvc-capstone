import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

/** PROPS
 * @list: array of objects
 */
export default observer(
  class DisplayUserRow extends Component {

    tableRows = () => {
      let page= this.props.props.model.userModel.getPageNumber();
      let rowperpage = this.props.props.model.userModel.getPageRow();
      let users = this.props.props.model.userModel.getUsers();
      let row = [];
      if (!users) { users = []; }
      
      if(users.length>0)
      {
        for(let i = (page-1)*rowperpage; i< ((page-1)*rowperpage)+rowperpage; i++) {
          
          if(users[i]===undefined)
            continue;

          let status = "Active";
          
          if (users[i].status.toLowerCase().indexOf("invite") >= 0) 
            status = "Invitation Sent"
          else if (users[i].status.toLowerCase().indexOf("reset") >= 0) 
            status = "Needs Reset"

          row.push(<div key={i} className="rows-list-row-equal">
            <Link to = {"/user/"+users[i].sid}>
              <Typography>{users[i].email}</Typography>
            </Link>
            <Link to = {"/user/"+users[i].sid}>
              <Typography>{users[i].firstname}</Typography>
            </Link>
            <Link to = {"/user/"+users[i].sid}>
              <Typography>{users[i].lastname}</Typography>
            </Link>
            <Link to = {"/user/"+users[i].sid}>
              <Typography>{users[i].nickname}</Typography>
            </Link>
            <Link to = {"/user/"+users[i].sid}>
              <Typography>{status}</Typography>
            </Link>
          </div>);
        }
      }
      else 
        row.push(<div className="rows-list-row-equal"><div>No Result found</div></div>);

      return row;
    };

    render() {
      return (<>{this.tableRows()}</>);
    }
  }
);
