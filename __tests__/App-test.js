import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PostScreen from '../screens/PostScreen';

import renderer from 'react-test-renderer';

// configure({ adapter: new Adapter() });

// describe('<PostScreen />', () => {
//   it('Should render the <PostScreen /> component', () => {
//     const wrapper = shallow(<PostScreen />);
//     expect(wrapper.find(PostScreen)).toHaveLength(1);
//   });
// });

test('renders correctly', () => {
  const tree = renderer.create(<PostScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
