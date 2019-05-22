import React from 'react';
import { shallow } from 'enzyme';

import App from '../../client/src/components/App.jsx';

import Calendar from '../../client/src/components/Calendar.jsx';


describe('App', () => {
  it('<App/> components should be defined', () => {
    const app = shallow(<App />);
    const { listing } = app.state();
    expect(listing).toBeDefined();
    expect(App).toBeDefined();
    console.log(app.find(Calendar));
    // expect(wrapper.find(Calendar)).to.have.lengthOf(1);
  });
});
