import React, { Component } from "react";
import { observer } from "mobx-react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
// import ErrorPage from "../pages/page-error";

export default observer(
  class AddTimeSlot extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true, validation: false };
    }

    timeSlot = () => {
      let slot = [];
      let list = this.props.props.model.userModel.getListOfTime();

      for (let i = 0; i < list.length; i++) {
        try {
          slot.push(
            <TableRow>
              <TableCell>
                {list[i].day} From: {list[i].startTime} To: {list[i].endTime}
              </TableCell>
              <TableCell>service: {list[i].service_sid}</TableCell>
              <TableCell>
                <Button
                  className="button"
                  variant="contained"
                  color="primary"
                  startIcon={<HighlightOffIcon />}
                  onClick={this.deleteTimeSlot}
                  value={list[i]._id}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        } catch (Exeption) {}
      }

      return slot;
    };

    deleteTimeSlot = async (e) => {
      let objId = e.currentTarget.value;
      let sid = this.props.props.model.sid;

      this.props.props.model.userModel.removeTimeSlot(objId, sid);
    };

    render() {
      let render = <div>loading...</div>;
      if (!this.props.pstate.validation) render = <></>;
      else if (!this.props.pstate.loading) render = this.timeSlot();
      return <div>{render}</div>;
    }
  }
);
