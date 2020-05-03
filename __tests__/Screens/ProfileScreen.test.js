import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProfileScreen from '../../screens/ProfileScreen';

import renderer from 'react-test-renderer';

describe('<ProfileScreen />', () => {
  it('Should render the <ProfileScreen /> component', () => {
    const wrapper = shallow(<ProfileScreen />);
    expect(wrapper.find(ProfileScreen)).toMatchSnapshot();
  });
});


test('renders correctly', () => {
  const tree = renderer.create(<ProfileScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
