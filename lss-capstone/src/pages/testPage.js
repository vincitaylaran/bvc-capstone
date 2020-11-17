import React, { Component } from "react";
import { toast } from "react-toastify";

// import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
// import Icon from "@material-ui/core/Icon";
import { ServiceFields } from "../components/form-serviceFields.js";

/// This is a temporary page to hold test elements.
/// Made by Dylan.
/// TODO: Delete this page.
export class TestPage extends Component {
  /// Successful toast example.
  DisplayToast1 = () =>
    toast.success("I am very proud.", {
      className: "toast-success toast-base"
    });
  DisplayToast2 = () =>
    toast.error("Oof, big problem", {
      className: "toast-failure toast-base"
    });

  DisplayToast3 = () =>
    toast.warn("Little problem.", {
      className: "toast-warning toast-base"
    });

  render() {
    return (
      <div>
        <h2>Welcome</h2>
        <button onClick={this.DisplayToast1}>
          Show me the good toast.
        </button>{" "}
        <br />
        <button onClick={this.DisplayToast2}>
          Show me the burnt toast.
        </button>{" "}
        <br />
        <button onClick={this.DisplayToast3}>
          Show me the getting burnt toast.
        </button>
        <ServiceFields />
      </div>
    );
  }
}
