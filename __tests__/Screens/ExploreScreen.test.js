import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExploreScreen from '../../screens/ExploreScreen';

import renderer from 'react-test-renderer';

describe('<ExploreScreen />', () => {
  it('Should render the <ExploreScreen /> component', () => {
    const wrapper = shallow(<ExploreScreen />);
    expect(wrapper.find(ExploreScreen)).toMatchSnapshot();
  });
});

test('renders correctly', () => {
  const tree = renderer.create(<ExploreScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
