# meet

Meet is a serverless, progressive web application (PWA) with React using a test-driven development (TDD) technique. The application uses the Google Calendar API to fetch upcoming events.

Key Features 
Filter Events By City 
Show/Hide an Event’s Details 
Specify Number of Events 
Use the APP When Offline 
Add an APP shortcut to the home screen
Data Visualization

Feature 1: Filter Events By City As a user I should be able to filter events by city so that I can see the list of events that take place in that city.

SCENARIO 1: When user hasn’t searched for a city, show upcoming events from all cities. Given user hasn’t searched for any city When the user opens the app Then the user should see a list of all upcoming events

SCENARIO 2: User should see a list of suggestions when they search for a city. Given the main page is open When user starts typing in the city textbox Then the user should see a list of cities (suggestions) that match what they’ve typed

SCENARIO 3: User can select a city from the suggested list. Given the user was typing “Berlin” in the city textbox And the list of suggested cities is showing When the user selects a city (e.g., “Berlin, Germany”) from the list Then their city should be changed to that city (i.e., “Berlin, Germany”) And the user should receive a list of upcoming events in that city


Feature 2: Show/Hide an Event’s Details As a user, I should be able to show and hide an event’s details so that I can see more or less details on an event.

SCENARIO 1: An event element is collapsed by default. Given a list of events When the user scrolls through the list Then the event details should be hidden

SCENARIO 2: User can expand an event to see its details. Given a list of events When the user clicks on ‘more details’ Then the event will expand to see its details.

SCENARIO 3: User can collapse an event to hide its details. Given an events details When the user clicks a button Then the event will collapse to hide its details.


Feature 3: Specify Number of Events As a user, I should be able to specify number of events I can see so that I can see more or less events at once.

SCENARIO 1: When user hasn’t specified a number, 32 is the default number. Given the user has not specified the number of events When shown the list of events Then the default number will be 32.

SCENARIO 2: User can change the number of events they want to see. Given the user has set the number of events they want to see (ex. 10) When shown the list of events Then they will see that number of events (again being 10)


Feature 4: Use The APP When Offline As a user, I should be able to use the app when offline so that the user can see the same list of events.

SCENARIO 1: Show cached data when there’s no internet connection. Given the user has no internet connection When the app is opened Then it will show cached data

SCENARIO 2: Show error when user changes the settings (city, time range). Given the user is offline When the user changes the settings (ex. City, time range) Then the app will show an error


Feature 5: Data Visualization As a user, I should be able to see a visual representation of the data so that I can see events by city.

SCENARIO 1: Show a chart with the number of upcoming events in each city. Given the user hasn’t specified a city When they open the app Then they will see a chart with the number of upcoming events in each city
