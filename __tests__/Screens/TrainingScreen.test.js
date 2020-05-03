import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TrainingScreen from '../../screens/TrainingScreen';

import renderer from 'react-test-renderer';

describe('<TrainingScreen />', () => {
  it('Should render the <TrainingScreen /> component', () => {
    const wrapper = shallow(<TrainingScreen />);
    expect(wrapper.find(TrainingScreen)).toMatchSnapshot();
  });
});

test('renders correctly', () => {
  const tree = renderer.create(<TrainingScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
