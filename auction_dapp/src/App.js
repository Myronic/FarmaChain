import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import auction from "./auction";
import "bootstrap/dist/css/bootstrap.min.css";
import Clock from "./components/Clock";
import Scheduler from "./components/Scheduler";
import Converter from "./components/Converter";
import Cd from "./components/Cd";

class App extends Component {
  state = {
    manager: "",
    latestBid: "",
    latestBidder: "",
    seller: "",
    balance: "",
    auctionValue: "",
    bidValue: "",
    closingRemark: "",
    t: "",
    flag: 0,
    time: {},
    seconds: ""
  };

  constructor(props) {
    super(props);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    var seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    // Check if we're at zero.
    if (seconds === 0) {
      alert("hiii");
      clearInterval(this.timer);
    }
  }

  async componentDidMount() {
    console.log("mount", this.state);

    const manager = await auction.methods.manager().call();
    const latestBid = await auction.methods.latestBid().call();
    const latestBidder = await auction.methods.latestBidder().call();
    const seller = await auction.methods.seller().call();
    const balance = await web3.eth.getBalance(auction.options.address);
    this.setState({ manager, latestBid, latestBidder, seller, balance });
  }

  onAuctionSubmit = async event => {
    event.preventDefault();
    this.setState({ t: new Date().getTime() });
    this.setState({ flag: 1 });

    const accounts = await web3.eth.getAccounts();
    await auction.methods.auction(this.state.auctionValue).send({
      from: accounts[0]
    });
    this.setState({ seller: accounts[0] });
  };

  onBidSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const weiAmount = web3.utils.toWei(this.state.bidValue, "ether");
    await auction.methods.bid().send({
      from: accounts[0],
      value: weiAmount
    });
    this.setState({
      latestBid: weiAmount,
      balance: weiAmount,
      latestBidder: accounts[0]
    });
  };

  onFinishSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await auction.methods.finishAuction().send({
      from: accounts[0]
    });
    this.setState(state => ({ seconds: "59" }));
    this.setState({ closingRemark: "Auction has been closed." });
    this.setState(state => ({ latestBid: "0" }));
    this.setState(state => ({ latestBidder: "0" }));
    this.setState(state => ({ balance: "0" }));
    this.setState(state => ({ seller: "0" }));
  };

  render() {
    console.log("render", this.state);
    return (
      <div className="container">
        <Clock time1={this.state.t} />

        <span id="drag">
          <Scheduler />
        </span>
        <div className="jumbotron mt-3 jumbotron-primary" id="">
          <b>
            <h1 className="text-center" id="heading">
              AUCTION CONTRACT
            </h1>
          </b>
          <hr className="my-4" />
          <table className="table table-striped">
            <tbody>
              <tr>
                {" "}
                <td>
                  <h5>
                    <span className="text-secondary">AUCTION MANAGER</span>
                  </h5>
                </td>
                <td>
                  <h5>
                    <span className="lead">{this.state.manager}</span>
                  </h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>The seller is:</h5>
                </td>
                <td>
                  <h5>
                    <span className="lead"> {this.state.seller} </span>
                  </h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Latest Bidder:</h5>
                </td>
                <td>
                  <h5>
                    <span className="lead"> {this.state.latestBidder}. </span>
                  </h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Latest Bid:</h5>
                </td>
                <td>
                  <h5>
                    <span className="lead">
                      {web3.utils.fromWei(this.state.latestBid, "ether")} ether
                    </span>
                  </h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Balance In Contract</h5>
                </td>
                <td>
                  <h5>
                    <span className="lead">
                      {web3.utils.fromWei(this.state.balance, "ether")} ether
                    </span>
                  </h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />

        {/* <h4>Auction by seller</h4> */}
        {/* <div>
          <label>Auction limit</label>
          <input  value={this.state.auctionValue}  onChange={event => this.setState({ auctionValue: event.target.value })}/>
        </div> */}
        {/* <button onClick={this.onAuctionSubmit}>Auction</button> */}

        <div className="card mb-3 ">
          <div className="card-header ">
            <h3 className="card-title">Auction by Seller</h3>
            <h6 className="card-subtitle text-muted">Auction details:</h6>
          </div>
          <div className="card-body text-center">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Auction Limit: ♦</span>
              </div>
              <input
                type="text"
                className="form-control"
                aria-label="Enter in ethers"
                placeholder="Set auction amount"
                value={this.state.auctionValue}
                onChange={event =>
                  this.setState({ auctionValue: event.target.value })
                }
              />
              <div className="input-group-append">
                <span className="input-group-text">.00</span>
                <button
                  className="btn btn-secondary"
                  onClick={this.onAuctionSubmit}
                  type="button"
                  id="button-addon2"
                >
                  <Cd />
                </button>
              </div>

              {/* <Cd flag={this.state.flag} /> */}
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-2">
            <Converter />
          </div>
          <div className="col-10">
            <div className="card mb-3 ">
              <div className="card-header ">
                <h3 className="card-title">Bidding Form</h3>
                <h6 className="card-subtitle text-muted">Bidding details:</h6>
              </div>
              <div className="card-body text-center">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Bid Amount: ♦</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Enter in ethers"
                    placeholder="Enter bid here"
                    value={this.state.bidValue}
                    onChange={event =>
                      this.setState({ bidValue: event.target.value })
                    }
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">.00</span>
                    <button
                      className="btn btn-secondary"
                      onClick={this.onBidSubmit}
                      type="button"
                      id="button-addon2"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg"
            // onClick={() => {
            //   setTimeout(
            //     function() {
            //       this.setState({ flag: 1 });
            //       alert(this.state.flag);
            //     }.bind(this),
            //     3000
            //   );
            // }}
            onClick={this.onFinishSubmit}
          >
            Close Auction <i className="fas fa-gavel" />
          </button>
        </div>
        <p>{this.state.closingRemark}</p>
      </div>
    );
  }
}

export default App;
