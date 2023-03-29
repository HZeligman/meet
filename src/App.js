import React, { Component } from "react";
import "./App.css";
import EventList from "./EventList";
import CitySearch from "./CitySearch";
import NumberOfEvents from "./NumberOfEvents";
import WelcomeScreen from "./WelcomeScreen";
import { getEvents, extractLocations, getAccessToken, checkToken } from "./api";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EventGenre from "./EventGenre";
import "./nprogress.css";
import { Container, Alert } from "react-bootstrap";

class App extends Component {
  state = {
    events: [],
    page: null,
    currentLocation: 'all',
    offlineText: '',
    locations: [],
    numberOfEvents: 32,
    tokenCheck: false,
  };

  async componentDidMount() {
    const accessToken = localStorage.getItem("access_token");
    const validToken = accessToken !== null ? await checkToken(accessToken) : false;
    this.setState({ tokenCheck: validToken });
    if (validToken === true) this.updateEvents()
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

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
      const number = events.filter(
        (event) => event.location === location
      ).length;
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
          location === 'all'
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
          currentLocation === 'all'
            ? response.events
            : response.events.filter(
              (event) => event.location === currentLocation
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
    //const showWelcomeScreen = !accessToken && navigator.onLine;

    return tokenCheck === false ? (
      <div className="App">
        <h1>Meet App</h1>
        <h4>Choose Your Nearest City</h4>
        <CitySearch updateEvents={this.updateEvents} locations={locations} />
        <NumberOfEvents
          updateEvents={this, updateEvents}
          numberOfEvents={numberOfEvents}
        />
        <div className="data-vis-wrapper">
          <EventGenre events={events} />
          <ResponsiveContainer height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis
                type="category"
                dataKey="city"
                name="city"
                tick={{ fill: "#f2f4f6" }}
              />
              <YAxis
                type="number"
                dataKey="number"
                name="number of events"
                tick={{ fill: "#f2f4f6" }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={this.getData()} fill="#F2BB05" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <EventList events={events} />
      </div>
    );
  }
}

export default App;
