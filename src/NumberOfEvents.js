import React, { Component } from 'react';

class NumberOfEvents extends Component {

  state = { eventCount: 32 }

  handleInputChanged = (e) => {
    const inputValue = e.target.value;
    this.props.updateEvents(null, inputValue);
    this.setState({
      eventCount: inputValue,
    })
  }

  render() {
    const { noe } = this.state;
    return (
      <div className="NumberOfEvents">
        <h3># of Events:</h3>
        <input
          className="noe-input"
          type="number"
          value={noe}
          onChange={event => {
            this.handleInputChanged(event);
          }}
        >
        </input>
      </div>
    )
  }

}

export default NumberOfEvents;