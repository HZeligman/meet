import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, checkToken, getToken } from './api';
import './nprogress.css';



class App extends Component {
  state = {
    events: [],
    page: null,
    locations: [],
    currentLocation: 'all',
    numberOfEvents: 32,
    tokenCheck: false,
    offlineText: '',
  }

  async componentDidMount() {
    const accessToken = localStorage.getItem("access_token");
    const validToken = accessToken !== null ? await checkToken(accessToken) : false;
    this.setState({ tokenCheck: validToken });
    if (validToken === true) this.updateEvents()
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    this.mounted = true;
    if (code && this.mounted === true && validToken === false) {
      this.setState({ tokenCheck: true });
      this.updateEvents()
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length;
      const city = location.split(" ").shift();
      return { city, number };
    });
    return data;
  };

  updateEvents = (location, eventCount) => {
    console.log('update events token valid: ', this.state.tokenCheck)
    const { currentLocation, numberOfEvents } = this.state;
    if (location) {
      getEvents().then((response) => {
        const locationEvents =
          location === "all"
            ? response.events
            : response.events.filter((event) => event.location === location);
        const events = locationEvents.slice(0, numberOfEvents);
        return this.setState({
          events: events,
          currentLocation: location,
          locations: response.locations,
        });
      });
    } else {
      getEvents().then((response) => {
        const locationEvents =
          currentLocation === "all"
            ? response.events
            : response.events.filter(
              (evemt) => event.location === currentLocation
            );
        const events = locationEvents.slice(0, eventCount);
        return this.setState({
          events: events,
          numberOfEvents: eventCount,
          locations: response.locations,
        });
      });
    }
  };

  render() {
    const { locations, numberOfEvents, events, tokenCheck } = this.state;
    return tokenCheck === false ? (
      <div className="App">
        <h1>Meet App</h1>
        <h4>Choose your nearest city.</h4>
        <CitySearch updateEvents={this.updateEvents} locations={locations} />
        <NumberOfEvents
          updateEvents={this.updateEvents}
          numberOfEvents={numberOfEvents}
        />
      </div>
    )
      :};
}

export default App;
