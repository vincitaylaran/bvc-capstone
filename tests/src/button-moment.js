import React, { Component } from "react";
import moment from "moment";

class MomentButton extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //   onTime = () => {
  //     let time = moment(23.5, "h hh");
  //     console.log(time.format("LT"));
  //   };

  render() {
    // let time = moment(23, "h hh");
    let t1 = moment({ hour: 23, minute: 0, second: 0 });
    let t2 = "9:00 AM";
    console.log(t1.format("LT"));
    console.log(
      moment()
        .add(30, "minutes")
        .format(t2)
    );
    return (
      <div>
        <h1>Moment.js test</h1>
        <button onClick={this.onTime}>Open your console!</button>
      </div>
    );
  }
}

export default MomentButton;
