import React from 'react';
import {act} from 'react-dom/test-utils'
import {shallow} from 'enzyme';
import RefreshButton from './refresh-button';
import renderer from 'react-test-renderer'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


describe('App', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<RefreshButton/>)

    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('should be disabled and spinning when a refresh is in progress', () => {
      let wrapper = shallow(<RefreshButton isRefreshing={true} refreshAction={() => null} />);
      
      expect(wrapper.find(Button).props().disabled).toBe(true)
      expect(wrapper.find(Spinner).length).toBe(1)
    });
    
    it('should be enabled when a refresh is not in progress', () => {
      let wrapper = shallow(<RefreshButton isRefreshing={false} refreshAction={() => null} />);
      
      expect(wrapper.find(Button).props().disabled).toBe(false)
      expect(wrapper.find(Spinner).length).toBe(0)
    });

    it('should call refreshAction when clicked', () => {
      const refreshAction = jest.fn() 
      
      let wrapper = shallow(<RefreshButton isRefreshing={false} refreshAction={refreshAction} />);
      
      wrapper.find(Button).simulate('click')

      expect(refreshAction).toBeCalled()
    });
  })

})