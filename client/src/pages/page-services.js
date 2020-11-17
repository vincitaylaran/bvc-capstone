import React, { Component } from "react";
import { observer } from "mobx-react";
// import { Link } from "react-router-dom";

import HeaderMenu from "../components/menu-header.js";
import DisplayServiceRow from "../components/ServicesTable";
import LoadingComponent from "../components/component-loading.js";

import TablePagination from "@material-ui/core/TablePagination";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import "../styles/rows-list.css";

///
/// This is the page that will set the fields that will appear when booking.
///
/// Props:
///     model: MainModel which holds every other model.
///
export default observer(
  class ServicesPage extends Component {  
    constructor(props) {
    super(props);
    this.state = { loaded: false };
  }
    async componentDidMount() {
      await this.props.model.serviceModel.getServicesData();
      await this.setState({ loaded: true });
    }

    headerLinks = () => {
      let headerArray = [];
      const canServices = this.props.model.getCanServices();

      headerArray.push({
        visible: canServices,
        label: "Add a Service",
        url: "/service"
      });

      return headerArray;
    };

    loadPreviousPage = () => {
      this.props.model.serviceModel.setPageNumber(-1);
    };

    loadNextPage = () => {
      this.props.model.serviceModel.setPageNumber(1);
    };

    handleChangeRowsPerPage = event => {
      this.props.model.serviceModel.setPageRow(event.target.value, 10);
    };

    findService = async event => {
      let value = event.target.value;
      let Previous = this.props.model.serviceModel.getFindService();
      if (value === "" || Previous.length > value.length) {
        await this.props.model.serviceModel.getServicesData();
      }
      this.props.model.serviceModel.setFindService(value);
    };

    render() {
      const links = this.headerLinks();
      const services = this.props.model.serviceModel.getServicesList();
      const page = this.props.model.serviceModel.getPageNumber();
      let row = this.props.model.serviceModel.getPageRow();
      let maxPage = Math.ceil(services.length / row);

      if (services.length < row) {
        maxPage = 1;
      }

      let max = false;
      let min = false;

      if (page < 2) min = true;
      else min = false;
      if (page >= Math.ceil(services.length / row)) max = true;
      else max = false;

      let render =  <LoadingComponent text="Loading List of Services..." />
      if(this.state.loaded){
         render =
        <div className="rows-list-table">
          <div className="rows-list-header">
            <div>
              <TextField
                label="Find Service"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={this.findService}
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
            <DisplayServiceRow model={this.props.model} />
          </div>
          <Divider />
        </div>
      }

      return (
        <Container>
          <HeaderMenu
            drawer={true}
            title="Services"
            page="List of Services"
            menu={links}
            model={this.props.model.menuModel}
          />
          <div className="page">
          {render}
          </div>
        </Container>
      );
    }
  }
);
