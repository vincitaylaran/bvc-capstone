import React, { Component } from "react";

import AppointmentCalendar from "../components/panels-setAppointment";

class Appointment extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <AppointmentCalendar
          model={this.props.model}
          serviceSid={this.props.match.params.sid}
        />
      </div>
    );
  }
}

export default Appointment;
