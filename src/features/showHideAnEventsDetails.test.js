import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { mount } from 'enzyme';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  let AppWrapper;

  test('An event element is collapsed by default.', ({ given, when, then }) => {
    given('a collapsed event element containing events is loaded on the page', () => {

    });

    when('the user opens the app and performs no action', () => {
      AppWrapper = mount(<App />);
    });

    then('the event element is collapsed by default.', () => {
      AppWrapper.update();
      expect(AppWrapper.find('.event.event-details')).toHaveLength(0);
    });
  });

  test('User can expand an event to see its details.', ({ given, when, then }) => {
    given('the event list and event elements have loaded', () => {
      AppWrapper = mount(<App />);
    });

    when('the user clicks on a details button in the event element', () => {
      AppWrapper.update();
      AppWrapper.find('.event .show-details').at(0).simulate('click');
    });

    then('the event element will expand to show details about the specific event chosen.', () => {
      expect(AppWrapper.find('.event .details')).toHaveLength(1);
    });
  });

  test('User can collapse an event to hide its details.', ({ given, when, then }) => {
    given('the event element is showing the event details', () => {
      AppWrapper = await mount(<App />);
      AppWrapper.update();
      AppWrapper.find('.event .show-details').at(0).simulate('click');
    });

    when('the user clicks on the details button again', () => {
      AppWrapper.update();
      AppWrapper.find('.event .hide-details').at(0).simulate('click');
    });

    then('the event details part of the event element is collapsed.', () => {
      expect(AppWrapper.find('.event .event-details')).toHaveLength(0);
    });
  });
})
