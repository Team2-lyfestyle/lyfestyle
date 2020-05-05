import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

// configure({ adapter: new Adapter() });
describe('<App/>', () => {
  it('Should render the <App /> component', () => {
    const appComponent = shallow(<App/>);
    expect(appComponent).toMatchSnapshot();
  });
});
