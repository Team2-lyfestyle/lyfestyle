import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomeScreen from '../../screens/HomeScreen';

import renderer from 'react-test-renderer';

describe('<HomeScreen />', () => {
  it('Should render the <HomeScreen /> component', () => {
    const wrapper = shallow(<HomeScreen />);
    expect(wrapper.find(HomeScreen)).toMatchSnapshot();
  });
});


