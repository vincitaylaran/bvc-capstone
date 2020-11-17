import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/** PROPS
 * @list: array of objects
 */
export default observer(
class DisplayRoleRow extends Component {
  viewPrivileges = (e) => {
    if (this.props.privileges) {
      this.props.privileges(e.currentTarget.value)
    }
  }

  viewServices = (e) => {
    if (this.props.services) {
      this.props.services(e.currentTarget.value)
    }
  }

  tableRows = () => {
        //let findRole = this.props.model.roleModel.getfindRole();
        let page= this.props.props.model.roleModel.getPageNumber();
        let rowperpage = this.props.props.model.roleModel.getPageRow();
        let roles = this.props.props.model.roleModel.getRoles();
        let row = [];
        if(roles.length>0)
        {
            for(let i = (page-1)*rowperpage; i< ((page-1)*rowperpage)+rowperpage; i++)
            {
              if(roles[i]===undefined)
                continue;
                
              row.push(<div key={i} className="rows-list-row">
                <div className="rows-col-1">
                  <Typography>
                    <Link to = {"/role/"+roles[i].code}>{roles[i].description}</Link>
                  </Typography>
                </div>
                <div className="rows-col-2">
                  <Button size="small" color="primary" 
                    value={roles[i].code} onClick={this.viewPrivileges}>
                    View Privileges</Button>
                </div>
                <div className="rows-col-2">
                  <Button size="small" color="primary"
                    value={roles[i].code} onClick={this.viewServices}>
                    View Services</Button>
                </div>
              </div>);
            }
        }
        else row.push(<div className="rows-list-row">
            <Typography>No results found.</Typography>
          </div>);

      return row;
  };

  render() {

    return (this.tableRows());
  }
});
