import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

/** PROPS
 * @list: array of objects
 */
export default observer(
  class DisplayServiceRow extends Component {
    findService = event => {
      if (event.target.value === "") {
        this.props.model.serviceModel.getServicesData();
      }
      this.props.model.serviceModel.setfindService(event.target.value);
    };

    serviceRows = () => {
      let services = this.props.model.serviceModel.getServicesList();

      let page = this.props.model.serviceModel.getPageNumber();
      let rowperpage = this.props.model.serviceModel.getPageRow();
      let row = [];

      if (services.length > 0) {
        for (
          let i = (page - 1) * rowperpage;
          i < (page - 1) * rowperpage + rowperpage;
          i++
        ) {
          if (services[i] === undefined) continue;

          row.push(
            <div key={i} className="rows-list-row">
              <div className="rows-col-1">
                <Typography>
                  <Link to={"/service/" + services[i].code}>
                    {services[i].desc}
                  </Link>
                </Typography>
              </div>
            </div>
          );
        }
      } else
        row.push(
          <div className="rows-list-row">
            <Typography>No results found.</Typography>
          </div>
        );

      return row;
    };

    render() {
      return this.serviceRows();
    }
  }
);
