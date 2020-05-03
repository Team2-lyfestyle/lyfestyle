import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChatSelectScreen from '../../screens/ChatSelectScreen';

import renderer from 'react-test-renderer';

describe('<ChatSelectScreen />', () => {
  it('Should render the <ChatSelectScreen /> component', () => {
    const wrapper = shallow(<ChatSelectScreen />);
    expect(wrapper.find(ChatSelectScreen)).toMatchSnapshot();
  });
});


test('renders correctly', () => {
  const tree = renderer.create(<ChatSelectScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
