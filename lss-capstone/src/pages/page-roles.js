import React, { Component } from "react";
import { observer } from "mobx-react";
import TablePagination from "@material-ui/core/TablePagination";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from '@material-ui/core/InputAdornment';

import DisplayRoleRow from "../components/RolesTableRow.js";
import HeaderMenu from "../components/menu-header.js";
import ModalRoleList from "../components/modal-role-list.js";
import LoadingComponent from "../components/component-loading.js";

import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Divider from '@material-ui/core/Divider';

import "../styles/rows-list.css";

///
/// Displays roles.
///
/// Props:
///     model: MainModel which holds every other model.
///

export default observer(
  class RolesPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        open : false,
        title : "",
        list : [],
        loading: true
      }
    }

    async componentDidMount() {
      await this.props.model.roleModel.getRoleData();
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];
      
      const canRoles = this.props.model.getCanRoles();

      headerArray.push(
        { 
          visible: canRoles,
          label: "Add a Role",
          url: "/role"
        }
      );
      
      return headerArray;
    }

    closeModal = () => {
      this.setState({
        open : false,
        title : "",
        list : []
      });
    }

    getServices = async (code) => {
      const services = await this.props.model.roleModel.getRoleServices(code);
      this.setState(
        {
          open : true,
          title : "Services List",
          list : services
        } 
      )
    }

    getPrivileges = async (code) => {
      const privileges = await this.props.model.roleModel.getRolePrivileges(code);
      this.setState(
        {
          open : true,
          title : "Privileges List",
          list : privileges
        } 
      )
    }

    loadPreviousPage = () => {
      this.props.model.roleModel.setPageNumber(-1);
    };
    loadNextPage = () => {
      this.props.model.roleModel.setPageNumber(1);
    };
    handleChangeRowsPerPage = event => {
      this.props.model.roleModel.setPageRow(event.target.value, 10);
    };

    findRole = async (event) => {
      let value = event.target.value;
      let Previous = this.props.model.roleModel.getfindRole();
      if (value === "" ||  Previous.length > value.length) {
        await this.props.model.roleModel.getRoleData();
      }
      this.props.model.roleModel.setfindRole(value);
    };

    render() {
      const links = this.headerLinks();

      const page = this.props.model.roleModel.getPageNumber();
      let roles = this.props.model.roleModel.getRoles();
      let row = this.props.model.roleModel.getPageRow();
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

      return (
        <Container>
          <HeaderMenu drawer={true}
            title="Roles" 
            page="List of Roles" 
            menu={links}
            model={this.props.model.menuModel} />

          <div className="page">
            { this.state.loading
            ? <LoadingComponent text="Loading List of Roles..."/>
            : <div className="rows-list-table">
                <div className="rows-list-header">
                  <div>
                    <TextField
                      id="input-with-icon-grid"
                      label="Find role"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={this.findRole}/>
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
                      }}
                    ></TablePagination>
                  </div>
                </div>
                <Divider />
                <div className="rows-list-rows" >
                  <DisplayRoleRow props={this.props} 
                    services={this.getServices} 
                    privileges={this.getPrivileges}/>
                </div>
                <Divider />
              </div>
            }
          </div>
          <ModalRoleList 
            open={this.state.open}
            title={this.state.title}
            list={this.state.list}
            close={this.closeModal}
          />
        </Container>
      );
    }
  }
);
