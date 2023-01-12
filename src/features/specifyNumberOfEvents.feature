Feature: Specify Number of Events
  
  Scenario: When user has not specified a number, 32 is the default number.
    Given the app has loaded
    When the user has yet to choose a number of events in the input box
    Then a default number of 32 events is loaded.

  Scenario: User can change the number of events they want to see.
    Given the app has loaded
    When user changes the number of events in the input box
    Then the event list shows the number of events chosen by the user.