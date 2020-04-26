import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PostScreen from '../../screens/PostScreen';

import renderer from 'react-test-renderer';

describe('<PostScreen />', () => {
  it('Should render the <PostScreen /> component', () => {
    const wrapper = shallow(<PostScreen />);
    expect(wrapper.find(PostScreen)).toMatchSnapshot();
  });
});


// test('renders correctly', () => {
//   const tree = renderer.create(<PostScreen />).toJSON();
//   expect(tree).toMatchSnapshot();
// });
