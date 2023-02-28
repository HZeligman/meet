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

// Define the App component as a class component
class App extends Component {
  // Define the initial state of the App component
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
  };

  // Method to update events based on location
  updateEvents = (location) => {
    // Call the getEvents function and filter events by location if a location is selected
    getEvents().then((events) => {
      const locationEvents =
        location === "all"
          ? events
          : events.filter((event) => event.location === location);
      // Update the events state with the filtered events
      this.setState({
        events: locationEvents,
      });
    });
  };

  // Function to generate data for the scatter chart
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

  // Function to update the number of events displayed
  updateNumberOfEvents = (event, value) => {
    this.setState({ numberOfEvents: value });
  };

  // Function called when the component is mounted
  async componentDidMount() {
    // Set the mounted property of the component to true
    this.mounted = true;

    // Get the access token from local storage
    const accessToken = localStorage.getItem("access_token");
    // Initialize variables to check if the token is valid and if a URL code is present
    let isTokenValid = false;
    let code = null;

    // Check if the app is online before attempting to check the token or URL code
    if (navigator.onLine) {
      // Check if the token is valid and set isTokenValid accordingly
      isTokenValid = (await checkToken(accessToken))?.error ? false : true;
      // Get the code from the URL query string
      const searchParams = new URLSearchParams(window.location.search);
      code = searchParams.get("code");
      // Set the showWelcomeScreen state based on whether the user is logged in or not
      const showWelcomeScreen = !accessToken && !isTokenValid && !code;
      this.setState({ showWelcomeScreen });
    } else {
      // If the app is offline, show the cached events
      const events = JSON.parse(localStorage.getItem("lastEvents")).events;
      this.setState({ events, locations: extractLocations(events) });
    }

    // Call the getEvents function only if the app is online and either the token is valid or a URL code is present
    if (navigator.onLine && (code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          // Update the events and locations states with the newly fetched events
          this.setState({ events, locations: extractLocations(events) });
        }
      });
    }
  }

  // Function called when the component is about to be unmounted
  componentWillUnmount() {
    // Set the mounted property of the component to false
    this.mounted = false;
  }

  // Method to render the App component
  render() {
    // Get the access token from local storage and set showWelcomeScreen accordingly
    const accessToken = localStorage.getItem("access_token");
    const showWelcomeScreen = !accessToken && navigator.onLine;
    // Get the events state from the component's state
    const { events } = this.state;

    return (
      <Container className="my-6" style={{ margin: "auto", width: "100%" }}>
        {!navigator.onLine && (
          // Show an alert if the app is offline
          <Alert variant="info">
            You are currently viewing cached data because the app is offline.
          </Alert>
        )}
        {events.length > 0 && (
          // Show the events and charts if there are events to display
          <>
            <h1>Coding Meetups</h1>
            {/* Render the CitySearch component */}
            <CitySearch
              locations={this.state.locations}
              updateEvents={this.updateEvents}
            />
            {/* Render the NumberOfEvents component */}
            <NumberOfEvents
              numOfEvents={this.state.numberOfEvents}
              updateNumberOfEvents={this.updateNumberOfEvents}
            />
            <div className="data-vis-wrapper">
              {/* Render the EventGenre component */}
              <EventGenre events={events} />
              <ResponsiveContainer height={400}>
                {/* Render the ScatterChart and its children */}
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
                  {/* Render the Scatter component and pass in data */}
                  <Scatter data={this.getData()} fill="#F2BB05" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="EventList-container">
              {/* Render the EventList component and pass in data */}
              <EventList
                events={events}
                numberOfEvents={this.state.numberOfEvents}
              />
            </div>
          </>
        )}
        {showWelcomeScreen && !events.length && (
          // Show the welcome screen if the user is not logged in and there are no events to display
          <WelcomeScreen
            showWelcomeScreen={showWelcomeScreen}
            getAccessToken={getAccessToken}
          />
        )}
      </Container>
    );
  }
}
// Export the App component as the default export
export default App;
