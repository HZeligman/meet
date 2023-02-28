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
    locations: [],
    numberOfEvents: 32,
  };

  updateEvents = (location) => {
    getEvents().then((events) => {
      const locationEvents =
        location === "all"
          ? events
          : events.filter((event) => event.location === location);
      this.setState({
        events: locationEvents,
      });
    });
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter(
        (event) => event.location === location
      ).length;
      const city = location.split(", ").shift();
      return { city, number };
    });
    return data;
  };

  updateNumberOfEvents = (event, value) => {
    this.setState({ numberOfEvents: value });
  };

  async componentDidMount() {
    this.mounted = true;

    const accessToken = localStorage.getItem("access_token");
    let isTokenValid = false;
    let code = null;

    if (navigator.onLine) {
      isTokenValid = (await checkToken(accessToken))?.error ? false : true;
      const searchParams = new URLSearchParams(window.location.search);
      code = searchParams.get("code");
      const showWelcomeScreen = !accessToken && !isTokenValid && !code;
      this.setState({ showWelcomeScreen });
    } else {
      const events = JSON.parse(localStorage.getItem("lastEvents")).events;
      this.setState({ events, locations: extractLocations(events) });
    }

    if (navigator.onLine && (code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({ events, locations: extractLocations(events) });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const accessToken = localStorage.getItem("access_token");
    const showWelcomeScreen = !accessToken && navigator.onLine;
    const { events } = this.state;

    return (
      <Container className="my-6" style={{ margin: "auto", width: "100%" }}>
        {!navigator.onLine && (
          <Alert variant="info">
            You are currently viewing cached data because the app is offline.
          </Alert>
        )}
        {events.length > 0 && (
          <>
            <h1>Coding Meetups</h1>
            <CitySearch
              locations={this.state.locations}
              updateEvents={this.updateEvents}
            />
            <NumberOfEvents
              numOfEvents={this.state.numberOfEvents}
              updateNumberOfEvents={this.updateNumberOfEvents}
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
            <div className="EventList-container">
              <EventList
                events={events}
                numberOfEvents={this.state.numberOfEvents}
              />
            </div>
          </>
        )}
        {showWelcomeScreen && !events.length && (
          <WelcomeScreen
            showWelcomeScreen={showWelcomeScreen}
            getAccessToken={getAccessToken}
          />
        )}
      </Container>
    );
  }
}

export default App;
