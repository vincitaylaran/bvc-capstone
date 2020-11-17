import React, { Component } from "react";
import { observer } from "mobx-react";
import DisplayRow from "./table-row-display.js";

/// Displaytable
export default observer(
  class DisplayTable extends Component {
    render() {
      const code = this.props.model.getCode();
      const desc = this.props.model.getDesc();
      const list = this.props.model.getTutees();

      return (
        <div>
          <hr />
          <div>Code: {code}</div>
          <div>Desc: {desc}</div>
          <div>
            {list.map((el, i) => {
              return <DisplayRow key={i} model={el} />;
            })}
          </div>
          <hr />
        </div>
      );
    }
  }
);
