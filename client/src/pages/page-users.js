import React, { Component } from "react";
import { observer } from "mobx-react";

import DisplayUserRow from "../components/UserTableRow";
import HeaderMenu from "../components/menu-header.js";
import LoadingComponent from "../components/component-loading.js";

import Container from "@material-ui/core/Container";
import TablePagination from "@material-ui/core/TablePagination";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Divider from "@material-ui/core/Divider";

import "../styles/rows-list.css";

///
/// This is the page that will serve as "home" for the currently logged user.
///
/// PROPS
///     @model: MainModel which holds every other model.
///
export default observer(
  class UsersPage extends Component {
    constructor(props) {
      super(props);

      this.state = { loading: true };
    }

    async componentDidMount() {
      await this.props.model.userModel.getUserss();
      await this.props.model.serviceModel.getServicesData();
      this.setState({loading: false});
    }

    headerLinks = () => {
      let headerArray = [];

      const canUsers = this.props.model.getCanUsers();

      headerArray.push({
        visible: canUsers,
        label: "Invite a User",
        url: "/user"
      });

      return headerArray;
    };

    loadPreviousPage = () => {
      this.props.model.userModel.setPageNumber(-1);
    };
    loadNextPage = () => {
      this.props.model.userModel.setPageNumber(1);
    };
    handleChangeRowsPerPage = event => {
      this.props.model.userModel.setPageRow(event.target.value, 10);
    };

    findUser = async event => {
      let value = event.target.value;
      let Previous = this.props.model.userModel.getfindUser();
      if (value === "" || Previous.length > value.length) {
        await this.props.model.userModel.getUserss();
      }
      this.props.model.userModel.setfindUser(value);
    };

    render() {
      // const canUsers = this.props.model.getCanUsers();
      const links = this.headerLinks();

      const page = this.props.model.userModel.getPageNumber();
      let users = this.props.model.userModel.getUsers();
      let row = this.props.model.userModel.getPageRow();
      if (!users) { users = []; }
      let maxPage = Math.ceil(users.length / row);

      if (users.length < row) {
        maxPage = 1;
      }

      let max = false;
      let min = false;

      if (page < 2) min = true;
      else min = false;
      if (page >= Math.ceil(users.length / row)) max = true;
      else max = false;

      return (
        <Container>
          <HeaderMenu
            drawer={true}
            title="Users"
            page="List of Users"
            menu={links}
            model={this.props.model.menuModel}
          />

          <div className="page">
          {
            this.state.loading
            ? <LoadingComponent text="Loading List of Users..." />
            :
              <div className="rows-list-table">
                <div className="rows-list-header">
                  <div>
                    <TextField
                      id="input-with-icon-grid"
                      label="Find User"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      onChange={this.findUser}
                    />
                  </div>
                  <div>
                    <TablePagination
                      labelRowsPerPage="Rows per page"
                      labelDisplayedRows={({ from, to, count }) =>
                        `[Page ${page} of ${maxPage}]`
                      }
                      page={page}
                      rowsPerPage={row}
                      rowsPerPageOptions={[
                        5,
                        10,
                        20,
                        { label: "All", value: -1 }
                      ]}
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
                <div className="rows-list-rows">
                  <DisplayUserRow props={this.props} />
                </div>
                <Divider />
              </div>
            }
          </div>
        </Container>
      );
    }
  }
);
