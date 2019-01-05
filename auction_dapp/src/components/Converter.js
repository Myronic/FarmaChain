import React, { Component } from "react";
import "./Converter.css";

class Converter extends Component {
  state = {
    result: null,
    amount: 1
  };

  // Event handler for the conversion
  convertHandler = () => {
    this.setState({ result: this.state.amount * 10890 });
  };

  render() {
    return (
      <div className="Converter text-left">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <i className="fas fa-calculator" />
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" id="exampleModalLabel">
                  <span>Ether </span>
                  &#9830; <span>Converter </span>
                </h2>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="Form">
                  <input
                    name="amount"
                    type="text"
                    placeholder="Enter in ethers"
                    // value={this.state.amount}
                    onChange={event =>
                      this.setState({ amount: event.target.value })
                    }
                  />
                  <button onClick={this.convertHandler}>Convert</button>
                </div>
              </div>

              <div className="modal-footer">
                {this.state.result && <h3>₹ {this.state.result}</h3>}
                {/* <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Converter;
