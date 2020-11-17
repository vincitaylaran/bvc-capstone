import React, { Component } from "react";

import { observer } from "mobx-react";
import { toast } from "react-toastify";

import AddTimeSlot from "../components/user-time-slot";
import Scheduelcheckbox from "../components/SchedulerCheckBoxes";
import LoadingComponent from "../components/component-loading.js";

import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

///
/// UserSchedule - form for user schedule.
/// Props:
///     model - MainModel
///     sid - user sid
export default observer(
  class UserSchedule extends Component {
    constructor(props) {
      super(props);

      this.state = { sid: "", loaded: false, validation: false };
    }

    /*
    // IF THIS WILL BE A COMPONENT...
    headerLinks = () => {
      let headerArray = [];
      
      const canUsers = this.props.model.getCanUsers();
      const sid = this.state.sid;
      const userDetail = "/user/" + sid;

      headerArray.push(
        { 
          visible: canUsers,
          label: "User Details",
          url: userDetail
        }
      );

      headerArray.push(
        { 
          visible: canUsers,
          label: "List of Users",
          url: "/users"
        }
      );
      
      return headerArray;
    }
    */

    async componentDidMount() {
      /****************
        Vinci's code
        OPEN YOUR CONSOLE
       ****************/
      const userSid = this.props.model.getSid();
      const sid = this.props.sid;

      let userSchedule = [];
      if (sid === "" || sid === undefined) {
        this.setState({ sid: userSid });
        userSchedule = await this.props.model.userModel.getSchedule(
          userSid,
          userSid
        );
        this.setState({ loaded: true, validation: userSchedule.success });
      } else {
        this.setState({ sid: sid });
        userSchedule = await this.props.model.userModel.getSchedule(
          sid,
          userSid
        );
        this.setState({ loaded: true, validation: userSchedule.success });
      }

      // CODE BELOW ADDS TO THE ADMIN'S SCHEDULE.
      // await this.props.model.userModel.addToSchedule(
      //   userSid,
      //   "Friday",
      //   "3:00 PM",
      //   "3:30 PM",
      //   services
      // );

      /****************
        Ismael's code
       ****************/
      await this.props.model.userModel.setUserName(sid);
      //await this.props.model.userModel.fetchUserTimeSlots(sid);
    }
    saveStartTime = (event) => {
      var t = event.target.value;
      var [h, m] = t.split(":");
      this.props.model.userModel.setStartTime(h, m);
    };
    saveEndTime = (event) => {
      var t = event.target.value;
      var [h, m] = t.split(":");
      this.props.model.userModel.setEndTime(h, m);
    };
    saveDay = (event) => {
      var day = event.target.value;
      this.props.model.userModel.setDay(day);
    };
    submitInfo = async () => {
      const sid = this.state.sid;
      let day = this.props.model.userModel.getDay();
      let start = this.props.model.userModel.getStart();
      let end = this.props.model.userModel.getEnd();
      let startAMPM = "AM";
      let endAMPM = "AM";
      const userSid = this.props.model.getSid();

      if (start.h >= 21) {
        toast.warn("Late start.", { className: "toast-warning toast-base" });
      } else if (start.h <= 5) {
        toast.warn("Early start.", { className: "toast-warning toast-base" });
      } else if (end.h >= 21) {
        toast.warn("Late finish.", { className: "toast-warning toast-base" });
      }

      if (day === "") {
        toast.warn("Day missing", { className: "toast-warning toast-base" });
      } else if (start.h > end.h) {
        toast.warn("Start time cannot be after end time.", {
          className: "toast-warning toast-base",
        });
      } else if (start.h === end.h && start.m >= end.m + 15) {
        toast.warn("Start time too close to end time.", {
          className: "toast-warning toast-base",
        });
      } else if (start.h === end.h && start.m === end.m) {
        toast.warn("Start time too close to end time.", {
          className: "toast-warning toast-base",
        });
      } else {
        if (start.h > 12) {
          start.h -= 12;
          start.h = ("0" + start.h).slice(-2);
          startAMPM = "PM";
        }
        if (end.h > 12) {
          end.h -= 12;
          end.h = ("0" + end.h).slice(-2);
          endAMPM = "PM";
        }
        await this.props.model.userModel.addToSchedule(
          sid,
          day,
          start.h + ":" + start.m + " " + startAMPM,
          end.h + ":" + end.m + " " + endAMPM
        );
        await this.props.model.userModel.getSchedule(this.state.sid, userSid);
      }
      await this.props.model.userModel.getSchedule(this.state.sid, userSid);
    };
    // callbackFunction = Validation => {
    //   this.setState({ validation: Validation, loaded: true });
    // };

    render() {
      const sid = this.props.sid;
      let day = this.props.model.userModel.getDay();
      let render = <></>;
      if (this.state.validation) {
        render = (
          <>
            <FormControl>
              <InputLabel>Day</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={day}
                onChange={this.saveDay}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Monday"}>Monday</MenuItem>
                <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                <MenuItem value={"Thursday"}>Thursday</MenuItem>
                <MenuItem value={"Friday"}>Friday</MenuItem>
                <MenuItem value={"Saturday"}>Saturday</MenuItem>
                <MenuItem value={"Sunday"}>Sunday</MenuItem>
              </Select>
            </FormControl>
            <div>
              <TextField
                id="from"
                label="Start"
                type="time"
                onChange={this.saveStartTime}
                defaultValue="06:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
              <h2> to </h2>
              <TextField
                id="to"
                label="End"
                type="time"
                onChange={this.saveEndTime}
                defaultValue="08:30"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </div>
            <Scheduelcheckbox props={this.props} />
            <Button
              className="button"
              onClick={this.submitInfo}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              type="submit"
            >
              Add
            </Button>
          </>
        );
      } else if (!this.state.loaded) render = <LoadingComponent text="Loading Schedule..." />;
      else if (this.state.loaded && !this.state.validation)
        render = <LoadingComponent text="Loading Schedule..." />;

      return (
        <div>
          {render}
          <AddTimeSlot
            // parentCallback={this.callbackFunction}
            pstate={this.state}
            props={this.props}
            sid={sid}
          />
        </div>
      );
    }
  }
);
