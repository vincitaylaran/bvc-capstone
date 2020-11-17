import React, { Component } from "react";
import { observer } from "mobx-react";
import DisplayTable from "./table-display.js";
import MomentButton from "./button-moment";
/// App
export default observer(
  class App extends Component {
    updateService = () => {
      this.props.model.service.setCode("Reboot");
      this.props.model.service.setDesc("Reboot");
    };

    componentDidMount() {}

    login = async () => {
      this.props.model.login();
    };

    loadDisplay = async () => {
      this.props.model.loadDisplay();
    };

    displayTable = () => {};

    ///
    render() {
      const walkins = this.props.model.getDisplay();

      return (
        <div>
          <button onClick={this.updateService}>Click</button>
          <button onClick={this.login}>Login</button>
          <button onClick={this.loadDisplay}>Get Display List</button>
          <button onClick={this.displayTable}>Display Table</button>
          <div>
            {walkins.map((el, i) => {
              return <DisplayTable key={i} model={el} />;
            })}
          </div>
          <MomentButton />
        </div>
      );
    }
  }
);

//export default App;
