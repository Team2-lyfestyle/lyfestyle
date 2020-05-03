import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChatScreen from '../../screens/ChatScreen';

import renderer from 'react-test-renderer';

describe('<ChatScreen />', () => {
  it('Should render the <ChatScreen /> component', () => {
    const wrapper = shallow(<ChatScreen />);
    expect(wrapper.find(ChatScreen)).toMatchSnapshot();
  });
});


