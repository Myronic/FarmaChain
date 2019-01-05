import React from "react";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().getTime()
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      time: new Date().getTime()
    });
    //console.log(this.props.time1);
    // console.log(this.state.time);
  }
  render() {
    return <div />;
  }
}

export default Clock;
