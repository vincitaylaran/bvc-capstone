import React, { Component } from "react";
import { observer } from "mobx-react";

import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import TablePagination from "@material-ui/core/TablePagination";
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ClearIcon from '@material-ui/icons/Clear';

import ModalRoleList from "../components/modal-role-list.js";

import "../styles/rows-list.css";

// Roles List
// Props:
//    model - ModelRole
//    label - Table Label
//    roles - initial roles
export default observer(
  class RolesList extends Component {
    constructor(props) {
      super(props);
      this.searchText = "";

      this.state = {
        open : false,
        title : "",
        list : []
      }
    
    }

    closeModal = () => {
      this.setState({
        open : false,
        title : "",
        list : []
      });
    }

    getServices = async (e) => {
      const code = e.currentTarget.value;
      const services = await this.props.model.getRoleServices(code);
      this.setState(
        {
          open : true,
          title : "Services List",
          list : services
        } 
      )
    }

    getPrivileges = async (e) => {
      const code = e.currentTarget.value;
      const privileges = await this.props.model.getRolePrivileges(code);
      this.setState(
        {
          open : true,
          title : "Privileges List",
          list : privileges
        } 
      )
    }

    async componentDidMount() {
      await this.props.model.getRoleData();
      if (this.props.roles) {
        const selected = [];
        const rolesList = await this.props.model.getRoles();
        await this.props.roles.forEach(r => {
          const found = rolesList.find(l => { return l.code === r;});
          if (found) {
            selected.push(found);
          }
        });
        await this.props.model.setSelectedRoles(selected);
      }
    }

    checkChange = async (e) => {
      await this.props.model.addRemoveSelectedRole(e.target.checked, e.target.value);
    }

    removeRole = async (e) => {
      await this.props.model.addRemoveSelectedRole(false, e.currentTarget.value);
    }

    createRows = (roles) => {
      const selected = this.props.model.getSelectedRoles().map(r => {
        return r.code;
      });

      let page = this.props.model.getPageNumber();
      let rpp = this.props.model.getPageRow();
      let min = (page-1) * rpp;
      let max = (page * rpp) -1;
      const rows = roles.map((r,i) => {
        
        return (i >= min && i <= max) && <div key={i} className="rows-list-row">
          <div className="rows-col-1">
            <FormControlLabel
              control={<Checkbox value={JSON.stringify(r)}
                checked={selected.includes(r.code)}
                onChange={this.checkChange} />}
              label={r.description}
            />
          </div>
          <div className="rows-col-2">
            <Button size="small" color="primary"
              value={r.code} onClick={this.getPrivileges}>
              View Privileges</Button>
          </div>
          <div className="rows-col-2">
            <Button size="small" color="primary"
              value={r.code} onClick={this.getServices}>
              View Services</Button>
          </div>
          <Divider />
        </div>
      });

      return rows;
    }
    
    createSelected = () => {
      const selected = this.props.model.getSelectedRoles();

      if (selected.length === 0) {
        return <Button size="small" variant="outlined" 
          color="primary">Selected: None</Button>;
      }
      else {
        const selrows = selected.map((r,i) => {
          return <Button key={i} size="small" variant="outlined" 
            value={JSON.stringify(r)}
            onClick={this.removeRole}
            color="secondary"
            startIcon={<ClearIcon />}>{r.description}</Button>;
        });

        return selrows;
      }
    }

    loadPreviousPage = () => {
      this.props.model.setPageNumber(-1);
    };

    loadNextPage = () => {
      this.props.model.setPageNumber(1);
    };

    handleChangeRowsPerPage = event => {
      this.props.model.setPageRow(event.target.value);
    };

    findRole = async (e) => {
      let value = e.target.value.trim();
      let Previous = this.props.model.getfindRole();
      
      if (value === "" ||  Previous.length > value.length) {
        await this.props.model.getRoleData();
      }

      this.props.model.setfindRole(value);
    };

    render() {
      const label = (this.props.label ? this.props.label : "Roles");
      const page = this.props.model.getPageNumber();
      let roles = this.props.model.getRoles();
      let row = this.props.model.getPageRow();
      let maxPage = Math.ceil(roles.length / row);

      if (roles.length < row) {
        maxPage = 1;
      }

      let max = false;
      let min = false;

      if (page < 2) min = true;
      else min = false;
      
      if (page >= Math.ceil(roles.length / row)) max = true;
      else max = false;
      
      return(
        <div className="rows-list-table">
          <div className="rows-list-label">
            <Typography variant="h5">{label}</Typography>
          </div>
          <div className="rows-list-header">
            <div>
              <TextField
                label="Find Role"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={this.findRole}
              />
            </div>
            <div>
              <ModalRoleList 
                open={this.state.open}
                title={this.state.title}
                list={this.state.list}
                close={this.closeModal}
              />
            </div>
            <div>
              <TablePagination
                labelRowsPerPage="Rows per page"
                labelDisplayedRows={({ from, to, count }) =>
                  `[Page ${page} of ${maxPage}]`
                }
                page={page}
                rowsPerPage = {row}
                rowsPerPageOptions={[5, 10, 20, { label: "All", value: -1 }]}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                  onClick: this.loadPreviousPage,
                  disabled: min
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                  onClick: this.loadNextPage,
                  disabled: max
                }}>
              </TablePagination>
            </div>
          </div>
          <Divider />
          <div className="rows-list-rows" >
            {this.createRows(roles)}
          </div>
          <Divider />
          <div className="rows-list-footer" >
            {this.createSelected()}
          </div>
        </div>
      );
    }
  }
)