import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RegisterScreen from '../../screens/RegisterScreen.js';

import renderer from 'react-test-renderer';

describe('<RegisterScreen />', () => {
  it('Should render the <RegisterScreen /> component', () => {
    const wrapper = shallow(<RegisterScreen />);
    expect(wrapper.find(RegisterScreen)).toMatchSnapshot();
  });
});


test('renders correctly', () => {
  const tree = renderer.create(<RegisterScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
