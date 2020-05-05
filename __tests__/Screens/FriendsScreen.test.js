import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FriendsScreen from '../../screens/FriendsScreen';

import renderer from 'react-test-renderer';

describe('<FriendsScreen />', () => {
  it('Should render the <FriendsScreen /> component', () => {
    const wrapper = shallow(<FriendsScreen />);
    expect(wrapper.find(FriendsScreen)).toMatchSnapshot();
  });
});

test('renders correctly', () => {
  const tree = renderer.create(<FriendsScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
