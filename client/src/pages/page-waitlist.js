import React, { Component } from "react";

import { observer } from "mobx-react";

import TutorWaitlist from "../components/table-dashboard-waitlist";

import Typography from "@material-ui/core/Typography";

///
/// PROPS
/// @model: should be the main model.
///
export default observer(
  class Waitlist extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    render() {
      return (
        <div>
          <Typography variant="h3" align="center">
            Waitlist
          </Typography>
          <TutorWaitlist model={this.props.model} />
        </div>
      );
    }
  }
);
