import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignInScreen from '../../screens/SignInScreen';

import renderer from 'react-test-renderer';

describe('<SignInScreen />', () => {
  it('Should render the <SignInScreen /> component', () => {
    const wrapper = shallow(<SignInScreen />);
    expect(wrapper.find(SignInScreen)).toMatchSnapshot();
  });
});


test('renders correctly', () => {
  const tree = renderer.create(<SignInScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
