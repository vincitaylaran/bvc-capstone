import React, { Component } from "react";
import ".././styles/form-colourSelection.css";

/// Props:
///   @onSelect: expects callback function that component uses to signal parent.
///   @defaultValue: The default colour to be displayed.
export class ColourSelection extends Component {
  /// Displays the selected colour at the bottom of the component.
  /// Params:
  ///   @colour: The colour to be displayed.
  displayColour = colour => {
    // Display the selected colour.
    let selectionView = document.getElementsByClassName("selection");
    selectionView[0].setAttribute("id", colour);
  };

  /// Sends callback to parent with the colour value selected by the user
  /// Params:
  ///   @colour - The colour to be sent to the parent.
  selectColour = colour => {
    this.displayColour(colour);

    if(this.props.onSelect) {
      this.props.onSelect(colour);
    }
  };

  ///
  render() {
    return (
      <div className="colour-component-container">
        <h4>Select theme colour</h4>
        <div className="colour-container">
          <div
            id="cool-pink"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="bubblegum"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="fresh-lavender"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="golly-purple"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="deep-purple"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />

          <div
            id="navy"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="lovely-blue"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="sky"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="oceania"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="lush"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />

          <div
            id="sunflower"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="lorange"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="pumpkin-pie"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="brighter-red"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
          <div
            id="almost-maroon"
            className="colour-button"
            onClick={e => this.selectColour(e.target.id)}
          />
        </div>

        <div className="display-selection">
          {this.props.defaultValue !== undefined ||
          this.props.defaultValue !== "" ||
          this.props.defaultValue !== null ? (
            <div className="selection" id={this.props.defaultValue}></div>
          ) : (
            <div className="selection" id="default"></div>
          )}
        </div>
      </div>
    );
  }
}
