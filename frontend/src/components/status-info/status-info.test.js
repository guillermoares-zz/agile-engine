import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer'
import StatusInfo, {STATUS_INFO_KIND} from './status-info';
import Alert from 'react-bootstrap/Alert';


describe('StatusInfo', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<StatusInfo/>)

    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('Rendering', () => {
    it('should show info messages', () => {
      const message = "some message"
      const kind = STATUS_INFO_KIND.INFO
      
      let wrapper = shallow(<StatusInfo message={message} kind={kind}/>);

      expect(wrapper.find(Alert).props().children).toEqual(message)
      expect(wrapper.find(Alert).props().variant).toEqual('info')
    });

    it('should show error messages', () => {
      const message = "some error message"
      const kind = STATUS_INFO_KIND.ERROR

      let wrapper = shallow(<StatusInfo message={message} kind={kind}/>);

      expect(wrapper.find(Alert).props().children).toEqual(message)
      expect(wrapper.find(Alert).props().variant).toEqual('danger')
    });

    it('should show success messages', () => {
      const message = "some success message"
      const kind = STATUS_INFO_KIND.SUCCESS

      let wrapper = shallow(<StatusInfo message={message} kind={kind}/>);

      expect(wrapper.find(Alert).props().children).toEqual(message)
      expect(wrapper.find(Alert).props().variant).toEqual('success')
    });
    
  })

})