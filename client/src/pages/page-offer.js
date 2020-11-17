import React, { Component } from "react";
import { observer } from "mobx-react";
import Typography from "@material-ui/core/Typography";
// import TableFooter from "@material-ui/core/TableFooter";
// import { Link } from "react-router-dom";

import HeaderMenu from "../components/menu-header.js";
import DisplayOfferRow from "../components/OfferedServicesTable.js";

// Material UI
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TablePagination from "@material-ui/core/TablePagination";
// import TableRow from "@material-ui/core/TableRow";
// import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import { TableCell } from "@material-ui/core";

///
/// List of offered services.
///
/// Props:
///     model: MainModel which holds every other model.
///

export default observer(
  class OfferedServicesPage extends Component {
    headerLinks = () => {
      let headerArray = [];
      
      headerArray.push(
        { 
          visible: true,
          label: "Back to Login",
          url: "/"
        }
      );

      return headerArray;
    }


    loadPreviousPage = () => {
      this.props.model.offeredModel.setPageNumber(-1);
    };
    loadNextPage = () => {
      this.props.model.offeredModel.setPageNumber(1);
    };
    handleChangeRowsPerPage = event => {
      this.props.model.offeredModel.setPageRow(event.target.value, 10);
    };

    render() {
      const links = this.headerLinks();
      const appName = this.props.model.getAppName();

      const page = this.props.model.offeredModel.getPageNumber();
      let offers = this.props.model.offeredModel.getOffers();
      let row = this.props.model.offeredModel.getPageRow();
      let maxPage = Math.ceil(offers.length / row);

      if (offers.length < row) {
        maxPage = 1;
      }

      let max = false;
      let min = false;

      if (page < 2) min = true;
      else min = false;
      if (page >= Math.ceil(offers.length / row)) max = true;
      else max = false;
      return (
        <Container>
          <HeaderMenu drawer={false}
              title={appName}
              page="" 
              menu={links}
              model={this.props.model.menuModel} />
              
          <div className="page">
            <Typography variant="h5">Offered Services</Typography>
            <div>
              <Paper>
                <Table>
                  <DisplayOfferRow props={this.props} />
                  <TablePagination
                    rowsPerPage="-1"
                    labelRowsPerPage=""
                    labelDisplayedRows={({ from, to, count }) =>
                      `${page}-${maxPage}`
                    }
                    page={page}
                    rowsPerPageOptions={[3, 5, { label: "All", value: -1 }]}
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

                  {/* <div>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <SearchIcon />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="input-with-icon-grid"
                        label="Find role"
                        onChange={this.findOffer}
                      />
                    </Grid>
                  </Grid>
                </div> */}
                </Table>
              </Paper>
            </div>
          </div>
        </Container>
      );
    }
  }
);
